from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TransactionCreate(BaseModel):
    amount: float
    direction: str  # credit / debit
    category: Optional[str] = None
    merchant: Optional[str] = None
    source: Optional[str] = "manual"
    date: Optional[datetime] = None

class TransactionResponse(BaseModel):
    id: int
    amount: float
    direction: str
    txn_type: str
    category: str
    merchant: Optional[str]
    confidence: float
    needs_user_review: bool
    source: str
    date: datetime

    model_config = {
        "from_attributes": True
    }
