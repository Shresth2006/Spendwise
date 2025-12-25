from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import firestore
import datetime

# Import the Firestore 'db' from your database.py
from database import db 
from extract import normalize_text, extract_amount, extract_direction, classify_txn_type, extract_merchant
from categor import classify_category

app = FastAPI(title="SpendWise Multi-User API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

import re

@app.post("/transactions/process-sms")
async def process_native_sms(payload: dict = Body(...)):
    user_id = payload.get("user_id") 
    body = payload.get("body", "")
    sender = payload.get("originatingAddress", "Unknown")

    # 🚀 IMPROVED REGEX: Handles ₹, Rs, and commas in numbers
    amount_match = re.search(r'(?:₹|Rs|INR|debited|spent)\.?\s*([\d,]+\.?\d{0,2})', body, re.IGNORECASE)
    
    amount = 0.0
    if amount_match:
        # Remove commas like 8,742.10 and convert to float
        amount = float(amount_match.group(1).replace(',', ''))

    # Extract Merchant (e.g., ZOMATO)
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
            "date": firestore.SERVER_TIMESTAMP,
        })
        return {"status": "success", "amount": amount, "merchant": merchant}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/transactions")
async def create_manual_transaction(payload: dict = Body(...)):
    try:
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="User ID required")

        # Reference to users/{user_id}/transactions
        doc_ref = db.collection('users').document(user_id).collection('transactions').document()
        
        # Save the manual entry
        doc_ref.set({
            "amount": payload.get("amount", 0),
            "category": payload.get("category", "Miscellaneous"),
            "direction": payload.get("direction", "debit"),
            "source": payload.get("source", "manual"),
            "notes": payload.get("notes", ""),
            "date": datetime.datetime.fromisoformat(payload.get("date").replace('Z', '+00:00')) if payload.get("date") else firestore.SERVER_TIMESTAMP
        })
        
        print(f"✅ MANUAL TRANSACTION SAVED: {doc_ref.id}")
        return {"status": "success", "id": doc_ref.id}
    except Exception as e:
        print(f"❌ SAVE ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))