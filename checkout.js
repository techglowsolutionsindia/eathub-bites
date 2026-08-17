// ==================================================
// CHECKOUT PAGE — DOM ELEMENTS
// ==================================================

const checkoutForm = document.getElementById("checkoutForm");

const checkoutItems = document.getElementById("checkoutItems");

const checkoutEmptyState = document.getElementById("checkoutEmptyState");

const summaryItemCount = document.getElementById("summaryItemCount");

const subtotalAmount = document.getElementById("subtotalAmount");

const deliveryFeeAmount = document.getElementById("deliveryFeeAmount");

const discountAmount = document.getElementById("discountAmount");

const grandTotalAmount = document.getElementById("grandTotalAmount");

const placeOrderBtn = document.getElementById("placeOrderBtn");

const paymentOptions = document.querySelectorAll(".payment-option");

const orderSuccessModal = document.getElementById("orderSuccessModal");

const successOrderId = document.getElementById("successOrderId");

const successOrderTotal = document.getElementById("successOrderTotal");

const successPaymentMethod = document.getElementById("successPaymentMethod");

// ==================================================
// CHECKOUT PAGE — STORAGE KEYS
// ==================================================

const CART_STORAGE_KEY = "eathubCart";

const ORDERS_STORAGE_KEY = "eathubOrders";

const LAST_ORDER_STORAGE_KEY = "eathubLastOrder";

// ==================================================
// CHECKOUT PAGE — AUTHENTICATED CUSTOMER
// ==================================================

const getCheckoutCurrentUser = () => {
  return window.EatHubAuth?.getCurrentUser?.() || null;
};

const protectCheckoutPage = () => {
  const currentUser = getCheckoutCurrentUser();

  if (currentUser) {
    return currentUser;
  }

  window.location.replace("index.html?auth=required");

  return null;
};

// ==================================================
// CHECKOUT PAGE — DATA AND SETTINGS
// ==================================================

let checkoutCart = [];

const DELIVERY_FEE = 40;

const DISCOUNT_AMOUNT = 0;

// ==================================================
// CHECKOUT PAGE — PRICE HELPERS
// ==================================================

const getNumericPrice = (price) => {
  return Number(String(price).replace(/[^\d.]/g, "")) || 0;
};

const formatCurrency = (amount) => {
  const numericAmount = Number(amount) || 0;

  return `₹${numericAmount.toLocaleString("en-IN")}`;
};

// ==================================================
// CHECKOUT PAGE — LOAD CART FROM LOCAL STORAGE
// ==================================================

const loadCheckoutCart = () => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    checkoutCart = savedCart ? JSON.parse(savedCart) : [];

    if (!Array.isArray(checkoutCart)) {
      checkoutCart = [];
    }
  } catch (error) {
    console.error("Unable to read checkout cart:", error);

    checkoutCart = [];
  }
};

// ==================================================
// CHECKOUT PAGE — CART CALCULATIONS
// ==================================================

const getTotalQuantity = () => {
  return checkoutCart.reduce((total, item) => {
    return total + Number(item.quantity || 0);
  }, 0);
};

const getSubtotal = () => {
  return checkoutCart.reduce((total, item) => {
    const price = getNumericPrice(item.price);

    const quantity = Number(item.quantity || 0);

    return total + price * quantity;
  }, 0);
};

const getGrandTotal = () => {
  if (checkoutCart.length === 0) {
    return 0;
  }

  return Math.max(getSubtotal() + DELIVERY_FEE - DISCOUNT_AMOUNT, 0);
};

// ==================================================
// CHECKOUT PAGE — RENDER CART ITEMS
// ==================================================

const renderCheckoutItems = () => {
  if (!checkoutItems) return;

  checkoutItems.innerHTML = "";

  const hasItems = checkoutCart.length > 0;

  checkoutItems.style.display = hasItems ? "block" : "none";

  checkoutEmptyState?.classList.toggle("show", !hasItems);

  if (summaryItemCount) {
    summaryItemCount.textContent = getTotalQuantity();
  }

  checkoutCart.forEach((item) => {
    const quantity = Number(item.quantity || 0);

    const unitPrice = getNumericPrice(item.price);

    const itemTotal = unitPrice * quantity;

    const checkoutItem = document.createElement("article");

    checkoutItem.classList.add("checkout-item");

    checkoutItem.innerHTML = `
      <div class="checkout-item-image">
        <img
          src="${item.image}"
          alt="${item.name}"
        />
      </div>

      <div class="checkout-item-details">
        <h3>${item.name}</h3>

        <p>
          ${formatCurrency(unitPrice)} × ${quantity}
        </p>
      </div>

      <strong class="checkout-item-total">
        ${formatCurrency(itemTotal)}
      </strong>
    `;

    checkoutItems.appendChild(checkoutItem);
  });

  updatePriceSummary();

  if (placeOrderBtn) {
    placeOrderBtn.disabled = !hasItems;
  }
};

