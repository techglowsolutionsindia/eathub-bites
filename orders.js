// ---------------- DOM ELEMENTS ----------------
const noOrderState = document.getElementById("noOrderState");
const orderContent = document.getElementById("orderContent");

const ordersHistorySection = document.getElementById("ordersHistorySection");

const ordersList = document.getElementById("ordersList");

const orderedItemCount = document.getElementById("orderedItemCount");

const orderedItemsList = document.getElementById("orderedItemsList");

const customerName = document.getElementById("customerName");
const customerPhone = document.getElementById("customerPhone");
const customerEmail = document.getElementById("customerEmail");

const customerAddress = document.getElementById("customerAddress");

const customerLandmark = document.getElementById("customerLandmark");

const deliveryInstructions = document.getElementById("deliveryInstructions");

const landmarkRow = document.getElementById("landmarkRow");

const instructionsRow = document.getElementById("instructionsRow");

const orderSubtotal = document.getElementById("orderSubtotal");

const orderDeliveryFee = document.getElementById("orderDeliveryFee");

const orderDiscount = document.getElementById("orderDiscount");

const orderGrandTotal = document.getElementById("orderGrandTotal");

const paymentStatusText = document.getElementById("paymentStatusText");

const orderAgainBtn = document.getElementById("orderAgainBtn");

const orderAgainModal = document.getElementById("orderAgainModal");

const cancelOrderAgain = document.getElementById("cancelOrderAgain");

const confirmOrderAgain = document.getElementById("confirmOrderAgain");

// ---------------- STORAGE KEYS ----------------
const ORDERS_STORAGE_KEY = "eathubOrders";
const LAST_ORDER_STORAGE_KEY = "eathubLastOrder";
const CART_STORAGE_KEY = "eathubCart";

// ---------------- ORDER DATA ----------------
let orders = [];
let selectedOrder = null;

const pageOrdersCount = document.getElementById("pageOrdersCount");

// ---------------- FORMAT CURRENCY ----------------
const formatCurrency = (amount) => {
  const numericAmount = Number(amount) || 0;

  return `₹${numericAmount.toLocaleString("en-IN")}`;
};

