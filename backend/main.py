from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import firestore
from pydantic import BaseModel
from typing import Dict, List, Optional
import datetime
import re

from database import db, update_user_budget_settings, get_user_budget_settings
from schemas import BudgetUpdate, TransactionCreate

app = FastAPI(title="SpendWise Multi-User API")
# CORS Middleware Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for mobile app access
    allow_credentials=True,
    allow_methods=["*"],  # Allows GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
async def root():
    return {"message": "SpendWise Backend is Online"}
# --- DATA MODELS ---

class GoalUpdate(BaseModel):
    id: str
    name: str
    target: float
    current: float
    deadline: str
    user_id: str

class Reminder(BaseModel):
    id: str
    name: str
    amount: float
    dueDate: str
    type: str
    user_id: str

# --- ALERTS / REMINDERS ENDPOINTS ---

@app.get("/reminders/{user_id}")
async def get_reminders(user_id: str):
    """ Fetches all active alerts/reminders for a user """
    try:
        docs = db.collection('users').document(user_id).collection('reminders').stream()
        return [{**doc.to_dict(), "id": doc.id} for doc in docs]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/reminders")
async def save_reminder(rem: Reminder):
    """ Saves or updates a reminder """
    try:
        doc_ref = db.collection('users').document(rem.user_id).collection('reminders').document(rem.id)
        doc_ref.set(rem.dict())
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/reminders/{user_id}/{rem_id}")
async def delete_reminder(user_id: str, rem_id: str):
    """ Deletes a specific reminder """
    try:
        db.collection('users').document(user_id).collection('reminders').document(rem_id).delete()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- GOALS ENDPOINTS ---

@app.get("/goals/{user_id}")
async def get_goals(user_id: str):
    try:
        docs = db.collection('users').document(user_id).collection('goals').stream()
        return [{**doc.to_dict(), "id": doc.id} for doc in docs]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/goals")
async def create_goal(goal: GoalUpdate):
    try:
        doc_ref = db.collection('users').document(goal.user_id).collection('goals').document(goal.id)
        doc_ref.set(goal.dict())
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/goals/{goal_id}")
async def update_goal_progress(goal_id: str, payload: dict = Body(...)):
    """ Handles partial updates (adding funds) or full edits """
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="Missing user_id in request body")
    try:
        doc_ref = db.collection('users').document(user_id).collection('goals').document(goal_id)
        doc = doc_ref.get()
        if not doc.exists:
            doc_ref.set(payload, merge=True)
        else:
            doc_ref.update(payload)
        return {"status": "success"}
    except Exception as e:
        print(f"❌ BACKEND ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/goals/{user_id}/{goal_id}")
async def delete_goal(user_id: str, goal_id: str):
    try:
        db.collection('users').document(user_id).collection('goals').document(goal_id).delete()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- BUDGET SETTINGS ---

@app.post("/user/settings/budgets")
async def save_budget(data: BudgetUpdate):
    try:
        return update_user_budget_settings(data.user_id, data.monthly_limit, data.category_budgets)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/user/settings/budgets/{user_id}")
async def get_budget(user_id: str):
    try:
        return get_user_budget_settings(user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- TRANSACTION ENGINE ---

def classify_merchant(merchant: str) -> str:
    m = merchant.lower()
    if any(x in m for x in ['zomato', 'swiggy', 'blinkit', 'zepto', 'eats']):
        return "Food & Dining"
    if any(x in m for x in ['amazon', 'flipkart', 'myntra', 'ajio']):
        return "Shopping"
    if any(x in m for x in ['uber', 'ola', 'rapido', 'irctc', 'metro']):
        return "Transport"
    if any(x in m for x in ['jio', 'airtel', 'vi ', 'recharge', 'bill']):
        return "Bills"
    return "Miscellaneous"

@app.post("/transactions/process-sms")
async def process_native_sms(payload: dict = Body(...)):
    user_id = payload.get("user_id") 
    body = payload.get("body", "")
    sender = payload.get("originatingAddress", "Unknown")

    # Regex for Amount and Merchant
    amount_match = re.search(r'(?:₹|Rs|INR|debited|spent)\.?\s*([\d,]+\.?\d{0,2})', body, re.IGNORECASE)
    amount = float(amount_match.group(1).replace(',', '')) if amount_match else 0.0
    
    merchant_match = re.search(r'(?:paid to|at|to|info)\s+([A-Z0-9\s]+?)(?:\.|\s+on|\s+via|\s+using)', body, re.IGNORECASE)
    merchant = merchant_match.group(1).strip() if merchant_match else "Unknown Merchant"
    
    category = classify_merchant(merchant)

    try:
        doc_ref = db.collection('users').document(user_id).collection('transactions').document()
        doc_ref.set({
            "amount": amount,
            "merchant": merchant,
            "category": category,
            "raw_body": body,
            "sender": sender,
            "source": "sms_auto",
            "direction": "debit",
            "date": firestore.SERVER_TIMESTAMP,
        })
        return {"status": "success", "amount": amount, "merchant": merchant, "category": category}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/transactions")
async def create_manual_transaction(payload: TransactionCreate):
    try:
        user_id = payload.user_id
        doc_ref = db.collection('users').document(user_id).collection('transactions').document()
        
        txn_data = {
            "amount": payload.amount,
            "category": payload.category or classify_merchant(payload.merchant or ""),
            "direction": payload.direction,
            "merchant": payload.merchant or "Manual Entry",
            "source": payload.source or "manual",
            "date": payload.date if payload.date else firestore.SERVER_TIMESTAMP
        }
        
        doc_ref.set(txn_data)
        return {"status": "success", "id": doc_ref.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/transactions/{user_id}")
async def get_user_transactions(user_id: str):
    try:
        docs = db.collection('users').document(user_id).collection('transactions').order_by(
            "date", direction=firestore.Query.DESCENDING
        ).stream()
        
        transactions = []
        for doc in docs:
            data = doc.to_dict()
            data['id'] = doc.id
            if 'date' in data and hasattr(data['date'], 'isoformat'):
                data['date'] = data['date'].isoformat()
            transactions.append(data)
        return transactions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))