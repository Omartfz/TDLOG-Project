// js/chart.js
// Handles the price history chart (Chart.js) for the multiplayer trading game.

import { byId } from "./ui.js";
import { MAX_POINTS, HISTORY, LABELS } from "./constants.js";

// Global Chart.js instance
let chart = null;

// The currently selected asset whose history is shown
let chartAsset = "OIL";

/**
 * Initializes the Chart.js line chart.
 * Call this once when the game starts (e.g. on GAME_STARTED).
 */
export function initChart() {
  const canvas = byId("priceChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: LABELS,               // timestamps (shared from constants.js)
      datasets: [
        {
          label: chartAsset,        // current asset name
          data: HISTORY[chartAsset],
          borderWidth: 1,
          pointRadius: 0,
          tension: 0.2
        }
      ]
    },
    options: {
      animation: false,
      responsive: true,
      scales: {
        x: {
          ticks: { maxTicksLimit: 8 }
        },
        y: {
          beginAtZero: false
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

/**
 * Switch the chart to another asset (dropdown change).
 *
 * @param {string} newAsset - e.g. "GOLD"
 */
export function updateChartAsset(newAsset) {
  chartAsset = newAsset;

  if (!chart) return;

  chart.data.datasets[0].label = chartAsset;
  chart.data.datasets[0].data = HISTORY[chartAsset];
  chart.update();
}

/**
 * Push a new tick of prices into the history buffers,
 * and refresh the chart.
 *
 * @param {Object<string, number>} prices - map asset -> latest price
 */
export function pushTickToHistory(prices) {
  if (!prices) return;

  // Add a human-readable timestamp label
  const ts = new Date().toLocaleTimeString();
  LABELS.push(ts);
  if (LABELS.length > MAX_POINTS) LABELS.shift();

  // Update all assets with the latest prices
  Object.keys(HISTORY).forEach((asset) => {
    const arr = HISTORY[asset];
    arr.push(prices[asset] ?? null);
    if (arr.length > MAX_POINTS) arr.shift();
  });

  if (chart) {
    chart.update();
  }
}
