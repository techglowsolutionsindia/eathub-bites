// ---------------- REVIEW SLIDER ----------------
if (typeof Swiper !== "undefined" && document.querySelector(".mySwiper")) {
  new Swiper(".mySwiper", {
    loop: true,
    navigation: {
      nextEl: "#next",
      prevEl: "#previous",
    },
  });
}

// ---------------- DOM ELEMENTS ----------------
const header = document.querySelector("header");
const cartIcon = document.querySelector(".cart-icon");
const cartTab = document.querySelector(".cart-tab");
const cartOverlay = document.querySelector(".cart-overlay");
const cartCloseBtn = document.querySelector(".cart-close-btn");
const clearCartBtn = document.querySelector(".clear-cart-btn");
const checkoutBtn = document.querySelector(".checkout-btn");
const emptyCartMessage = document.querySelector(".empty-cart-message");
const cartUniqueCount = document.querySelector(".cart-unique-count");
const cartItemLabel = document.querySelector(".cart-item-label");
const cardList = document.querySelector(".card-list");
const cartList = document.querySelector(".cart-list");
const cartTotal = document.querySelector(".cart-total");
const cartValue = document.querySelector(".cart-value");
const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");
const bars = hamburger?.querySelector("i");
const backToTop = document.getElementById("backToTop");
const clearCartModal = document.querySelector(".clear-cart-modal");
const cancelClearCartBtn = document.querySelector(".cancel-clear-cart");
const confirmClearCartBtn = document.querySelector(".confirm-clear-cart");

// ---------------- APP DATA ----------------
let productList = [];
let cartProduct = [];

// ---------------- CART LOCAL STORAGE ----------------
const CART_STORAGE_KEY = "eathubCart";

const saveCartToLocalStorage = () => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartProduct));
  } catch (error) {
    console.error("Unable to save cart:", error);
  }
};

const loadCartFromLocalStorage = () => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    cartProduct = savedCart ? JSON.parse(savedCart) : [];

    if (!Array.isArray(cartProduct)) {
      cartProduct = [];
    }
  } catch (error) {
    console.error("Unable to load saved cart:", error);
    cartProduct = [];
  }
};

const clearCartFromLocalStorage = () => {
  localStorage.removeItem(CART_STORAGE_KEY);
};

// ---------------- HEADER SCROLL EFFECT ----------------
window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 50);
  backToTop?.classList.toggle("show", window.scrollY > 300);
});

// ---------------- BACK TO TOP ----------------
backToTop?.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// ---------------- OPEN / CLOSE CART ----------------
const openCart = () => {
  cartTab?.classList.add("cart-tab-active");
  cartOverlay?.classList.add("cart-overlay-active");
  document.body.classList.add("cart-open");
};

const closeCart = () => {
  cartTab?.classList.remove("cart-tab-active");
  cartOverlay?.classList.remove("cart-overlay-active");
  document.body.classList.remove("cart-open");
};

cartIcon?.addEventListener("click", (e) => {
  e.preventDefault();
  openCart();
});

cartCloseBtn?.addEventListener("click", closeCart);

cartOverlay?.addEventListener("click", closeCart);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeCart();
  }
});

// ---------------- CLEAR COMPLETE CART ----------------
// ---------------- OPEN CLEAR CART CONFIRMATION ----------------
clearCartBtn?.addEventListener("click", () => {
  if (cartProduct.length === 0) return;

  clearCartModal?.classList.add("clear-cart-modal-active");
  clearCartModal?.setAttribute("aria-hidden", "false");
});

// ---------------- CLOSE CLEAR CART CONFIRMATION ----------------
const closeClearCartModal = () => {
  clearCartModal?.classList.remove("clear-cart-modal-active");
  clearCartModal?.setAttribute("aria-hidden", "true");
};

// Cancel only closes confirmation
cancelClearCartBtn?.addEventListener("click", () => {
  closeClearCartModal();
});

// ---------------- CONFIRM CLEAR CART ----------------
confirmClearCartBtn?.addEventListener("click", () => {
  cartProduct = [];

  if (cartList) {
    cartList.innerHTML = "";
  }

  document
    .querySelectorAll(".card-quantity-value")
    .forEach((quantityElement) => {
      quantityElement.textContent = "0";
    });

  document.querySelectorAll(".card-minus-btn").forEach((minusButton) => {
    minusButton.disabled = true;
  });

  clearCartFromLocalStorage();
  updateTotals();

  closeClearCartModal();
  closeCart();
});

