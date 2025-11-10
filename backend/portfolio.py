# backend/portfolio.py
from backend.schemas import Position, Transaction, UserPortfolio, TradeRequest
from backend.data_loader import get_price

class PortfolioManager:
    def __init__(self):
        self.users = {}  # username -> UserPortfolio
        self.initial_cash = 100_000.0

    def create_user(self, username: str) -> UserPortfolio:
        if username in self.users:
            return self.users[username]
        portfolio = UserPortfolio(username=username, cash=self.initial_cash, positions=[], transactions=[])
        self.users[username] = portfolio
        return portfolio

    def get_portfolio(self, username: str) -> UserPortfolio:
        return self.users.get(username)

    def execute_trade(self, trade: TradeRequest):
        user = self.users.get(trade.username)
        if not user:
            return {"error": "User not found"}

        price = get_price(trade.symbol)
        if not price:
            return {"error": "Invalid symbol"}

        cost = price * trade.quantity

        if trade.side == "BUY":
            if user.cash < cost:
                return {"error": "Not enough cash"}
            user.cash -= cost
            self._add_position(user, trade.symbol, trade.quantity, price)

        elif trade.side == "SELL":
            pos = next((p for p in user.positions if p.symbol == trade.symbol), None)
            if not pos or pos.quantity < trade.quantity:
                return {"error": "Not enough shares to sell"}
            user.cash += cost
            pos.quantity -= trade.quantity

        user.transactions.append(Transaction(**trade.dict(), price=price))
        return {"message": f"{trade.side} {trade.quantity} {trade.symbol} @ {price:.2f}"}

    def _add_position(self, user, symbol, quantity, price):
        pos = next((p for p in user.positions if p.symbol == symbol), None)
        if pos:
            total_qty = pos.quantity + quantity
            pos.avg_price = (pos.avg_price * pos.quantity + price * quantity) / total_qty
            pos.quantity = total_qty
        else:
            user.positions.append(Position(symbol=symbol, quantity=quantity, avg_price=price))
