// ui.js
// Pure UI helpers: DOM access, status badges, lobby/game toggles, players list.

/**
 * Convenience helper to get an element by its ID.
 *
 * @param {string} id
 * @returns {HTMLElement|null}
 */
export function byId(id) {
  return document.getElementById(id);
}

/**
 * Logs a message to the on-screen log display.
 * Prepends each log entry with a timestamp.
 *
 * @param {string} m
 */
export function log(m) {
  const el = byId("log");
  if (!el) return;
  const time = new Date().toLocaleTimeString();
  el.innerHTML = `[${time}] ${m}<br/>` + el.innerHTML;
}

/**
 * Updates the UI indicator showing the WebSocket connection status.
 *
 * @param {boolean} ok
 */
export function setWsStatus(ok) {
  const s = byId("wsStatus");
  if (!s) return;
  s.textContent = ok ? "connected" : "disconnected";
  s.className = "badge " + (ok ? "green" : "red");
}

/**
 * Shows or hides the lobby card section.
 *
 * @param {boolean} show
 */
export function showLobbyCard(show) {
  const el = byId("lobbyCard");
  if (!el) return;
  el.classList.toggle("hidden", !show);
}

/**
 * Shows or hides the main game area UI.
 *
 * @param {boolean} show
 */
export function showGameArea(show) {
  const el = byId("gameArea");
  if (!el) return;
  el.classList.toggle("hidden", !show);
}

/**
 * Renders the list of players inside the lobby.
 *
 * @param {Array<{name: string, userId: string, ready: boolean}>} list
 */
export function renderPlayers(list) {
  const tb = byId("playersTbody");
  if (!tb) return;
  tb.innerHTML = "";

  (list || []).forEach((p) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.name}</td>
      <td class="muted">${p.userId}</td>
      <td>${p.ready ? "✅" : "❌"}</td>
    `;
    tb.appendChild(tr);
  });
}