// ==================================================
// CHECKOUT — REQUIRE CUSTOMER AUTHENTICATION
// ==================================================

const continueToEatHubCheckout = () => {
  saveCartToLocalStorage();
  window.location.href = "checkout.html";
};

checkoutBtn?.addEventListener("click", (event) => {
  event.preventDefault();

  if (cartProduct.length === 0) return;

  saveCartToLocalStorage();

  const customerIsSignedIn = window.EatHubAuth?.isSignedIn?.() === true;

  if (!customerIsSignedIn) {
    closeCart();

    window.EatHubAuth?.open("signin", () => {
      continueToEatHubCheckout();
    });

    return;
  }

  continueToEatHubCheckout();
});

// ---------------- MOBILE MENU ----------------
hamburger?.addEventListener("click", (e) => {
  e.preventDefault();

  mobileMenu?.classList.toggle("mobile-menu-active");
  bars?.classList.toggle("fa-bars");
  bars?.classList.toggle("fa-xmark");
});

// ---------------- PRICE HELPER ----------------
const getNumericPrice = (price) => {
  return Number(String(price).replace(/[^\d.]/g, "")) || 0;
};

// ---------------- UPDATE NAVBAR CART COUNT ----------------
const updateCartCount = () => {
  const totalQuantity = cartProduct.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  if (!cartValue) return;

  cartValue.textContent = totalQuantity;

  cartValue.classList.remove("cart-count-pop");
  void cartValue.offsetWidth;
  cartValue.classList.add("cart-count-pop");
};

// ---------------- UPDATE CART POPUP STATE ----------------
const updateCartPopupState = () => {
  const uniqueItemCount = cartProduct.length;
  const hasProducts = uniqueItemCount > 0;

  if (cartUniqueCount) {
    cartUniqueCount.textContent = uniqueItemCount;
  }

  if (cartItemLabel) {
    cartItemLabel.textContent = uniqueItemCount === 1 ? "item" : "items";
  }

  if (emptyCartMessage) {
    emptyCartMessage.classList.toggle("show-empty-cart", !hasProducts);
  }

  if (cartList) {
    cartList.classList.toggle("hide-cart-list", !hasProducts);
  }

  if (clearCartBtn) {
    clearCartBtn.disabled = !hasProducts;
  }

  if (checkoutBtn) {
    checkoutBtn.classList.toggle("checkout-disabled", !hasProducts);

    checkoutBtn.setAttribute("aria-disabled", String(!hasProducts));
  }
};

// ---------------- UPDATE CART TOTAL ----------------
const updateTotals = () => {
  const totalPrice = cartProduct.reduce((total, item) => {
    return total + getNumericPrice(item.price) * item.quantity;
  }, 0);

  if (cartTotal) {
    cartTotal.textContent = `Rs. ${totalPrice}/-`;
  }

  updateCartCount();
  updateCartPopupState();

  // Keep index page and checkout page synchronized
  if (cartProduct.length > 0) {
    saveCartToLocalStorage();
  } else {
    clearCartFromLocalStorage();
  }
};

// ---------------- UPDATE ONE CART ITEM ----------------
const updateCartItemDisplay = (cartItem, productItem) => {
  const unitPrice = getNumericPrice(productItem.price);
  const itemTotal = unitPrice * productItem.quantity;

  const quantityValue = cartItem.querySelector(".quantity-value");
  const itemTotalElement = cartItem.querySelector(".item-total");

  if (quantityValue) {
    quantityValue.textContent = productItem.quantity;
  }

  if (itemTotalElement) {
    itemTotalElement.textContent = `Rs.${itemTotal}/-`;
  }

  cartItem.dataset.price = itemTotal;
};

