from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import firestore
import datetime
import re

# Import the Firestore 'db' and helper functions from your database.py
from database import db, update_user_budget_settings, get_user_budget_settings
# Import your custom schemas
from schemas import BudgetUpdate, TransactionCreate

app = FastAPI(title="SpendWise Multi-User API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- NEW: Budget Settings Endpoints ---

@app.post("/user/settings/budgets")
async def save_budget(data: BudgetUpdate):
    """
    Saves the personalized monthly limit and category breakdown 
    received from the BudgetSetup screen.
    """
    try:
        result = update_user_budget_settings(
            data.user_id, 
            data.monthly_limit, 
            data.category_budgets
        )
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result["message"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/user/settings/budgets/{user_id}")
async def get_budget(user_id: str):
    """
    Returns the user's saved budget settings for the Home Dashboard.
    """
    try:
        settings = get_user_budget_settings(user_id)
        return settings
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- UPDATED: Transaction Endpoints ---

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
        print(f"Fetch Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/transactions/process-sms")
async def process_native_sms(payload: dict = Body(...)):
    user_id = payload.get("user_id") 
    body = payload.get("body", "")
    sender = payload.get("originatingAddress", "Unknown")

    # IMPROVED REGEX: Handles ₹, Rs, and commas in numbers
    amount_match = re.search(r'(?:₹|Rs|INR|debited|spent)\.?\s*([\d,]+\.?\d{0,2})', body, re.IGNORECASE)
    
    amount = 0.0
    if amount_match:
        amount = float(amount_match.group(1).replace(',', ''))

    merchant_match = re.search(r'(?:paid to|at|to)\s+([A-Z\s]+?)(?:\.|\s+on|\s+via)', body, re.IGNORECASE)
    merchant = merchant_match.group(1).strip() if merchant_match else "Unknown"

    try:
        doc_ref = db.collection('users').document(user_id).collection('transactions').document()
        doc_ref.set({
            "amount": amount,
            "merchant": merchant,
            "raw_body": body,
            "sender": sender,
            "source": "sms_auto",
            "direction": "debit",
            "date": firestore.SERVER_TIMESTAMP,
        })
        return {"status": "success", "amount": amount, "merchant": merchant}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/transactions")
async def create_manual_transaction(payload: TransactionCreate):
    try:
        # Use the schema to extract validated data
        user_id = payload.user_id
        
        doc_ref = db.collection('users').document(user_id).collection('transactions').document()
        
        txn_data = {
            "amount": payload.amount,
            "category": payload.category or "Miscellaneous",
            "direction": payload.direction,
            "merchant": payload.merchant or "Manual Entry",
            "source": payload.source or "manual",
            "date": payload.date if payload.date else firestore.SERVER_TIMESTAMP
        }
        
        doc_ref.set(txn_data)
        return {"status": "success", "id": doc_ref.id}
    except Exception as e:
        print(f"❌ SAVE ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))