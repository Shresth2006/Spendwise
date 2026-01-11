from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

# --- NEW: Added for Budget Personalization ---
class BudgetUpdate(BaseModel):
    user_id: str
    monthly_limit: int
    category_budgets: Dict[str, int]

# --- UPDATED: Transaction Models ---
class TransactionCreate(BaseModel):
    user_id: str  # Added to link transactions to specific users
    amount: float
    direction: str  # credit / debit
    category: Optional[str] = None
    merchant: Optional[str] = None
    source: Optional[str] = "manual"
    date: Optional[datetime] = None

class TransactionResponse(BaseModel):
    id: str  # Changed to str as Firestore IDs are alphanumeric
    amount: float
    direction: str
    txn_type: str
    category: str
    merchant: Optional[str]
    confidence: float
    needs_user_review: bool
    source: str
    date: datetime

    class Config:
        from_attributes = True