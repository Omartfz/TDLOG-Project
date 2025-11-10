# backend/schemas.py
from pydantic import BaseModel, Field
from typing import List, Literal

class Position(BaseModel):
    symbol: str
    quantity: int
    avg_price: float

class Transaction(BaseModel):
    symbol: str
    side: Literal["BUY", "SELL"]
    quantity: int
    price: float

class UserCreate(BaseModel):
    username: str = Field("omar")

class UserPortfolio(BaseModel):
    username: str
    cash: float
    positions: List[Position] = []
    transactions: List[Transaction] = []

class TradeRequest(Transaction):
    username: str