// ---------------- SYNC MENU CARD QUANTITY ----------------
const syncMenuCardQuantity = (productId) => {
  const productInCart = cartProduct.find((item) => item.id === productId);

  const card = cardList?.querySelector(
    `.order-card[data-product-id="${productId}"]`,
  );

  if (!card) return;

  const cardQuantityValue = card.querySelector(".card-quantity-value");
  const cardMinusBtn = card.querySelector(".card-minus-btn");

  const quantity = productInCart ? productInCart.quantity : 0;

  if (cardQuantityValue) {
    cardQuantityValue.textContent = quantity;
  }

  if (cardMinusBtn) {
    cardMinusBtn.disabled = quantity === 0;
  }
};

// ---------------- CREATE CART ITEM ----------------
const createCartItem = (productItem) => {
  if (!cartList) return;

  const cartItem = document.createElement("div");
  cartItem.classList.add("item");
  cartItem.dataset.productId = String(productItem.id);

  cartItem.innerHTML = `
    <div class="item-image">
      <img src="${productItem.image}" alt="${productItem.name}">
    </div>

    <div class="detail">
      <h4>${productItem.name}</h4>
      <h4 class="item-total"></h4>
    </div>

    <div class="flex">
      <a
        href="#"
        class="quantity-btn minus"
        aria-label="Decrease ${productItem.name} quantity"
      >
        <i class="fa-solid fa-minus"></i>
      </a>

      <h4 class="quantity-value">${productItem.quantity}</h4>

      <a
        href="#"
        class="quantity-btn plus"
        aria-label="Increase ${productItem.name} quantity"
      >
        <i class="fa-solid fa-plus"></i>
      </a>
    </div>
  `;

  cartList.appendChild(cartItem);
  updateCartItemDisplay(cartItem, productItem);

  const plusBtn = cartItem.querySelector(".plus");
  const minusBtn = cartItem.querySelector(".minus");

  plusBtn?.addEventListener("click", (e) => {
    e.preventDefault();

    productItem.quantity++;

    updateCartItemDisplay(cartItem, productItem);
    updateTotals();
    syncMenuCardQuantity(productItem.id);
  });

  minusBtn?.addEventListener("click", (e) => {
    e.preventDefault();

    if (productItem.quantity > 1) {
      productItem.quantity--;

      updateCartItemDisplay(cartItem, productItem);
      updateTotals();
      syncMenuCardQuantity(productItem.id);

      return;
    }

    cartItem.classList.add("slide-out");

    setTimeout(() => {
      cartItem.remove();

      cartProduct = cartProduct.filter((item) => item.id !== productItem.id);

      updateTotals();
      syncMenuCardQuantity(productItem.id);
    }, 300);
  });
};

// ---------------- RESTORE SAVED CART DISPLAY ----------------
const restoreSavedCartDisplay = () => {
  if (!cartList) return;

  cartList.innerHTML = "";

  cartProduct.forEach((productItem) => {
    createCartItem(productItem);
  });

  updateTotals();

  cartProduct.forEach((productItem) => {
    syncMenuCardQuantity(productItem.id);
  });
};

// ---------------- ADD TO CART ----------------
const addToCart = (product, quantityToAdd = 1) => {
  const existingProduct = cartProduct.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += quantityToAdd;

    const existingCartItem = cartList?.querySelector(
      `[data-product-id="${product.id}"]`,
    );

    if (existingCartItem) {
      updateCartItemDisplay(existingCartItem, existingProduct);
    }
  } else {
    const newCartProduct = {
      ...product,
      quantity: quantityToAdd,
    };

    cartProduct.push(newCartProduct);
    createCartItem(newCartProduct);
  }

  updateTotals();
  syncMenuCardQuantity(product.id);
};

// ---------------- DECREASE PRODUCT FROM MENU CARD ----------------
const decreaseCartProduct = (product) => {
  const existingProduct = cartProduct.find((item) => item.id === product.id);

  if (!existingProduct) return;

  if (existingProduct.quantity > 1) {
    existingProduct.quantity--;

    const existingCartItem = cartList?.querySelector(
      `[data-product-id="${product.id}"]`,
    );

    if (existingCartItem) {
      updateCartItemDisplay(existingCartItem, existingProduct);
    }
  } else {
    const existingCartItem = cartList?.querySelector(
      `[data-product-id="${product.id}"]`,
    );

    existingCartItem?.remove();

    cartProduct = cartProduct.filter((item) => item.id !== product.id);
  }

  updateTotals();
  syncMenuCardQuantity(product.id);
};

