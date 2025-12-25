from sqlalchemy import Column, Integer, Float, String, DateTime, Boolean
from datetime import datetime

from database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)

    direction = Column(String, nullable=False)  # credit / debit
    txn_type = Column(String, nullable=False)   # income / expense

    category = Column(String, nullable=False)
    merchant = Column(String, nullable=True)

    confidence = Column(Float, default=0.0)
    needs_user_review = Column(Boolean, default=False)

    source = Column(String, default="manual")  # sms / manual / csv
    date = Column(DateTime, default=datetime.utcnow)
