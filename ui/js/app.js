// js/app.js
// Entry point: wires DOM elements to the game logic modules.

import { byId } from "./ui.js";
import { connectWS, createLobby, joinLobby, setReady, startGame } from "./ws.js";
import { updateChartAsset } from "./chart.js";

window.addEventListener("DOMContentLoaded", () => {
  console.log("app.js: DOMContentLoaded → wiring UI to ws.js");

  // Helper to bind clicks and log
  function bindClick(elem, label, handler) {
    if (!elem) {
      console.warn(`⚠️ app.js: element for '${label}' not found`);
      return;
    }
    elem.addEventListener("click", (e) => {
      e.preventDefault(); // évite un submit implicite et un reload
      console.log(`▶ '${label}' clicked`);
      handler();
    });
    console.log(`✔ app.js: bound '${label}'`);
  }

  // --- Buttons / controls ---

  // Connect
  const btnConnect = byId("btnConnect");
  bindClick(btnConnect, "Connect", connectWS);

  // Create Lobby (ID exact dans ton HTML: btnCreate)
  const btnCreate = byId("btnCreate");
  bindClick(btnCreate, "Create Lobby", createLobby);

  // Join Lobby (ID exact: btnJoin)
  const btnJoin = byId("btnJoin");
  bindClick(btnJoin, "Join Lobby", joinLobby);

  // Ready checkbox
  const readyChk = byId("readyChk");
  if (readyChk) {
    readyChk.addEventListener("change", () => {
      console.log("▶ 'Ready' checkbox changed");
      setReady();
    });
    console.log("✔ app.js: bound 'Ready checkbox'");
  } else {
    console.warn("⚠️ app.js: 'readyChk' not found");
  }

  // Start Game
  const btnStart = byId("btnStart");
  bindClick(btnStart, "Start Game", startGame);

  // --- Asset selector updates the chart ---
  const assetSel = byId("assetSel");
  if (assetSel) {
    assetSel.addEventListener("change", () => {
      console.log("▶ Asset changed to", assetSel.value);
      updateChartAsset(assetSel.value);
    });
    console.log("✔ app.js: bound 'assetSel' change");
  } else {
    console.warn("⚠️ app.js: 'assetSel' not found");
  }

  // --- Parse ?join=CODE from URL to prefill join input ---
  const url = new URL(window.location.href);
  const j = url.searchParams.get("join");
  if (j) {
    const joinInput = byId("joinCode");
    if (joinInput) {
      joinInput.value = j;
      console.log("app.js: prefilled joinCode from URL:", j);
    }
  }
});