// ==================================================
// CHECKOUT PAGE — UPDATE PRICE SUMMARY
// ==================================================

const updatePriceSummary = () => {
  const subtotal = getSubtotal();

  const deliveryFee = checkoutCart.length > 0 ? DELIVERY_FEE : 0;

  const grandTotal =
    checkoutCart.length > 0 ? subtotal + deliveryFee - DISCOUNT_AMOUNT : 0;

  if (subtotalAmount) {
    subtotalAmount.textContent = formatCurrency(subtotal);
  }

  if (deliveryFeeAmount) {
    deliveryFeeAmount.textContent =
      deliveryFee === 0 ? "₹0" : formatCurrency(deliveryFee);
  }

  if (discountAmount) {
    discountAmount.textContent = `− ${formatCurrency(DISCOUNT_AMOUNT)}`;
  }

  if (grandTotalAmount) {
    grandTotalAmount.textContent = formatCurrency(grandTotal);
  }
};

// ==================================================
// CHECKOUT PAGE — PAYMENT METHOD SELECTION
// ==================================================

paymentOptions.forEach((option) => {
  option.addEventListener("click", () => {
    paymentOptions.forEach((item) => {
      item.classList.remove("active");
    });

    option.classList.add("active");

    const radio = option.querySelector('input[type="radio"]');

    if (radio) {
      radio.checked = true;
    }
  });
});

// ==================================================
// CHECKOUT PAGE — FORM VALIDATION HELPERS
// ==================================================

const showFieldError = (field, message) => {
  const formGroup = field.closest(".form-group");

  const errorElement = formGroup?.querySelector(".error-message");

  formGroup?.classList.add("has-error");

  if (errorElement) {
    errorElement.textContent = message;
  }
};

const clearFieldError = (field) => {
  const formGroup = field.closest(".form-group");

  const errorElement = formGroup?.querySelector(".error-message");

  formGroup?.classList.remove("has-error");

  if (errorElement) {
    errorElement.textContent = "";
  }
};

// ==================================================
// CHECKOUT PAGE — VALIDATE CHECKOUT FORM
// ==================================================

const validateCheckoutForm = () => {
  if (!checkoutForm) return false;

  const fullName = checkoutForm.fullName;

  const phone = checkoutForm.phone;

  const email = checkoutForm.email;

  const address = checkoutForm.address;

  const city = checkoutForm.city;

  const pincode = checkoutForm.pincode;

  let isValid = true;

  const nameValue = fullName.value.trim();

  const phoneValue = phone.value.trim();

  const emailValue = email.value.trim();

  const addressValue = address.value.trim();

  const cityValue = city.value.trim();

  const pincodeValue = pincode.value.trim();

  const phonePattern = /^[6-9]\d{9}$/;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const pincodePattern = /^\d{6}$/;

  clearFieldError(fullName);

  clearFieldError(phone);

  clearFieldError(email);

  clearFieldError(address);

  clearFieldError(city);

  clearFieldError(pincode);

  if (nameValue.length < 3) {
    showFieldError(fullName, "Please enter your full name.");

    isValid = false;
  }

  if (!phonePattern.test(phoneValue)) {
    showFieldError(phone, "Enter a valid 10-digit mobile number.");

    isValid = false;
  }

  if (!emailPattern.test(emailValue)) {
    showFieldError(email, "Enter a valid email address.");

    isValid = false;
  }

  if (addressValue.length < 10) {
    showFieldError(address, "Please enter your complete delivery address.");

    isValid = false;
  }

  if (cityValue.length < 2) {
    showFieldError(city, "Please enter your city.");

    isValid = false;
  }

  if (!pincodePattern.test(pincodeValue)) {
    showFieldError(pincode, "Enter a valid 6-digit PIN code.");

    isValid = false;
  }

  if (!isValid) {
    const firstError = checkoutForm.querySelector(".form-group.has-error");

    firstError?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  return isValid;
};

// ==================================================
// CHECKOUT PAGE — CLEAR ERRORS WHILE TYPING
// ==================================================

checkoutForm?.querySelectorAll("input, textarea").forEach((field) => {
  field.addEventListener("input", () => {
    clearFieldError(field);
  });
});

// ==================================================
// CHECKOUT PAGE — GENERATE ORDER ID
// ==================================================

const generateOrderId = () => {
  const randomNumber = Math.floor(100000 + Math.random() * 900000);

  return `EAT${randomNumber}`;
};

// ==================================================
// CHECKOUT PAGE — GET PAYMENT METHOD
// ==================================================

const getSelectedPaymentMethod = () => {
  const selectedPayment = document.querySelector(
    'input[name="paymentMethod"]:checked',
  );

  return selectedPayment?.value || "Cash on Delivery";
};

// ==================================================
// CHECKOUT PAGE — SHOW ORDER SUCCESS MODAL
// ==================================================

const showSuccessModal = (completedOrder) => {
  if (!completedOrder) return;

  if (successOrderId) {
    successOrderId.textContent = completedOrder.orderId;
  }

  if (successOrderTotal) {
    successOrderTotal.textContent = formatCurrency(completedOrder.grandTotal);
  }

  if (successPaymentMethod) {
    successPaymentMethod.textContent = completedOrder.paymentMethod;
  }

  orderSuccessModal?.classList.add("active");

  orderSuccessModal?.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";
};

// ==================================================
// CHECKOUT PAGE — SAVE ORDER TO HISTORY
// ==================================================

const saveOrderToHistory = (orderDetails) => {
  let orderHistory = [];

  try {
    const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);

    orderHistory = savedOrders ? JSON.parse(savedOrders) : [];

    if (!Array.isArray(orderHistory)) {
      orderHistory = [];
    }
  } catch (error) {
    console.error("Unable to read order history:", error);

    orderHistory = [];
  }

  const orderAlreadyExists = orderHistory.some((order) => {
    return order.orderId === orderDetails.orderId;
  });

  if (!orderAlreadyExists) {
    orderHistory.unshift(orderDetails);
  }

  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orderHistory));

  // Keep latest order separately
  localStorage.setItem(LAST_ORDER_STORAGE_KEY, JSON.stringify(orderDetails));
};

