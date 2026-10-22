const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");
const alertMessage = document.getElementById("alertMessage");

let products = JSON.parse(localStorage.getItem("products")) || [];

// Save products
function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}

// Display products in the table
function displayProducts() {
    productList.innerHTML = "";

    products.forEach(function(product, index) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>${product.limit}</td>
            <td>${product.quantity <= product.limit ? "Low Stock" : "In Stock"}</td>
            <td>
                <button type="button" onclick="deleteProduct(${index})">
                    Delete
                </button>
            </td>
        `;

        productList.appendChild(row);
    });
    updateDashboard();
}
// Update Dashboard
function updateDashboard() {
    document.getElementById("totalProducts").textContent = products.length;

    const lowStock = products.filter(function(product) {
        return product.quantity <= product.limit;
    }).length;

    document.getElementById("lowStockProducts").textContent = lowStock;

    document.getElementById("inStockProducts").textContent =
        products.length - lowStock;
}
// Add Product
productForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("productName").value.trim();
    const quantity = Number(document.getElementById("quantity").value);
    const limit = Number(document.getElementById("limit").value);

    if (name === "") {
        alert("Please enter a product name.");
        return;
    }

    products.push({
        name: name,
        quantity: quantity,
        limit: limit

    });

    saveProducts();
    displayProducts();

    if (quantity <= limit) {
        alertMessage.textContent = "Low stock alert: " + name;
        alert("Warning! " + name + " is low in stock.");
    } else {
        alertMessage.textContent = "";
    }

    productForm.reset();
    document.getElementById("limit").value = 25;
});

// Update Stock
function updateStock() {
    const name = document.getElementById("updateName").value.trim();
    const quantityInput = document.getElementById("updateQuantity").value;

    if (name === "" || quantityInput === "") {
        alert("Please enter product name and quantity.");
        return;
    }

    const newQuantity = Number(quantityInput);

    const product = products.find(function(item) {
        return item.name.toLowerCase() === name.toLowerCase();
    });

    if (!product) {
        alert("Product not found. Please add it first.");
        return;
    }

    product.quantity = newQuantity;

    saveProducts();
    displayProducts();

    if (newQuantity <= product.limit) {
        alertMessage.textContent = "Low stock alert: " + product.name;
        alert("Warning! " + product.name + " is low in stock.");
    } else {
        alertMessage.textContent = "";
    }

    document.getElementById("updateName").value = "";
    document.getElementById("updateQuantity").value = "";
}

// Delete Product
function deleteProduct(index) {
    products.splice(index, 1);
    saveProducts();
    displayProducts();
}

// Load saved products when the website opens
displayProducts();
// Show Registration Form
function showRegister() {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("registerSection").style.display = "block";
    document.getElementById("loginMessage").textContent = "";
}

// Show Login Form
function showLogin() {
    document.getElementById("loginSection").style.display = "block";
    document.getElementById("registerSection").style.display = "none";
    document.getElementById("loginMessage").textContent = "";
}

// Register User
document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("newUsername").value.trim();
    const password = document.getElementById("newPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find(function(user) {
        return user.username.toLowerCase() === username.toLowerCase();
    });

    if (existingUser) {
        alert("Username already exists. Please choose another.");
        return;
    }

    users.push({
        username: username,
        password: password
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful! Please log in.");

    document.getElementById("registerForm").reset();
    showLogin();
});

// Login User
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const validUser = users.find(function(user) {
        return user.username.toLowerCase() === username.toLowerCase()
            && user.password === password;
    });

    if (validUser) {
        document.getElementById("loginPage").style.display = "none";

        document.querySelectorAll("body > h1, body > p, body > h2, body > .dashboard, body > form, body > table, body > section").forEach(function(element) {
            element.style.display = "";
        });

        alert("Login successful! Welcome, " + validUser.username);
    } else {
        document.getElementById("loginMessage").textContent =
            "Invalid username or password. Please register first.";
        document.getElementById("loginMessage").style.color = "red";
    }
});
// Show low-stock product names when the number is clicked
function showLowStockProducts() {
    const lowStockList = document.getElementById("lowStockList");
    const lowStockDetails = document.getElementById("lowStockDetails");

    const lowStockItems = products.filter(function(product) {
        return Number(product.quantity) <= Number(product.limit);
    });

    if (lowStockList.style.display === "block") {
        lowStockList.style.display = "none";
        return;
    }

    lowStockList.style.display = "block";

    if (lowStockItems.length === 0) {
        lowStockDetails.innerHTML = "<p>No low-stock products!</p>";
        return;
    }

    lowStockDetails.innerHTML = lowStockItems.map(function(product) {
        return `
            <div style="background: #fff3cd; padding: 12px; margin: 10px 0; border-radius: 8px;">
                <strong>Product:</strong> ${product.name}<br>
                <strong>Quantity:</strong> ${product.quantity}<br>
                <strong>Low Stock Limit:</strong> ${product.limit}<br>
                <strong>Status:</strong> ⚠️ Low Stock
            </div>
        `;
    }).join("");
}

// Search products by name
function searchProducts() {
    const searchInput = document.getElementById("searchProduct").value.toLowerCase();
    const rows = document.querySelectorAll("#productList tr");

    rows.forEach(function(row) {
        const productName = row.cells[0].textContent.toLowerCase();

        if (productName.includes(searchInput)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}
