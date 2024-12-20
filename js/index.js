// !========================== Start Global Variables
var productNameInput = document.getElementById("productName"); // Input element for product name
var productPriceInput = document.getElementById("productPrice"); // Input element for product price
var productCategoryInput = document.getElementById("productCategory"); // Input element for product category
var productDescriptionInput = document.getElementById("productDescription"); // Input element for product description
var productImageInput = document.getElementById("productImage"); // Input element for product image
var searchInput = document.getElementById("searchInput"); // Search input field
var btnAdd = document.getElementById("btnAdd"); // Button to add a new product
var btnUpdate = document.getElementById("btnUpdate"); // Button to update an existing product
var currentIndex = 0; // Index of the product being updated
var productList = []; // Array to store the list of products

// Load product data from localStorage if available
if (localStorage.getItem("productContainer") !== null) {
  productList = JSON.parse(localStorage.getItem("productContainer")); // Load products into the list
  displayData(); // Display product data on the page
}
// !========================== End Global Variables

// ?========================== Start Functions

// Function to add a new product
function addProduct() {
  if (validationName() && validationPrice() && validationCategory() && validationDescription()) {
    var product = {
      name: productNameInput.value.trim(), // Trim the input value for product name
      price: productPriceInput.value, // Get the product price
      category: productCategoryInput.value.trim(), // Trim the input value for product category
      description: productDescriptionInput.value.trim(), // Trim the input value for product description
      image: productImageInput.files[0] ? `images/${productImageInput.files[0]?.name}` : "images/p-1.jpg", // Get product image, fallback to default if not provided
    };

    productList.push(product); // Add the new product to the product list

    // Save the updated product list to localStorage
    localStorage.setItem("productContainer", JSON.stringify(productList));

    displayData(); // Display updated product data

    clearForm(); // Clear the form fields
  }
}

// Function to display product data on the page
function displayData() {
  var cartona = "";
  for (var i = 0; i < productList.length; i++) {
    cartona += createCols(i); // Generate HTML content for each product
  }

  document.getElementById("rowData").innerHTML = cartona; // Inject the generated HTML into the page
}

// Function to search for products by name
function searchData() {
  var term = searchInput.value; // Get the search term from the input field
  var cartona = "";

  for (var i = 0; i < productList.length; i++) {
    if (productList[i].name.toLowerCase().includes(term.toLowerCase())) {
      cartona += createCols(i); // Add matching products to the HTML content
    }
  }

  document.getElementById("rowData").innerHTML = cartona; // Update the displayed product list with search results
}

// Function to create the HTML content for each product
function createCols(i) {
  var regex = new RegExp(searchInput.value, "gi"); // Create a regex pattern for highlighting search term

  return `
  <div class="col">
    <div class="card h-100">
      <img height="150px" class="card-img-top" src="  ${productList[i].image}  " alt=" ${productList[i].name} " />
      <div class="card-body text-center">
        <span class="badge bg-info">ID: ${i + 1} </span>
        <h3 class="card-title h6">${productList[i].name.replace(
          regex,
          (match) => `<span class="bg-info">${match}</span>`
        )} </h3>
        <div class="d-flex flex-column gap-2">
          <h4 class="card-text small">${productList[i].price} </h4>
          <h4 class="card-text small">  ${productList[i].category} </h4>
          <p class="card-text small">  ${productList[i].description} </p>
        </div>
      </div>

      <div class="card-footer text-center d-flex gap-2 justify-content-center">
        <button onclick="deleteItem( ${i} )" class="btn btn-outline-danger"><i class="fas fa-trash"></i></button>
        <button onclick="setUpdateInfo(${i})" class="btn btn-outline-warning"><i class="fas fa-edit"></i></button>
      </div>
    </div>
  </div>
 `;
}

// Function to delete a product from the list
function deleteItem(index) {
  productList.splice(index, 1); // Remove the product from the array

  // Save the updated list to localStorage
  localStorage.setItem("productContainer", JSON.stringify(productList));

  displayData(); // Refresh the displayed product data
}

