# domain/execution.py
from __future__ import annotations

import time
from typing import Optional, Tuple

from domain.models import LobbyState, PlayerState
from domain.portfolio import record_trade


def execute_market(lobby: LobbyState, pl: PlayerState, asset: str, side: str,
                   qty: int) -> Tuple[bool, Optional[str]]:
    """
    Execute a market order for a player, updating positions and cash.

    BUY orders cover shorts first, then open/extend longs.
    SELL orders close longs first, then open/extend shorts.
    Realized PnL is recorded when positions are closed.

    Args:
        lobby: Lobby containing current market prices
        pl: Player whose positions/cash to update
        asset: Asset symbol (e.g., "GOLD", "RICE")
        side: "BUY" or "SELL"
        qty: Order quantity (positive integer)

    Returns:
        (True, None) on success
        (False, reason) on failure ("insufficient_cash" or "insufficient_cash_to_short")
    """
    price = lobby.prices[asset]
    pos = pl.positions[asset]
    cash = pl.cash

    if side == "BUY":
        # cover short first
        if pos["qty"] < 0:
            cover = min(qty, -pos["qty"])
            if cover > 0:
                record_trade(
                    pl,
                    asset=asset,
                    side_open="SHORT",
                    qty=cover,
                    entry_price=pos["avg"],
                    exit_price=price,
                    entry_ts=pos["entry_ts"],
                )
                cash -= price * cover
                pos["qty"] += cover
                if pos["qty"] == 0:
                    pos["avg"] = 0.0
                    pos["entry_ts"] = None
                qty -= cover

        # extend/create long
        if qty > 0:
            cost = price * qty
            if cash < cost:
                return False, "insufficient_cash"
            if pos["qty"] > 0:
                pos["avg"] = (pos["avg"] * pos["qty"] +
                              price * qty) / (pos["qty"] + qty)
            else:
                pos["avg"] = price
            pos["qty"] += qty
            cash -= cost
            if pos["entry_ts"] is None:
                pos["entry_ts"] = time.time()

    else:  # SELL
        # close long first
        if pos["qty"] > 0:
            close_qty = min(qty, pos["qty"])
            if close_qty > 0:
                record_trade(
                    pl,
                    asset=asset,
                    side_open="LONG",
                    qty=close_qty,
                    entry_price=pos["avg"],
                    exit_price=price,
                    entry_ts=pos["entry_ts"],
                )
                cash += price * close_qty
                pos["qty"] -= close_qty
                if pos["qty"] == 0:
                    pos["avg"] = 0.0
                    pos["entry_ts"] = None
                qty -= close_qty

        # open/extend short
        if qty > 0:
            notional = price * qty

            # SIMPLE SHORT RULE: require cash collateral BEFORE receiving short proceeds
            if cash < notional:
                return False, "insufficient_cash_to_short"

            new_qty = pos["qty"] - qty
            if pos["qty"] < 0:
                pos["avg"] = (pos["avg"] * abs(pos["qty"]) +
                              price * qty) / (abs(pos["qty"]) + qty)
            else:
                pos["avg"] = price
            pos["qty"] = new_qty
            cash += notional
            if pos["entry_ts"] is None:
                pos["entry_ts"] = time.time()

    pl.cash = cash
    return True, None
