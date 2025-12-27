from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List

from database import get_db
from models import Transaction
from schemas import TransactionCreate, TransactionResponse

router = APIRouter(prefix="/transactions", tags=["Transactions"])

@router.post("/", response_model=TransactionResponse)
def create_transaction(txn: TransactionCreate, db: Session = Depends(get_db)):

    # ✅ SIMPLE MVP RULE
    if txn.direction == "credit":
        txn_type = "income"
        category = txn.category or "Income"
    else:
        txn_type = "expense"
        category = txn.category or "Miscellaneous"

    new_txn = Transaction(
        amount=txn.amount,
        direction=txn.direction,
        txn_type=txn_type,
        category=category,
        merchant=txn.merchant,
        source=txn.source,
        date=txn.date or datetime.utcnow(),
        confidence=0.5,
        needs_user_review=(category == "Miscellaneous")
    )

    db.add(new_txn)
    db.commit()
    db.refresh(new_txn)

    return new_txn


@router.get("/", response_model=List[TransactionResponse])
def list_transactions(db: Session = Depends(get_db)):
    return db.query(Transaction).order_by(Transaction.date.desc()).all()
