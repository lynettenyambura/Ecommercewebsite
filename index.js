const menuItems = document.getElementById("menu-items");
const cart = document.getElementById("cart");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("total-amount");
const categorySelect = document.getElementById("categorySelect");

menuItems.style.maxHeight = "0px";
cart.classList.add("hidden");

function menutoggle() {
    if (menuItems.style.maxHeight === "0px") {
        menuItems.style.maxHeight = "200px";
    } else {
        menuItems.style.maxHeight = "0px";
    }
}

function toggleCart() {
    cart.classList.toggle("hidden");
}

let cartData = [];

document.addEventListener("DOMContentLoaded", function () {
    const productsContainer = document.querySelector(".products");

    const storedCartData = localStorage.getItem("cartData");
    if (storedCartData) {
        cartData = JSON.parse(storedCartData);
        updateCart();
    }

    async function fetchProducts(url) {
        try {
            const response = await fetch(url);
            const products = await response.json();
            displayProducts(products);
            populateCategories(products);
        } catch (err) {
            console.log(err);
        }
    }

    function displayProducts(products) {
        productsContainer.innerHTML = "";
        if (products.length === 0) {
            productsContainer.innerHTML = "<p>No products found.</p>";
            return;
        }
        for (const product of products) {
            const { id, title, category, price, description, image } = product;
            productsContainer.innerHTML += `
                <div class="product">
                    <img src="${image}" alt="" class="product-image">
                    <div class="product-details">
                        <h2 class="product-title">${title}</h2>
                        <p class="product-category">${category}</p>
                        <p class="product-description">${description}</p>
                        <div class="product-price-counter">
                            <h3 class="product-price">$.${price}</h3>
                            <button class="add-to-cart" onclick="addToCart(${id}, '${title}', ${price}, '${image}')">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    function populateCategories(products) {
        const categories = new Set();
        for (const product of products) {
            categories.add(product.category);
        }
        const categoryOptions = Array.from(categories);
        categoryOptions.sort();
        for (const category of categoryOptions) {
            categorySelect.innerHTML += `<option value="${category}">${category}</option>`;
        }
    }

    categorySelect.addEventListener("change", function () {
        const selectedCategory = categorySelect.value;
        if (selectedCategory === "") {
            fetchProducts("https://fakestoreapi.com/products");
        } else {
            const url = `https://fakestoreapi.com/products/category/${selectedCategory}`;
            fetchProducts(url);
        }
    });

    fetchProducts("https://fakestoreapi.com/products");
});

function addToCart(id, title, price, image) {
    const cartItem = {
        id,
        title,
        price,
        image
    };
    cartData.push(cartItem);
    updateCart();

    saveCartData();

    //  // Show alert
    //  const alert = document.createElement("div");
    //  alert.classList.add("cart-alert");
    //  alert.textContent = "Item added to cart!";
    //  document.body.appendChild(alert);
    //  setTimeout(function() {
    //      alert.remove();
    //  }, 2000);
}

function removeFromCart(index) {
    cartData.splice(index, 1);
    updateCart();

    saveCartData();
}

function saveCartData() {
    localStorage.setItem("cartData", JSON.stringify(cartData));
}

function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;
    let count = 0;
    for (let i = 0; i < cartData.length; i++) {
        const { id, title, price, image } = cartData[i];
        const cartItem = document.createElement("li");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
            <img src="${image}" alt="Product Image">
            <div>
                <h4 class="cart-item-title">${title}</h4>
                <p class="cart-item-price">Ksh.${price}</p>
            </div>
            <button onclick="removeFromCart(${i})">Remove</button>
        `;
        cartItems.appendChild(cartItem);
        total += price;
        count += 1;
    }
    cartTotal.textContent = "Kshs." + total.toFixed(0);
    document.getElementById("cart-count").textContent = count;
}

function clearCart() {
    cartData = [];
    updateCart();
    saveCartData();
}