// js/leaderboard.js
// Rendering the leaderboard table.

import { byId } from "./ui.js";

/**
 * Renders the leaderboard panel.
 *
 * @param {Object} lb - Leaderboard object from backend
 * @param {Array<{name:string, equity:number, realizedPnL:number}>} lb.rows
 */
export function renderLeaderboard(lb) {
  const tb = byId("lb_rows");
  tb.innerHTML = "";

  (lb.rows || []).forEach((r) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${r.name}</td>
      <td>${r.equity.toFixed(2)}</td>
      <td>${(r.realizedPnL >= 0 ? "+" : "") + r.realizedPnL.toFixed(2)}</td>
    `;

    tb.appendChild(tr);
  });
}
