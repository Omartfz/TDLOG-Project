# backend/data_loader.py
import yfinance as yf

AVAILABLE_SYMBOLS = ["AAPL", "AMZN", "MSFT", "LVMH.PA"]

def get_available_symbols():
    return AVAILABLE_SYMBOLS

def get_price(symbol: str):
    if symbol not in AVAILABLE_SYMBOLS:
        return None
    data = yf.download(symbol, period="5d", interval="1d")
    if data.empty:
        return None
    return round(data["Close"].iloc[-1], 2)
