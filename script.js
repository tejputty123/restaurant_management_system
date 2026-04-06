function login() {
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    if (!user || !pass) {
        alert("Fill all fields");
        return;
    }

    localStorage.setItem("user", user);
    window.location.href = "dashboard.html";
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

function getBills() {
    try {
        const raw = localStorage.getItem("bills");
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        
        if (Array.isArray(parsed) || typeof parsed !== "object") {
            localStorage.removeItem("bills");
            return {};
        }
        
        for (const table in parsed) {
            if (!Array.isArray(parsed[table])) {
                delete parsed[table];
            }
        }
        return parsed;
    } catch (e) {
        localStorage.removeItem("bills");
        return {};
    }
}

function saveBills(bills) {
    localStorage.setItem("bills", JSON.stringify(bills));
}


function addItem() {
    const name     = document.getElementById("itemName").value.trim();
    const price    = parseInt(document.getElementById("itemPrice").value);
    const category = document.getElementById("itemCategory").value.trim();

    if (!name || !price || !category) {
        alert("Fill all fields");
        return;
    }

    const menu = JSON.parse(localStorage.getItem("menu") || "[]");
    menu.push({ name, price, category });
    localStorage.setItem("menu", JSON.stringify(menu));

    displayMenu();

    document.getElementById("itemName").value     = "";
    document.getElementById("itemPrice").value    = "";
    document.getElementById("itemCategory").value = "";
}

function displayMenu() {
    const list = document.getElementById("menuList");
    if (!list) return;

    const menu = JSON.parse(localStorage.getItem("menu") || "[]");
    list.innerHTML = "";

    if (menu.length === 0) {
        list.innerHTML = "<li>No menu items yet.</li>";
        return;
    }

    menu.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.name} (${item.category}) - Rs.${item.price}`;
        list.appendChild(li);
    });
}



function addOrder() {
    const table         = document.getElementById("tableNo").value.trim();
    const itemNameInput = document.getElementById("orderItem").value.trim();
    const qty           = parseInt(document.getElementById("quantity").value);

    if (!table || !itemNameInput || !qty || isNaN(qty)) {
        alert("Fill all fields correctly");
        return;
    }

    const menu  = JSON.parse(localStorage.getItem("menu") || "[]");
    const found = menu.find(m => m.name.toLowerCase() === itemNameInput.toLowerCase());

    if (!found) {
        alert("Item not found in menu. Please check the item name.");
        return;
    }

    const price = found.price * qty;

    const bills = getBills();
    if (!bills[table]) bills[table] = [];
    bills[table].push({ item: found.name, qty: qty, price: price });
    saveBills(bills);

    displayOrders();

    document.getElementById("tableNo").value   = "";
    document.getElementById("orderItem").value = "";
    document.getElementById("quantity").value  = "";
}

function displayOrders() {
    const list = document.getElementById("orderList");
    if (!list) return;

    const bills = getBills();
    list.innerHTML = "";

    const allOrders = [];
    for (const table in bills) {
        bills[table].forEach(order => {
            allOrders.push({ table, ...order });
        });
    }

    if (allOrders.length === 0) {
        list.innerHTML = "<li>No orders yet.</li>";
        return;
    }

    allOrders.forEach(order => {
        const li = document.createElement("li");
        li.textContent = `Table ${order.table} -> ${order.item} x ${order.qty} = Rs.${order.price}`;
        list.appendChild(li);
    });
}



function displayBills() {
    const list = document.getElementById("billList");
    if (!list) return;

    const bills  = getBills();
    const tables = Object.keys(bills);

    list.innerHTML = "";

    if (tables.length === 0) {
        list.innerHTML = "<li>No bills yet.</li>";
        return;
    }

    tables.forEach(table => {
        let tableTotal = 0;
        let content    = `<strong>Table ${table}</strong><br>`;

        bills[table].forEach(order => {
            content += `${order.item} x ${order.qty} = Rs.${order.price}<br>`;
            tableTotal += order.price;
        });

        content += `<hr style="margin:6px 0"><b>Total: Rs.${tableTotal}</b>`;

        const li = document.createElement("li");
        li.innerHTML = content;
        list.appendChild(li);
    });
}



document.addEventListener("DOMContentLoaded", function () {
    const path = window.location.pathname;

    if (!path.includes("login.html") && !localStorage.getItem("user")) {
        window.location.href = "login.html";
        return;
    }

    if (path.includes("menu.html"))    displayMenu();
    if (path.includes("orders.html"))  displayOrders();
    if (path.includes("billing.html")) displayBills();
});