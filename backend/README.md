# TDLOG-Project

# 💹 Quant Trading Game

> **A web-based trading simulator for learning and experimenting with stock and option trading strategies.**  
> Built with **FastAPI** (backend) and **Streamlit / React** (frontend).

---

## 🧭 Overview

The **Quant Trading Game** is an interactive web app that lets users trade virtual assets in a simplified market environment.

The goal is to simulate basic market mechanics (buy/sell stocks, portfolio tracking, and eventually options) in an educational and gamified way — similar in spirit to [trading-game.uk](https://trading-game.uk), but with quantitative depth.

---

## 🚀 Features (MVP)

### ✅ **Phase 1 – Stock Trading**
- Create an account with a starting capital (e.g. €100,000 virtual cash).  
- Buy and sell major stocks (AAPL, AMZN, LVMH, etc.) using daily historical prices.  
- Portfolio tracking: cash balance, current holdings, total value.  
- Transaction history with timestamps.  
- Graphical visualization of prices and portfolio evolution.

### 🧩 **Phase 2 – Advanced Trading**
- Short selling with margin constraints.  
- Option trading (European Calls) priced via the **Black-Scholes-Merton (BSM)** model.  
- Calculation of option payoffs at expiry for long/short positions.

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Backend** | 🐍 [FastAPI](https://fastapi.tiangolo.com/) for API endpoints |
| **Frontend** | 💻 [Streamlit](https://streamlit.io/) (or React + Plotly for advanced UI) |
| **Database** | 🗄️ SQLite (via SQLModel or SQLAlchemy) |
| **Data Source** | 📈 [yfinance](https://pypi.org/project/yfinance/) for stock prices |
| **Analytics** | 🧮 NumPy, Pandas, SciPy (for Black-Scholes & P&L) |
| **Visualization** | 📊 Plotly / Matplotlib |

---

## 📂 Project Structure