// ---------------- SHOW PRODUCT CARDS ----------------
const showCards = () => {
  if (!cardList) return;

  cardList.innerHTML = "";

  productList.forEach((product) => {
    const orderCard = document.createElement("div");

    orderCard.classList.add("order-card");
    orderCard.dataset.productId = String(product.id);

    orderCard.innerHTML = `
      <div class="card-top-info">
        <span class="rating-badge">★ ${product.rating}</span>
        <span class="time-badge">${product.time}</span>
      </div>

      <div class="card-image">
        <img src="${product.image}" alt="${product.name}">
      </div>

      <h4>${product.name}</h4>

      <p class="card-desc">
        ${product.description}
      </p>

      <h4 class="price">${product.price}</h4>

      <div class="card-action-row">
        <button
          type="button"
          class="card-quantity-control card-minus-btn"
          aria-label="Decrease ${product.name} quantity"
          disabled
        >
          <i class="fa-solid fa-minus"></i>
        </button>

        <a href="#" class="btn card-btn">
          Add to Cart
        </a>

        <button
          type="button"
          class="card-quantity-control card-plus-btn"
          aria-label="Increase ${product.name} quantity"
        >
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>

      <span class="card-quantity-status">
        Qty: <strong class="card-quantity-value">0</strong>
      </span>
    `;

    cardList.appendChild(orderCard);

    const cardBtn = orderCard.querySelector(".card-btn");
    const plusBtn = orderCard.querySelector(".card-plus-btn");
    const minusBtn = orderCard.querySelector(".card-minus-btn");

    cardBtn?.addEventListener("click", (e) => {
      e.preventDefault();

      addToCart(product, 1);

      const originalText = cardBtn.innerHTML;

      cardBtn.innerHTML = `
        <i class="fa-solid fa-check"></i>
        Added
      `;

      cardBtn.classList.add("added");

      setTimeout(() => {
        cardBtn.innerHTML = originalText;
        cardBtn.classList.remove("added");
      }, 700);
    });

    plusBtn?.addEventListener("click", () => {
      addToCart(product, 1);
    });

    minusBtn?.addEventListener("click", () => {
      decreaseCartProduct(product);
    });

    syncMenuCardQuantity(product.id);
  });
};

// ---------------- MENU SLIDER ----------------
const initMenuSlider = () => {
  const track = document.querySelector(".menu-slider-track");
  const prevBtn = document.querySelector(".menu-prev");
  const nextBtn = document.querySelector(".menu-next");
  const dotsContainer = document.querySelector(".menu-slider-dots");

  if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

  let currentPage = 0;
  const visibleCards = 4;

  const getCards = () => track.querySelectorAll(".order-card");

  const getTotalPages = () => {
    return Math.ceil(getCards().length / visibleCards);
  };

  const updateDots = () => {
    const dots = dotsContainer.querySelectorAll(".menu-dot");

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentPage);
    });
  };

  const updateSlider = () => {
    const cards = getCards();

    if (!cards.length) return;

    const totalPages = getTotalPages();

    if (currentPage > totalPages - 1) {
      currentPage = Math.max(totalPages - 1, 0);
    }

    const cardWidth = cards[0].getBoundingClientRect().width;
    const trackStyle = window.getComputedStyle(track);
    const gap = parseFloat(trackStyle.columnGap || trackStyle.gap) || 0;

    const moveAmount = currentPage * visibleCards * (cardWidth + gap);

    requestAnimationFrame(() => {
      track.style.transform = `translateX(-${moveAmount}px)`;
    });

    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage >= totalPages - 1;

    updateDots();
  };

  const createDots = () => {
    dotsContainer.innerHTML = "";

    const totalPages = getTotalPages();

    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement("button");

      dot.type = "button";
      dot.classList.add("menu-dot");
      dot.setAttribute("aria-label", `Go to menu slide ${i + 1}`);

      dot.addEventListener("click", () => {
        currentPage = i;
        updateSlider();
      });

      dotsContainer.appendChild(dot);
    }
  };

  nextBtn.addEventListener("click", () => {
    if (currentPage < getTotalPages() - 1) {
      currentPage++;
      updateSlider();
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage--;
      updateSlider();
    }
  });

  window.addEventListener("resize", updateSlider);

  createDots();
  updateSlider();
};

