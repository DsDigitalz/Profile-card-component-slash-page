/**
 * script.js
 * Implements the core dynamic behavior: displaying the current time in milliseconds.
 * Designed for automated testing compatibility.
 */

/**
 * Updates the 'Current Time (ms)' field with the accurate Date.now() value.
 */
function updateCurrentTime() {
  const timeElement = document.getElementById("current-time-ms");

  if (timeElement) {
    const nowMs = Date.now();
    // Set the plain text content
    timeElement.textContent = nowMs;

    // Optional: Dispatch an event for advanced testing to verify timing
    // document.dispatchEvent(new CustomEvent('time-updated', { detail: { time: nowMs } }));
  }
}

// --- INITIALIZATION ---

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initial Time Update
  updateCurrentTime();

  // 2. Set an interval to keep the time *reasonably* accurate,
  // refreshing every second (1000ms).
  // This addresses the requirement that the time should be accurate.
  const updateInterval = 1000;
  setInterval(updateCurrentTime, updateInterval);

  console.log(
    `Time updated initialized, refreshing every ${updateInterval}ms.`
  );
});
