// "use strict";

// // Get form elements
// const invForm = document.getElementById("addInventoryForm");
// const classification = document.getElementById("classificationList");
// const make = document.getElementById("inv_make");
// const model = document.getElementById("inv_model");
// const description = document.getElementById("inv_description");
// const image = document.getElementById("inv_image");
// const thumbnail = document.getElementById("inv_thumbnail");
// const price = document.getElementById("inv_price");
// const year = document.getElementById("inv_year");
// const miles = document.getElementById("inv_miles");
// const color = document.getElementById("inv_color");

// // Get error span elements
// const classificationError = document.getElementById("classificationError");
// const makeError = document.getElementById("makeError");
// const modelError = document.getElementById("modelError");
// const descriptionError = document.getElementById("descriptionError");
// const imageError = document.getElementById("imageError");
// const thumbnailError = document.getElementById("thumbnailError");
// const priceError = document.getElementById("priceError");
// const yearError = document.getElementById("yearError");
// const milesError = document.getElementById("milesError");
// const colorError = document.getElementById("colorError");

// // Function to validate the form
// function validateInventoryForm() {
//   let valid = true;
  
//   // Reset all error messages
//   clearErrors();
  
//   // Validate classification
//   if (classification.value === "") {
//     classificationError.textContent = "Please select a classification";
//     valid = false;
//   }
  
//   // Validate make (at least 3 characters)
//   if (make.value.length < 3) {
//     makeError.textContent = "Make must be at least 3 characters";
//     valid = false;
//   }
  
//   // Validate model (at least 3 characters)
//   if (model.value.length < 3) {
//     modelError.textContent = "Model must be at least 3 characters";
//     valid = false;
//   }
  
//   // Validate description (at least 10 characters)
//   if (description.value.length < 10) {
//     descriptionError.textContent = "Description must be at least 10 characters";
//     valid = false;
//   }
  
//   // Validate image path
//   if (!image.value.includes('.')) {
//     imageError.textContent = "Please enter a valid image path";
//     valid = false;
//   }
  
//   // Validate thumbnail path
//   if (!thumbnail.value.includes('.')) {
//     thumbnailError.textContent = "Please enter a valid thumbnail path";
//     valid = false;
//   }
  
//   // Validate price (positive number)
//   if (price.value <= 0) {
//     priceError.textContent = "Price must be greater than zero";
//     valid = false;
//   }
  
//   // Validate year (between 1900 and current year + 1)
//   const currentYear = new Date().getFullYear();
//   if (year.value < 1900 || year.value > currentYear + 1) {
//     yearError.textContent = `Year must be between 1900 and ${currentYear + 1}`;
//     valid = false;
//   }
  
//   // Validate miles (non-negative)
//   if (miles.value < 0) {
//     milesError.textContent = "Miles cannot be negative";
//     valid = false;
//   }
  
//   // Validate color (at least 3 characters)
//   if (color.value.length < 3) {
//     colorError.textContent = "Color must be at least 3 characters";
//     valid = false;
//   }
  
//   return valid;
// }

// // Function to clear all error messages
// function clearErrors() {
//   classificationError.textContent = "";
//   makeError.textContent = "";
//   modelError.textContent = "";
//   descriptionError.textContent = "";
//   imageError.textContent = "";
//   thumbnailError.textContent = "";
//   priceError.textContent = "";
//   yearError.textContent = "";
//   milesError.textContent = "";
//   colorError.textContent = "";
// }

// // Add event listener for form submission
// invForm.addEventListener("submit", function(event) {
//   // Prevent default form submission if validation fails
//   if (!validateInventoryForm()) {
//     event.preventDefault();
//   }
// });