// ==================================================
// CHECKOUT PAGE — PLACE ORDER
// ==================================================

checkoutForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (checkoutCart.length === 0) {
    return;
  }

  const isFormValid = validateCheckoutForm();

  if (!isFormValid) {
    return;
  }

  const currentUser = getCheckoutCurrentUser();

  const orderDetails = {
    orderId: generateOrderId(),

    userId: currentUser?.id || null,

    customer: {
      fullName: checkoutForm.fullName.value.trim(),

      phone: checkoutForm.phone.value.trim(),

      email: checkoutForm.email.value.trim(),

      address: checkoutForm.address.value.trim(),

      city: checkoutForm.city.value.trim(),

      pincode: checkoutForm.pincode.value.trim(),

      landmark: checkoutForm.landmark.value.trim(),

      instructions: checkoutForm.instructions.value.trim(),
    },

    paymentMethod: getSelectedPaymentMethod(),

    // Save an independent copy of cart items
    items: checkoutCart.map((item) => ({
      ...item,

      quantity: Number(item.quantity || 0),
    })),

    subtotal: getSubtotal(),

    deliveryFee: DELIVERY_FEE,

    discount: DISCOUNT_AMOUNT,

    grandTotal: getGrandTotal(),

    status: "Confirmed",

    estimatedDelivery: "30–40 minutes",

    createdAt: new Date().toISOString(),
  };

  // Show processing state
  if (placeOrderBtn) {
    placeOrderBtn.disabled = true;

    placeOrderBtn.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Processing Order
      `;
  }

  // Save this completed order once
  saveOrderToHistory(orderDetails);

  // Show confirmation after a short delay
  setTimeout(() => {
    showSuccessModal(orderDetails);

    // Clear shared cart after order completion
    localStorage.removeItem(CART_STORAGE_KEY);

    checkoutCart = [];

    renderCheckoutItems();
  }, 700);
});

// ==================================================
// CHECKOUT PAGE — PREFILL SIGNED-IN CUSTOMER
// ==================================================

const prefillSignedInCustomer = (currentUser) => {
  if (!checkoutForm || !currentUser) return;

  if (checkoutForm.fullName) {
    checkoutForm.fullName.value = currentUser.fullName || "";
  }

  if (checkoutForm.phone) {
    checkoutForm.phone.value = currentUser.phone || "";
  }

  if (checkoutForm.email) {
    checkoutForm.email.value = currentUser.email || "";
  }
};

// ==================================================
// CHECKOUT PAGE — INITIALIZE CHECKOUT
// ==================================================

const initializeCheckout = () => {
  const currentUser = protectCheckoutPage();

  if (!currentUser) return;

  loadCheckoutCart();
  renderCheckoutItems();
  prefillSignedInCustomer(currentUser);
};

initializeCheckout();
