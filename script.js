function login() {
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    if (user === "" || pass === "") {
        alert("Please fill all fields!");
        return;
    }

    localStorage.setItem("user", user);
    window.location.href = "dashboard.html";
}


if (window.location.pathname.includes("dashboard.html")) {
    let user = localStorage.getItem("user");
    if (!user) {
        window.location.href = "login.html";
    }
}


function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}


function addItem() {
    let name = document.getElementById("itemName").value;
    let price = document.getElementById("itemPrice").value;
    let category = document.getElementById("itemCategory").value;

    if (!name || !price || !category) {
        alert("Fill all fields!");
        return;
    }

    let menu = JSON.parse(localStorage.getItem("menu")) || [];
    menu.push({ name, price, category });

    localStorage.setItem("menu", JSON.stringify(menu));

    alert("Item Added!");

    displayMenu();

    document.getElementById("itemName").value = "";
    document.getElementById("itemPrice").value = "";
    document.getElementById("itemCategory").value = "";
}

function displayMenu() {
    let menu = JSON.parse(localStorage.getItem("menu")) || [];
    let list = document.getElementById("menuList");

    if (!list) return;

    list.innerHTML = "";

    menu.forEach(item => {
        let li = document.createElement("li");
        li.textContent = `${item.name} (${item.category}) - ₹${item.price}`;
        list.appendChild(li);
    });
}


let total = parseInt(localStorage.getItem("total")) || 0;

function addOrder() {
    let item = document.getElementById("orderItem").value;
    let qty = parseInt(document.getElementById("quantity").value);

    let menu = JSON.parse(localStorage.getItem("menu")) || [];

    let found = menu.find(m =>
        m.name.toLowerCase() === item.toLowerCase()
    );

    if (!found) {
        alert("Item not found!");
        return;
    }

    let price = found.price * qty;
    total += price;

    localStorage.setItem("total", total);

    document.getElementById("total").textContent = total;

    let li = document.createElement("li");
    li.textContent = `${item} x ${qty} = ₹${price}`;

    document.getElementById("orderList").appendChild(li);
}


window.onload = function () {
    displayMenu();

    let totalDisplay = document.getElementById("total");
    if (totalDisplay) {
        totalDisplay.textContent = total;
    }
};