// ---------------- NEWSLETTER FORM ----------------
const newsletterForm = document.getElementById("newsletterForm");
const emailInput = document.getElementById("email");
const newsletterMsg = document.getElementById("newsletterMsg");

const hideMessageAfterDelay = () => {
  if (!newsletterMsg) return;

  setTimeout(() => {
    newsletterMsg.classList.add("hidden");

    setTimeout(() => {
      newsletterMsg.textContent = "";
      newsletterMsg.className = "para m-auto";
    }, 500);
  }, 3000);
};

newsletterForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!emailInput || !newsletterMsg) return;

  newsletterMsg.textContent = "";
  newsletterMsg.className = "para m-auto";

  const email = emailInput.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    newsletterMsg.textContent = "❌ Please enter a valid email address.";

    newsletterMsg.classList.add("error");
    hideMessageAfterDelay();

    return;
  }

  try {
    const response = await fetch(newsletterForm.action, {
      method: "POST",
      body: new FormData(newsletterForm),
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      newsletterMsg.textContent =
        "✅ Email successfully added to the newsletter list!";

      newsletterMsg.classList.add("success");
      emailInput.value = "";
    } else {
      newsletterMsg.textContent = "⚠️ Something went wrong. Please try again.";

      newsletterMsg.classList.add("error");
    }
  } catch (error) {
    console.error("Newsletter submission error:", error);

    newsletterMsg.textContent = "⚠️ Unable to connect. Please try again later.";

    newsletterMsg.classList.add("error");
  }

  hideMessageAfterDelay();
});

// ---------------- SYNC CART BETWEEN OPEN TABS ----------------
window.addEventListener("storage", (event) => {
  if (event.key !== CART_STORAGE_KEY) return;

  loadCartFromLocalStorage();
  restoreSavedCartDisplay();

  document
    .querySelectorAll(".card-quantity-value")
    .forEach((quantityElement) => {
      quantityElement.textContent = "0";
    });

  document.querySelectorAll(".card-minus-btn").forEach((minusButton) => {
    minusButton.disabled = true;
  });

  cartProduct.forEach((productItem) => {
    syncMenuCardQuantity(productItem.id);
  });
});

// ---------------- INIT APP ----------------
const initApp = async () => {
  try {
    const response = await fetch("products.json");

    if (!response.ok) {
      throw new Error(`Unable to load products.json: ${response.status}`);
    }

    productList = await response.json();

    showCards();
    loadCartFromLocalStorage();
    restoreSavedCartDisplay();
    initMenuSlider();
  } catch (error) {
    console.error("Error loading products.json:", error);
  }
};

initApp();

