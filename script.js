/**
 * script.js
 * Optimized for automated testing and production environments.
 * * Key changes:
 * - Moved button click CSS effect to style.css.
 * - Replaced window.alert() with DOM text update.
 * - Logic is contained within functions for easier unit testing/mocking.
 */

// --- UTILITY FUNCTIONS (Easily Testable) ---

/**
 * Calculates and formats the current date.
 * @returns {string} The formatted date string.
 */
function getFormattedDate() {
  const now = new Date();
  const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return now.toLocaleDateString("en-US", dateOptions);
}

/**
 * Handles the visual effect and simulated logic of the CTA button click.
 * @param {HTMLElement} buttonElement - The CTA button element.
 * @param {HTMLElement} messageElement - An element to display status messages (e.g., a hidden status area).
 */
function handleCtaClick(buttonElement, messageElement) {
  // 1. Start action state
  buttonElement.classList.add("clicked-effect");
  buttonElement.textContent = "Processing...";
  messageElement.textContent = "Download started. Check console for details.";

  // 2. Dispatch a custom event for automated tests to listen to
  const event = new CustomEvent("cta-action-started", {
    detail: { action: "resume-download" },
  });
  document.dispatchEvent(event);

  // 3. Simulate asynchronous action (e.g., API call, download)
  setTimeout(() => {
    // 4. End action state
    buttonElement.classList.remove("clicked-effect");
    buttonElement.textContent = "View Resume (PDF)";
    messageElement.textContent = "Resume action completed.";

    // Dispatch a completion event
    const completeEvent = new CustomEvent("cta-action-completed");
    document.dispatchEvent(completeEvent);
  }, 1000);
}

// --- INITIALIZATION (DOM Interaction) ---

document.addEventListener("DOMContentLoaded", () => {
  // 1. Date Update
  const updateDateElement = document.getElementById("update-date");
  if (updateDateElement) {
    // Use the testable function
    updateDateElement.textContent = getFormattedDate();
  }

  // 2. CTA Button Setup
  const ctaButton = document.querySelector(
    '[data-test-id="profile-cta-button"]'
  );

  // 3. Create a dedicated element for status messages (better than alert())
  // For testing, this allows us to verify the output message in the DOM.
  const statusMessage = document.createElement("p");
  statusMessage.setAttribute("data-test-id", "cta-status-message");
  statusMessage.style.cssText =
    "font-size: 0.8rem; margin-top: 10px; color: #f00; min-height: 1.5em;";

  // Find where to append the status message (e.g., just before the footer)
  const contactSection = document.querySelector(
    '[data-test-id="profile-section-contact"]'
  );
  if (contactSection) {
    contactSection.appendChild(statusMessage);
  }

  if (ctaButton) {
    ctaButton.addEventListener("click", (event) => {
      event.preventDefault();
      // Use the testable function
      handleCtaClick(ctaButton, statusMessage);
    });
  }
});