// ---------------- FORMAT ORDER DATE ----------------
const formatOrderDate = (dateValue) => {
  if (!dateValue) return "Date unavailable";

  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ---------------- FORMAT SHORT DATE ----------------
const formatShortDate = (dateValue) => {
  if (!dateValue) return "Date unavailable";

  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ---------------- LOAD ALL ORDERS ----------------
const loadOrders = () => {
  try {
    const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);

    orders = savedOrders ? JSON.parse(savedOrders) : [];

    if (!Array.isArray(orders)) {
      orders = [];
    }

    // Compatibility: include old latest order if history is empty
    if (orders.length === 0) {
      const savedLastOrder = localStorage.getItem(LAST_ORDER_STORAGE_KEY);

      const oldLastOrder = savedLastOrder ? JSON.parse(savedLastOrder) : null;

      if (
        oldLastOrder &&
        typeof oldLastOrder === "object" &&
        Array.isArray(oldLastOrder.items)
      ) {
        orders = [oldLastOrder];

        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
      }
    }

    // Remove invalid records
    orders = orders.filter((order) => {
      return order && typeof order === "object" && Array.isArray(order.items);
    });

    // Newest order first
    orders.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    selectedOrder = orders[0] || null;
  } catch (error) {
    console.error("Unable to load order history:", error);

    orders = [];
    selectedOrder = null;
  }
};

// ==================================================
// ORDERS PAGE — EMPTY STATE VISIBILITY
// ==================================================

const updateOrdersPageVisibility = () => {
  const hasOrders = Array.isArray(orders) && orders.length > 0;

  const noOrderState = document.getElementById("noOrderState");

  const ordersHistorySection = document.getElementById("ordersHistorySection");

  if (noOrderState) {
    noOrderState.style.display = hasOrders ? "none" : "flex";
  }

  if (ordersHistorySection) {
    ordersHistorySection.style.display = hasOrders ? "block" : "none";
  }
};

// ---------------- GET TOTAL ITEM QUANTITY ----------------
const getTotalItemQuantity = (order) => {
  if (!order?.items) return 0;

  return order.items.reduce((total, item) => {
    return total + Number(item.quantity || 0);
  }, 0);
};

// ---------------- RENDER COMPACT ORDER HISTORY ----------------
const renderOrdersList = () => {
  if (!ordersList) return;

  ordersList.innerHTML = "";

  if (pageOrdersCount) {
    pageOrdersCount.textContent = orders.length;
  }

  orders.forEach((order) => {
    const orderButton = document.createElement("button");

    orderButton.type = "button";
    orderButton.classList.add("order-history-item");

    orderButton.dataset.orderId = order.orderId || "";

    if (selectedOrder?.orderId === order.orderId) {
      orderButton.classList.add("active");
    }

    orderButton.innerHTML = `
      <strong class="history-item-id">
        #${order.orderId || "Unavailable"}
      </strong>

      <span class="history-item-date">
        ${formatShortDate(order.createdAt)}
      </span>

      <span class="history-payment">
        ${order.paymentMethod || "Unavailable"}
      </span>

      <strong class="history-total">
        ${formatCurrency(order.grandTotal)}
      </strong>

      <span class="history-status">
        ${order.status || "Confirmed"}
      </span>

      <span class="history-view-icon">
        <i class="fa-solid fa-chevron-right"></i>
      </span>
    `;

    orderButton.addEventListener("click", () => {
      selectOrder(order.orderId);
    });

    ordersList.appendChild(orderButton);
  });
};

// ==================================================
// ORDERS PAGE — SELECT AND DISPLAY ORDER
// ==================================================

const selectOrder = (orderId) => {
  selectedOrder = orders.find((order) => order.orderId === orderId) || null;

  if (!selectedOrder) return;

  // Update active table row
  renderOrdersList();

  // Update details below the order table
  renderSelectedOrder();

  // Ensure the order details section remains visible
  updatePageState();

  // Do not scroll automatically.
  // The user can scroll manually to view the selected order details.
};

// ---------------- RENDER ORDER ITEMS ----------------
const renderOrderedItems = () => {
  if (!orderedItemsList || !selectedOrder?.items) return;

  orderedItemsList.innerHTML = "";

  selectedOrder.items.forEach((item) => {
    const quantity = Number(item.quantity || 0);

    const itemPrice = Number(String(item.price).replace(/[^\d.]/g, "")) || 0;

    const itemTotal = itemPrice * quantity;

    const orderedItem = document.createElement("article");

    orderedItem.classList.add("ordered-item");

    orderedItem.innerHTML = `
      <div class="ordered-item-image">
        <img
          src="${item.image}"
          alt="${item.name}"
        />
      </div>

      <div class="ordered-item-details">
        <h3>${item.name}</h3>

        <p>
          ${formatCurrency(itemPrice)} × ${quantity}
        </p>
      </div>

      <strong class="ordered-item-total">
        ${formatCurrency(itemTotal)}
      </strong>
    `;

    orderedItemsList.appendChild(orderedItem);
  });

  if (orderedItemCount) {
    orderedItemCount.textContent = getTotalItemQuantity(selectedOrder);
  }
};

// ---------------- RENDER CUSTOMER DETAILS ----------------
const renderCustomerDetails = () => {
  const customer = selectedOrder?.customer || {};

  if (customerName) {
    customerName.textContent = customer.fullName || "Not available";
  }

  if (customerPhone) {
    customerPhone.textContent = customer.phone || "Not available";
  }

  if (customerEmail) {
    customerEmail.textContent = customer.email || "Not available";
  }

  const completeAddress = [customer.address, customer.city, customer.pincode]
    .filter(Boolean)
    .join(", ");

  if (customerAddress) {
    customerAddress.textContent = completeAddress || "Not available";
  }

  const landmark = customer.landmark?.trim();

  if (landmark) {
    if (customerLandmark) {
      customerLandmark.textContent = landmark;
    }

    landmarkRow?.classList.remove("hidden");
  } else {
    landmarkRow?.classList.add("hidden");
  }

  const instructions = customer.instructions?.trim();

  if (instructions) {
    if (deliveryInstructions) {
      deliveryInstructions.textContent = instructions;
    }

    instructionsRow?.classList.remove("hidden");
  } else {
    instructionsRow?.classList.add("hidden");
  }
};

// ---------------- RENDER ORDER SUMMARY ----------------
const renderOrderSummary = () => {
  if (!selectedOrder) return;

  if (paymentStatusText) {
    paymentStatusText.textContent =
      selectedOrder.paymentMethod || "Not available";
  }

  if (orderSubtotal) {
    orderSubtotal.textContent = formatCurrency(selectedOrder.subtotal);
  }

  if (orderDeliveryFee) {
    orderDeliveryFee.textContent = formatCurrency(selectedOrder.deliveryFee);
  }

  if (orderDiscount) {
    orderDiscount.textContent = `− ${formatCurrency(selectedOrder.discount)}`;
  }

  if (orderGrandTotal) {
    orderGrandTotal.textContent = formatCurrency(selectedOrder.grandTotal);
  }
};

// ---------------- RENDER SELECTED ORDER ----------------
const renderSelectedOrder = () => {
  if (!selectedOrder) return;

  renderOrderSummary();
  renderOrderedItems();
  renderCustomerDetails();
};

// ==================================================
// ORDERS PAGE — CONTROL EMPTY, HISTORY AND DETAILS
// ==================================================

const updatePageState = () => {
  const hasOrders = Array.isArray(orders) && orders.length > 0;

  const noOrderState = document.getElementById("noOrderState");

  const ordersHistorySection = document.getElementById("ordersHistorySection");

  const orderContent = document.querySelector(".order-content");

  // Show the empty-order message only when no orders exist
  if (noOrderState) {
    noOrderState.hidden = hasOrders;
  }

  // Show the orders table only when orders exist
  if (ordersHistorySection) {
    ordersHistorySection.hidden = !hasOrders;
  }

  // Show the selected order details when an order exists
  if (orderContent) {
    orderContent.classList.toggle("show", hasOrders && Boolean(selectedOrder));
  }
};

// ---------------- OPEN ORDER AGAIN MODAL ----------------
const openOrderAgainModal = () => {
  if (!selectedOrder?.items?.length) return;

  orderAgainModal?.classList.add("active");

  orderAgainModal?.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";
};

// ---------------- CLOSE ORDER AGAIN MODAL ----------------
const closeOrderAgainModal = () => {
  orderAgainModal?.classList.remove("active");

  orderAgainModal?.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";
};

orderAgainBtn?.addEventListener("click", openOrderAgainModal);

cancelOrderAgain?.addEventListener("click", closeOrderAgainModal);

orderAgainModal?.addEventListener("click", (event) => {
  if (event.target === orderAgainModal) {
    closeOrderAgainModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeOrderAgainModal();
  }
});

// ---------------- ADD SELECTED ORDER TO CART ----------------
const addSelectedOrderToCart = () => {
  if (!selectedOrder?.items?.length) return;

  let existingCart = [];

  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    existingCart = savedCart ? JSON.parse(savedCart) : [];

    if (!Array.isArray(existingCart)) {
      existingCart = [];
    }
  } catch (error) {
    console.error("Unable to read current cart:", error);

    existingCart = [];
  }

  selectedOrder.items.forEach((orderedItem) => {
    const existingItem = existingCart.find(
      (cartItem) => cartItem.id === orderedItem.id,
    );

    if (existingItem) {
      existingItem.quantity += Number(orderedItem.quantity || 0);
    } else {
      existingCart.push({
        ...orderedItem,
        quantity: Number(orderedItem.quantity || 0),
      });
    }
  });

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(existingCart));

  window.location.href = "index.html#menu";
};

// ---------------- CONFIRM ORDER AGAIN ----------------
confirmOrderAgain?.addEventListener("click", () => {
  addSelectedOrderToCart();
});

// ---------------- INITIALIZE ORDERS PAGE ----------------
const initializeOrdersPage = () => {
  loadOrders();
  updatePageState();

  if (!selectedOrder) return;

  renderOrdersList();
  renderSelectedOrder();
};

initializeOrdersPage();