// ==================================================
// CONTACT FORM
// ==================================================

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  const contactSubmitButton = contactForm.querySelector(".contact-submit-btn");

  const contactStatus = document.querySelector("#contact-form-status");
  const contactMessage = document.querySelector("#contact-message");
  const contactCharacterNumber = document.querySelector(
    "#contact-character-number",
  );

  const contactFields = {
    name: document.querySelector("#contact-name"),
    phone: document.querySelector("#contact-phone"),
    email: document.querySelector("#contact-email"),
    subject: document.querySelector("#contact-subject"),
    message: document.querySelector("#contact-message"),
    website: document.querySelector("#contact-website"),
  };

  const contactPatterns = {
    name: /^[A-Za-zÀ-ÿ\u0900-\u097F][A-Za-zÀ-ÿ\u0900-\u097F\s.'-]{1,59}$/,
    phone: /^[6-9]\d{9}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  };

  const setContactError = (field, message) => {
    const formGroup = field.closest(".contact-form-group");

    if (!formGroup) return;

    formGroup.classList.add("has-error");

    const errorElement = formGroup.querySelector(".contact-error");

    if (errorElement) {
      errorElement.textContent = message;
    }
  };

  const clearContactError = (field) => {
    const formGroup = field.closest(".contact-form-group");

    if (!formGroup) return;

    formGroup.classList.remove("has-error");

    const errorElement = formGroup.querySelector(".contact-error");

    if (errorElement) {
      errorElement.textContent = "";
    }
  };

  const validateContactField = (fieldName) => {
    const field = contactFields[fieldName];

    if (!field) return true;

    const value = field.value.trim();

    clearContactError(field);

    switch (fieldName) {
      case "name":
        if (!value) {
          setContactError(field, "Please enter your full name.");
          return false;
        }

        if (!contactPatterns.name.test(value)) {
          setContactError(field, "Please enter a valid name.");
          return false;
        }

        return true;

      case "phone": {
        const cleanedPhone = value.replace(/\D/g, "");

        if (!cleanedPhone) {
          setContactError(field, "Please enter your phone number.");
          return false;
        }

        if (!contactPatterns.phone.test(cleanedPhone)) {
          setContactError(
            field,
            "Enter a valid 10-digit Indian mobile number.",
          );
          return false;
        }

        return true;
      }

      case "email":
        if (!value) {
          setContactError(field, "Please enter your email address.");
          return false;
        }

        if (!contactPatterns.email.test(value)) {
          setContactError(field, "Please enter a valid email address.");
          return false;
        }

        return true;

      case "subject":
        if (!value) {
          setContactError(field, "Please select a subject.");
          return false;
        }

        return true;

      case "message":
        if (!value) {
          setContactError(field, "Please write your message.");
          return false;
        }

        if (value.length < 10) {
          setContactError(
            field,
            "Your message must contain at least 10 characters.",
          );
          return false;
        }

        return true;

      default:
        return true;
    }
  };

  const validateContactForm = () => {
    const fieldsToValidate = ["name", "phone", "email", "subject", "message"];

    let isValid = true;

    fieldsToValidate.forEach((fieldName) => {
      const fieldIsValid = validateContactField(fieldName);

      if (!fieldIsValid) {
        isValid = false;
      }
    });

    return isValid;
  };

  const showContactStatus = (type, message) => {
    contactStatus.className = `contact-form-status ${type}`;
    contactStatus.textContent = message;
  };

  const clearContactStatus = () => {
    contactStatus.className = "contact-form-status";
    contactStatus.textContent = "";
  };

  const setContactLoading = (isLoading) => {
    contactSubmitButton.disabled = isLoading;
    contactSubmitButton.classList.toggle("is-loading", isLoading);
  };

  Object.entries(contactFields).forEach(([fieldName, field]) => {
    if (!field || fieldName === "website") return;

    field.addEventListener("blur", () => {
      validateContactField(fieldName);
    });

    field.addEventListener("input", () => {
      if (
        field.closest(".contact-form-group")?.classList.contains("has-error")
      ) {
        validateContactField(fieldName);
      }

      clearContactStatus();
    });

    field.addEventListener("change", () => {
      validateContactField(fieldName);
      clearContactStatus();
    });
  });

  if (contactMessage && contactCharacterNumber) {
    contactMessage.addEventListener("input", () => {
      contactCharacterNumber.textContent = contactMessage.value.length;
    });
  }

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    clearContactStatus();

    if (contactFields.website.value.trim() !== "") {
      showContactStatus(
        "success",
        "Thank you. Your message has been received.",
      );

      contactForm.reset();
      contactCharacterNumber.textContent = "0";
      return;
    }

    if (!validateContactForm()) {
      const firstInvalidField = contactForm.querySelector(
        ".contact-form-group.has-error input, " +
          ".contact-form-group.has-error select, " +
          ".contact-form-group.has-error textarea",
      );

      firstInvalidField?.focus();
      return;
    }

    const contactData = {
      name: contactFields.name.value.trim(),
      phone: contactFields.phone.value.replace(/\D/g, ""),
      email: contactFields.email.value.trim().toLowerCase(),
      subject: contactFields.subject.value,
      message: contactFields.message.value.trim(),
      website: contactFields.website.value.trim(),
    };

    try {
      setContactLoading(true);

      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Your message could not be sent.");
      }

      showContactStatus(
        "success",
        "Your message has been sent successfully. The EatHub team will contact you shortly.",
      );

      contactForm.reset();
      contactCharacterNumber.textContent = "0";

      Object.values(contactFields).forEach((field) => {
        clearContactError(field);
      });
    } catch (error) {
      console.error("Contact form error:", error);

      showContactStatus(
        "error",
        error.message ||
          "Unable to send your message right now. Please try again.",
      );
    } finally {
      setContactLoading(false);
    }
  });
}

