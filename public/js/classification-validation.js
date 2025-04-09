"use strict";

// Get form elements
const classForm = document.querySelector("#addClassificationForm");
const classNameInput = document.querySelector("#classification_name");
const classNameError = document.querySelector("#classification_nameError");

// Form validation function
function validateClassificationForm() {
  let valid = true;
  
  // Reset error message
  classNameError.textContent = "";
  
  // Validate classification name (letters and numbers only, no spaces or special characters)
  const classNamePattern = /^[A-Za-z0-9]+$/;
  if (!classNamePattern.test(classNameInput.value)) {
    classNameError.textContent = "Classification name can only contain letters and numbers (no spaces or special characters).";
    valid = false;
  }
  
  return valid;
}

// Event listener for form submission
classForm.addEventListener("submit", function(event) {
  // Prevent default form submission if validation fails
  if (!validateClassificationForm()) {
    event.preventDefault();
  }
});