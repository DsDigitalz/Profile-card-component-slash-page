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

/**
 * contact.js
 * Finalized script for the Contact Us Page, ensuring perfect fit with all
 * required data-testid attributes, validation rules, and accessibility notes.
 *
 * Requirements Met:
 * - All required fields and test IDs used for selection.
 * - Validation rules (Required, Email format, Min Length 10) enforced.
 * - Error messages displayed via specific test IDs and hidden on success.
 * - Success message displayed via specific test ID.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Core DOM Elements Selection using REQUIRED data-testid attributes
  const form = document.getElementById("contact-form");
  const successMessage = document.querySelector(
    '[data-testid="test-contact-success"]'
  );

  // Define all fields using their required data-testid as the primary selector
  const fields = [
    { 
      testId: "test-contact-name",
      required: true,
      minLength: 1,
      errorTestId: "test-contact-error-name",
      friendlyName: "Full Name",
    },
    {
      testId: "test-contact-email",
      required: true,
      type: "email",
      errorTestId: "test-contact-error-email",
      friendlyName: "Email",
    },
    {
      testId: "test-contact-subject",
      required: true,
      minLength: 1,
      errorTestId: "test-contact-error-subject",
      friendlyName: "Subject",
    },
    {
      testId: "test-contact-message",
      required: true,
      minLength: 10, // REQUIRED: Message must be at least 10 characters
      errorTestId: "test-contact-error-message",
      friendlyName: "Message",
    },
  ];

  // Map DOM elements once for efficiency and to locate the error elements
  const formElements = fields.map((field) => {
    const input = document.querySelector(`[data-testid="${field.testId}"]`);
    const errorElement = document.querySelector(
      `[data-testid="${field.errorTestId}"]`
    );

    // Find the closest parent 'form-group' for error state class management
    const group = input ? input.closest(".form-group") : null;

    return {
      ...field,
      input,
      errorElement,
      group,
    };
  });

  // --- VALIDATION LOGIC ---

  const validators = {
    /** Checks if a field is empty */
    required: (value, name) =>
      value.trim().length > 0 ? "" : `${name} is required.`,

    /** Checks for a minimum length requirement */
    minLength: (value, min, name) =>
      value.trim().length >= min
        ? ""
        : `${name} must be at least ${min} characters long.`,

    /** Checks for a simple email pattern (name@example.com) */
    email: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value.trim())
        ? ""
        : "Please enter a valid email address (e.g., name@example.com).";
    },
  };

  /**
   * Runs validation on a single field and updates the DOM.
   * @param {object} fieldObj - The field configuration object.
   * @returns {boolean} - True if the field is valid, false otherwise.
   */
  function validateField(fieldObj) {
    if (!fieldObj.input || !fieldObj.errorElement) return true;

    const value = fieldObj.input.value;
    let errorMessage = "";

    // 1. Required Check (All fields required)
    if (fieldObj.required) {
      errorMessage = validators.required(value, fieldObj.friendlyName);
    }

    // If not empty, proceed to other checks
    if (!errorMessage) {
      // 2. Email Format Check
      if (fieldObj.type === "email") {
        errorMessage = validators.email(value);
      }
      // 3. Min Length Check (Used for Message: minLength: 10)
      else if (fieldObj.minLength && fieldObj.minLength > 1) {
        errorMessage = validators.minLength(
          value,
          fieldObj.minLength,
          fieldObj.friendlyName
        );
      }
    }

    // --- Update DOM with Error State (Accessibility: aria-describedby) ---
    if (errorMessage) {
      fieldObj.errorElement.textContent = errorMessage;
      fieldObj.group && fieldObj.group.classList.add("error");
      return false;
    } else {
      fieldObj.errorElement.textContent = "";
      fieldObj.group && fieldObj.group.classList.remove("error");
      return true;
    }
  }

  /**
   * Runs validation for the entire form.
   * @returns {boolean} - True if all fields are valid.
   */
  function validateForm() {
    let isFormValid = true;
    formElements.forEach((field) => {
      if (!validateField(field)) {
        isFormValid = false;
      }
    });
    return isFormValid;
  }

  // --- EVENT LISTENERS AND SUBMISSION ---

  // Add validation on input blur and change for better UX
  formElements.forEach((fieldObj) => {
    fieldObj.input.addEventListener("blur", () => {
      validateField(fieldObj);
    });

    // Re-validate instantly when the user starts typing/changing content
    fieldObj.input.addEventListener("input", () => {
      if (fieldObj.group && fieldObj.group.classList.contains("error")) {
        validateField(fieldObj);
      }
    });
  });

  // Handle form submission
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Always hide the success message on a new submission attempt
    successMessage && successMessage.classList.add("hidden");

    if (validateForm()) {
      // If validation passes:

      // 1. Simulate submission (console log for verification)
      console.log("Form is valid. Data ready to send to server.");

      // 2. Show Success Confirmation Message (On success, show a confirmation message)
      successMessage && successMessage.classList.remove("hidden");

      // 3. Clear the form fields
      form.reset();

      // Dispatch event for automated tests to confirm success
      document.dispatchEvent(new CustomEvent("contact-success"));
    } else {
      // Validation failed.
      // Focus on the first invalid field for better keyboard accessibility
      const firstInvalid = formElements.find(
        (f) => f.group && f.group.classList.contains("error")
      );
      if (firstInvalid && firstInvalid.input) {
        firstInvalid.input.focus();
      }
      document.dispatchEvent(new CustomEvent("contact-failure"));
    }
  });
});