// ==================================================
// GALLERY FILTER AND LIGHTBOX
// ==================================================

const gallerySection = document.querySelector("#gallery");

if (gallerySection) {
  const galleryFilterButtons = Array.from(
    gallerySection.querySelectorAll(".gallery-filter-btn"),
  );

  const galleryItems = Array.from(
    gallerySection.querySelectorAll(".gallery-item"),
  );

  const galleryEmptyMessage = gallerySection.querySelector(
    ".gallery-empty-message",
  );

  const galleryLightbox = gallerySection.querySelector(".gallery-lightbox");

  const galleryLightboxBackdrop = gallerySection.querySelector(
    ".gallery-lightbox-backdrop",
  );

  const galleryLightboxImage = gallerySection.querySelector(
    ".gallery-lightbox-image",
  );

  const galleryLightboxCategory = gallerySection.querySelector(
    ".gallery-lightbox-category",
  );

  const galleryLightboxTitle = gallerySection.querySelector(
    ".gallery-lightbox-title",
  );

  const galleryLightboxClose = gallerySection.querySelector(
    ".gallery-lightbox-close",
  );

  const galleryLightboxPrevious = gallerySection.querySelector(
    ".gallery-lightbox-prev",
  );

  const galleryLightboxNext = gallerySection.querySelector(
    ".gallery-lightbox-next",
  );

  let visibleGalleryItems = [...galleryItems];
  let currentGalleryIndex = 0;
  let lastFocusedGalleryButton = null;

  // ---------------- GALLERY FILTER ----------------

  const filterGalleryItems = (selectedCategory) => {
    galleryItems.forEach((galleryItem) => {
      galleryItem.classList.add("is-filtering");
    });

    window.setTimeout(() => {
      galleryItems.forEach((galleryItem) => {
        const itemCategory = galleryItem.dataset.category;

        const shouldDisplay =
          selectedCategory === "all" || itemCategory === selectedCategory;

        galleryItem.classList.toggle("is-hidden", !shouldDisplay);
        galleryItem.classList.remove("is-filtering");
      });

      visibleGalleryItems = galleryItems.filter((galleryItem) => {
        return !galleryItem.classList.contains("is-hidden");
      });

      if (galleryEmptyMessage) {
        galleryEmptyMessage.classList.toggle(
          "show",
          visibleGalleryItems.length === 0,
        );
      }
    }, 180);
  };

  galleryFilterButtons.forEach((filterButton) => {
    filterButton.addEventListener("click", () => {
      galleryFilterButtons.forEach((button) => {
        button.classList.remove("active");
      });

      filterButton.classList.add("active");

      const selectedCategory = filterButton.dataset.filter || "all";

      filterGalleryItems(selectedCategory);
    });
  });

  // ---------------- LIGHTBOX CONTENT ----------------

  const updateGalleryLightbox = () => {
    const currentGalleryItem = visibleGalleryItems[currentGalleryIndex];

    if (!currentGalleryItem) return;

    const galleryImage = currentGalleryItem.querySelector("img");
    const galleryCategory = currentGalleryItem.querySelector(
      ".gallery-overlay span",
    );
    const galleryTitle = currentGalleryItem.querySelector(
      ".gallery-overlay h3",
    );

    if (galleryLightboxImage && galleryImage) {
      galleryLightboxImage.src = galleryImage.src;
      galleryLightboxImage.alt = galleryImage.alt;
    }

    if (galleryLightboxCategory) {
      galleryLightboxCategory.textContent = galleryCategory?.textContent || "";
    }

    if (galleryLightboxTitle) {
      galleryLightboxTitle.textContent = galleryTitle?.textContent || "";
    }

    const hasMultipleImages = visibleGalleryItems.length > 1;

    if (galleryLightboxPrevious) {
      galleryLightboxPrevious.style.display = hasMultipleImages
        ? "grid"
        : "none";
    }

    if (galleryLightboxNext) {
      galleryLightboxNext.style.display = hasMultipleImages ? "grid" : "none";
    }
  };

  const openGalleryLightbox = (selectedGalleryItem, triggerButton) => {
    visibleGalleryItems = galleryItems.filter((galleryItem) => {
      return !galleryItem.classList.contains("is-hidden");
    });

    currentGalleryIndex = visibleGalleryItems.indexOf(selectedGalleryItem);

    if (currentGalleryIndex < 0) {
      currentGalleryIndex = 0;
    }

    lastFocusedGalleryButton = triggerButton || null;

    updateGalleryLightbox();

    galleryLightbox?.classList.add("open");
    galleryLightbox?.setAttribute("aria-hidden", "false");

    document.body.classList.add("gallery-lightbox-active");

    window.setTimeout(() => {
      galleryLightboxClose?.focus();
    }, 50);
  };

  const closeGalleryLightbox = () => {
    galleryLightbox?.classList.remove("open");
    galleryLightbox?.setAttribute("aria-hidden", "true");

    document.body.classList.remove("gallery-lightbox-active");

    if (galleryLightboxImage) {
      galleryLightboxImage.src = "";
      galleryLightboxImage.alt = "";
    }

    lastFocusedGalleryButton?.focus();
  };

  const showPreviousGalleryImage = () => {
    if (visibleGalleryItems.length === 0) return;

    currentGalleryIndex =
      (currentGalleryIndex - 1 + visibleGalleryItems.length) %
      visibleGalleryItems.length;

    updateGalleryLightbox();
  };

  const showNextGalleryImage = () => {
    if (visibleGalleryItems.length === 0) return;

    currentGalleryIndex =
      (currentGalleryIndex + 1) % visibleGalleryItems.length;

    updateGalleryLightbox();
  };

  // ---------------- OPEN IMAGE ----------------

  galleryItems.forEach((galleryItem) => {
    const galleryViewButton = galleryItem.querySelector(".gallery-view-btn");

    galleryViewButton?.addEventListener("click", (event) => {
      event.stopPropagation();

      openGalleryLightbox(galleryItem, galleryViewButton);
    });

    galleryItem.addEventListener("click", (event) => {
      if (event.target.closest(".gallery-view-btn")) return;

      openGalleryLightbox(galleryItem, galleryViewButton);
    });
  });

  // ---------------- LIGHTBOX CONTROLS ----------------

  galleryLightboxClose?.addEventListener("click", closeGalleryLightbox);

  galleryLightboxBackdrop?.addEventListener("click", closeGalleryLightbox);

  galleryLightboxPrevious?.addEventListener("click", showPreviousGalleryImage);

  galleryLightboxNext?.addEventListener("click", showNextGalleryImage);

  // ---------------- KEYBOARD CONTROLS ----------------

  document.addEventListener("keydown", (event) => {
    const isLightboxOpen = galleryLightbox?.classList.contains("open");

    if (!isLightboxOpen) return;

    if (event.key === "Escape") {
      closeGalleryLightbox();
    }

    if (event.key === "ArrowLeft") {
      showPreviousGalleryImage();
    }

    if (event.key === "ArrowRight") {
      showNextGalleryImage();
    }

    if (event.key === "Tab") {
      const focusableElements = galleryLightbox.querySelectorAll(
        "button:not([style*='display: none'])",
      );

      const focusableArray = Array.from(focusableElements);

      if (focusableArray.length === 0) return;

      const firstFocusable = focusableArray[0];
      const lastFocusable = focusableArray[focusableArray.length - 1];

      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  });
}

// ==================================================
// HOW WE PREPARE SECTION — SCROLL ANIMATION
// ==================================================

const initializePrepareSectionAnimation = () => {
  const prepareElements = document.querySelectorAll(
    "#how-we-prepare .prepare-card, #how-we-prepare .prepare-flow",
  );

  if (!prepareElements.length) return;

  // Fallback for browsers without IntersectionObserver
  if (!("IntersectionObserver" in window)) {
    prepareElements.forEach((element) => {
      element.classList.add("prepare-visible");
    });

    return;
  }

  const prepareObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("prepare-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  prepareElements.forEach((element) => {
    prepareObserver.observe(element);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  initializePrepareSectionAnimation();
});