// Function to clear the input form
function clearForm() {
  productNameInput.value = null;
  productPriceInput.value = null;
  productCategoryInput.value = null;
  productDescriptionInput.value = null;
  productImageInput.value = null;

  productNameInput.classList.remove("is-valid");
  productPriceInput.classList.remove("is-valid");
  productDescriptionInput.classList.remove("is-valid");
  productCategoryInput.classList.remove("is-valid");
}

// Function to set product data for updating
function setUpdateInfo(index) {
  currentIndex = index; // Store the index of the product being updated

  // Populate the form with the product's current data
  productNameInput.value = productList[index].name;
  productPriceInput.value = productList[index].price;
  productCategoryInput.value = productList[index].category;
  productDescriptionInput.value = productList[index].description;

  btnAdd.classList.add("d-none"); // Hide the Add button
  btnUpdate.classList.remove("d-none"); // Show the Update button
}

// Function to update an existing product
function updateData() {
  if (validationName() && validationPrice() && validationCategory() && validationDescription()) {
    var product = {
      name: productNameInput.value,
      price: productPriceInput.value,
      category: productCategoryInput.value,
      description: productDescriptionInput.value,
      image: productImageInput.files[0] ? `images/${productImageInput.files[0]?.name}` : "images/p-1.jpg", // Handle image input
    };

    // Replace the old product with the updated product
    productList.splice(currentIndex, 1, product);

    // Save the updated list to localStorage
    localStorage.setItem("productContainer", JSON.stringify(productList));

    displayData(); // Refresh the displayed product data
    clearForm(); // Clear the input form

    btnAdd.classList.remove("d-none"); // Show the Add button again
    btnUpdate.classList.add("d-none"); // Hide the Update button
  }
}

// Validation functions for product fields

function validationName() {
  var regex = /^[a-zA-Z][a-zA-Z0-9 _-]{2,19}$/; // Regex to validate product name
  var text = productNameInput.value;
  var msgName = document.getElementById("msgName");

  if (regex.test(text)) {
    // Valid input
    productNameInput.classList.add("is-valid");
    productNameInput.classList.remove("is-invalid");
    msgName.classList.add("d-none");
    return true;
  } else {
    // Invalid input
    productNameInput.classList.add("is-invalid");
    productNameInput.classList.remove("is-valid");
    msgName.classList.remove("d-none");
    return false;
  }
}

function validationPrice() {
  var regex = /^\d{1,10}(\.\d{1,2})?$/; // Regex to validate product price
  var text = productPriceInput.value;
  var msgPrice = document.getElementById("msgPrice");

  if (regex.test(text)) {
    // Valid input
    productPriceInput.classList.add("is-valid");
    productPriceInput.classList.remove("is-invalid");
    msgPrice.classList.add("d-none");
    return true;
  } else {
    // Invalid input
    productPriceInput.classList.add("is-invalid");
    productPriceInput.classList.remove("is-valid");
    msgPrice.classList.remove("d-none");
    return false;
  }
}

function validationCategory() {
  var regex = /^(mobile|tv|screens|electronic)$/; // Regex to validate product category
  var text = productCategoryInput.value;
  var msgCategory = document.getElementById("msgCategory");

  if (regex.test(text)) {
    // Valid input
    productCategoryInput.classList.add("is-valid");
    productCategoryInput.classList.remove("is-invalid");
    msgCategory.classList.add("d-none");
    return true;
  } else {
    // Invalid input
    productCategoryInput.classList.add("is-invalid");
    productCategoryInput.classList.remove("is-valid");
    msgCategory.classList.remove("d-none");
    return false;
  }
}

function validationDescription() {
  var regex = /^[\w\W\s]{3,150}$/; // Regex to validate product description
  var text = productDescriptionInput.value;
  var msgDescription = document.getElementById("msgDescription");

  if (regex.test(text)) {
    // Valid input
    productDescriptionInput.classList.add("is-valid");
    productDescriptionInput.classList.remove("is-invalid");
    msgDescription.classList.add("d-none");
    return true;
  } else {
    // Invalid input
    productDescriptionInput.classList.add("is-invalid");
    productDescriptionInput.classList.remove("is-valid");
    msgDescription.classList.remove("d-none");
    return false;
  }
}

// ?========================== End Functions
