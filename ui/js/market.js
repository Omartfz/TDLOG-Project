// js/market.js
// Handles the market order-entry table (assets, prices, qty, side, send button).

import { byId } from "./ui.js";
import { ASSETS } from "./constants.js";

/**
 * Initializes the market table:
 *  - builds one row per asset
 *  - wires the "Send" button to the provided onOrder callback
 *
 * @param {(order: {asset:string, qty:number, side:string}) => void} onOrder
 *        callback called when user clicks "Send" for an asset
 */
export function initMarket(onOrder) {
  const rowsTbody = byId("rows");
  if (!rowsTbody) return;

  // Clear any previous rows (in case of reconnect / restart)
  rowsTbody.innerHTML = "";

  ASSETS.forEach((asset) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${asset}</td>
      <td id="p_${asset}">-</td>
      <td>
        <input
          id="q_${asset}"
          type="number"
          min="1"
          value="10"
          style="width:80px"
        />
      </td>
      <td>
        <select id="s_${asset}">
          <option>BUY</option>
          <option>SELL</option>
        </select>
      </td>
      <td>
        <button id="btn_${asset}">Send</button>
      </td>
    `;

    rowsTbody.appendChild(tr);

    // Wire button -> onOrder callback
    const btn  = byId(`btn_${asset}`);
    const qtyI = byId(`q_${asset}`);
    const sideS = byId(`s_${asset}`);

    if (btn && qtyI && sideS && typeof onOrder === "function") {
      btn.onclick = () => {
        const qty = parseInt(qtyI.value, 10) || 0;
        const side = sideS.value;
        onOrder({ asset, qty, side });
      };
    }
  });
}

/**
 * Updates the live price cells in the market table.
 * Called on every TICK from the backend.
 *
 * @param {Object<string, number>} priceMap - asset -> latest price
 */
export function updatePrices(priceMap) {
  if (!priceMap) return;

  ASSETS.forEach((asset) => {
    const cell = byId(`p_${asset}`);
    if (!cell) return;

    const val = priceMap[asset];
    if (val !== undefined && val !== null) {
      cell.textContent = Number(val).toFixed(2);
    }
  });
}
