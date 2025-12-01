// js/portfolio.js
// Rendering of: KPIs, positions, trade history.

import { byId } from "./ui.js";

/**
 * Render the entire portfolio panel:
 * - Cash
 * - Equity
 * - uPnL
 * - rPnL
 * - Positions table
 * - Trades table
 *
 * @param {Object} p
 * @param {number} p.cash
 * @param {number} p.equity
 * @param {number} p.uPnL
 * @param {number} p.realizedPnL
 * @param {Array<Object>} [p.positions]
 * @param {Array<Object>} [p.trades]
 */
export function renderPortfolio(p) {
  if (!p) return;

  // --- KPI SECTION ---
  byId("k_cash").textContent   = p.cash.toFixed(2);
  byId("k_equity").textContent = p.equity.toFixed(2);
  byId("k_upnl").textContent   =
    (p.uPnL >= 0 ? "+" : "") + p.uPnL.toFixed(2);
  byId("k_rpnl").textContent   =
    (p.realizedPnL >= 0 ? "+" : "") + p.realizedPnL.toFixed(2);

  // --- POSITIONS TABLE ---
  const posTb = byId("pos_rows");
  posTb.innerHTML = "";

  (p.positions || []).forEach((row) => {
    const tr = document.createElement("tr");
    const upnlStr = (row.uPnL >= 0 ? "+" : "") + row.uPnL.toFixed(2);

    tr.innerHTML = `
      <td>${row.asset}</td>
      <td>${row.qty}</td>
      <td>${row.avg.toFixed(2)}</td>
      <td>${row.price.toFixed(2)}</td>
      <td>${row.mktValue.toFixed(2)}</td>
      <td>${upnlStr}</td>
    `;

    posTb.appendChild(tr);
  });

  // --- TRADES HISTORY TABLE ---
  const tradeTb = byId("trades_rows");
  tradeTb.innerHTML = "";

  (p.trades || []).slice().reverse().forEach((t) => {
    const ts = new Date(t.ts * 1000).toLocaleTimeString();
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${ts}</td>
      <td>${t.asset}</td>
      <td>${t.side_open}</td>
      <td>${t.qty}</td>
      <td>${Number(t.entry_price).toFixed(2)}</td>
      <td>${Number(t.exit_price).toFixed(2)}</td>
      <td>${(t.realized_pnl >= 0 ? "+" : "") + Number(t.realized_pnl).toFixed(2)}</td>
      <td>${t.duration_sec ?? ""}</td>
    `;

    tradeTb.appendChild(tr);
  });
}
