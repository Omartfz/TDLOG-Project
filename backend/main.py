# backend/main.py
from fastapi import FastAPI, HTTPException
from backend.schemas import UserCreate, TradeRequest, UserPortfolio
from backend.portfolio import PortfolioManager
from backend.data_loader import get_available_symbols, get_price

app = FastAPI(title="Quant Trading Game Backend")

# Instance du gestionnaire de portefeuille
manager = PortfolioManager()

@app.get("/")
def root():
    return {"message": "Welcome to Quant Trading Game API 🚀"}

@app.post("/register", response_model=UserPortfolio)
def register_user(user: UserCreate):
    portfolio = manager.create_user(user.username)
    return portfolio

@app.get("/prices/{symbol}")
def get_stock_price(symbol: str):
    price = get_price(symbol)
    if price is None:
        raise HTTPException(status_code=404, detail="Symbol not found")
    return {"symbol": symbol, "price": price}

@app.post("/trade")
def trade_action(trade: TradeRequest):
    result = manager.execute_trade(trade)
    return result

@app.get("/portfolio/{username}", response_model=UserPortfolio)
def get_portfolio(username: str):
    return manager.get_portfolio(username)
