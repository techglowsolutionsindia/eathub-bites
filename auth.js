// ==================================================
// EATHUB AUTHENTICATION — STORAGE KEYS
// ==================================================

const EATHUB_USERS_STORAGE_KEY = "eathubUsers";
const EATHUB_CURRENT_USER_STORAGE_KEY = "eathubCurrentUser";

// ==================================================
// EATHUB AUTHENTICATION — STATE
// ==================================================

let eathubAuthSuccessCallback = null;

// ==================================================
// EATHUB AUTHENTICATION — STORAGE HELPERS
// ==================================================

const getEatHubUsers = () => {
  try {
    const savedUsers = localStorage.getItem(EATHUB_USERS_STORAGE_KEY);
    const users = savedUsers ? JSON.parse(savedUsers) : [];

    return Array.isArray(users) ? users : [];
  } catch (error) {
    console.error("Unable to read EatHub users:", error);
    return [];
  }
};

const saveEatHubUsers = (users) => {
  localStorage.setItem(EATHUB_USERS_STORAGE_KEY, JSON.stringify(users));
};

const getEatHubCurrentUser = () => {
  try {
    const savedUser = localStorage.getItem(EATHUB_CURRENT_USER_STORAGE_KEY);

    return savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error("Unable to read current EatHub user:", error);
    return null;
  }
};

const saveEatHubCurrentUser = (user) => {
  const safeUser = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
  };

  localStorage.setItem(
    EATHUB_CURRENT_USER_STORAGE_KEY,
    JSON.stringify(safeUser),
  );
};

const removeEatHubCurrentUser = () => {
  localStorage.removeItem(EATHUB_CURRENT_USER_STORAGE_KEY);
};

// ==================================================
// EATHUB AUTHENTICATION — CREATE POPUP HTML
// ==================================================

const createEatHubAuthPopup = () => {
  if (document.getElementById("eathubAuthOverlay")) return;

  const authPopup = document.createElement("div");

  authPopup.id = "eathubAuthOverlay";
  authPopup.className = "auth-overlay";
  authPopup.setAttribute("aria-hidden", "true");

  authPopup.innerHTML = `
    <div
      class="auth-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="authModalTitle"
    >
      <button
        type="button"
        class="auth-close-btn"
        id="authCloseBtn"
        aria-label="Close authentication popup"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>

      <!-- Authentication Forms View -->
      <div id="authFormsView">
        <div class="auth-brand">
          <img
            src="images/food-delivery-logo.webp"
            alt="EatHub Logo"
          />
          <span>EatHub</span>
        </div>

        <div class="auth-heading">
          <h2 id="authModalTitle">Welcome Back</h2>
          <p id="authModalDescription">
            Sign in to continue ordering your favourite dishes.
          </p>
        </div>

        <div class="auth-tabs">
          <button
            type="button"
            class="auth-tab-btn active"
            data-auth-tab="signin"
          >
            Sign In
          </button>

          <button
            type="button"
            class="auth-tab-btn"
            data-auth-tab="signup"
          >
            Sign Up
          </button>
        </div>

        <div id="authMainMessage" class="auth-main-message"></div>

        <!-- Sign In Form -->
        <form id="eatHubSignInForm" class="auth-form active" novalidate>
          <div class="auth-form-group">
            <label for="signInEmail">Email Address</label>

            <div class="auth-input-wrapper">
              <i class="fa-solid fa-envelope"></i>

              <input
                type="email"
                id="signInEmail"
                placeholder="Enter your email address"
                autocomplete="email"
              />
            </div>

            <small class="auth-error-text"></small>
          </div>

          <div class="auth-form-group">
            <label for="signInPassword">Password</label>

            <div class="auth-input-wrapper">
              <i class="fa-solid fa-lock"></i>

              <input
                type="password"
                id="signInPassword"
                placeholder="Enter your password"
                autocomplete="current-password"
              />

              <button
                type="button"
                class="auth-password-toggle"
                aria-label="Show or hide password"
              >
                <i class="fa-solid fa-eye"></i>
              </button>
            </div>

            <small class="auth-error-text"></small>
          </div>

          <div class="auth-options">
            <label class="auth-checkbox">
              <input type="checkbox" id="rememberEatHubUser" />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              class="auth-forgot-btn"
              id="forgotPasswordBtn"
            >
              Forgot password?
            </button>
          </div>

          <button type="submit" class="auth-submit-btn">
            <span>Sign In</span>
            <i class="fa-solid fa-right-to-bracket"></i>
          </button>
        </form>

        <!-- Sign Up Form -->
        <form id="eatHubSignUpForm" class="auth-form" novalidate>
          <div class="auth-form-group">
            <label for="signUpFullName">Full Name</label>

            <div class="auth-input-wrapper">
              <i class="fa-solid fa-user"></i>

              <input
                type="text"
                id="signUpFullName"
                placeholder="Enter your full name"
                autocomplete="name"
              />
            </div>

            <small class="auth-error-text"></small>
          </div>

          <div class="auth-form-group">
            <label for="signUpEmail">Email Address</label>

            <div class="auth-input-wrapper">
              <i class="fa-solid fa-envelope"></i>

              <input
                type="email"
                id="signUpEmail"
                placeholder="Enter your email address"
                autocomplete="email"
              />
            </div>

            <small class="auth-error-text"></small>
          </div>

          <div class="auth-form-group">
            <label for="signUpPhone">Mobile Number</label>

            <div class="auth-input-wrapper">
              <i class="fa-solid fa-phone"></i>

              <input
                type="tel"
                id="signUpPhone"
                placeholder="Enter 10-digit mobile number"
                maxlength="10"
                autocomplete="tel"
              />
            </div>

            <small class="auth-error-text"></small>
          </div>

          <div class="auth-form-group">
            <label for="signUpPassword">Password</label>

            <div class="auth-input-wrapper">
              <i class="fa-solid fa-lock"></i>

              <input
                type="password"
                id="signUpPassword"
                placeholder="Minimum 6 characters"
                autocomplete="new-password"
              />

              <button
                type="button"
                class="auth-password-toggle"
                aria-label="Show or hide password"
              >
                <i class="fa-solid fa-eye"></i>
              </button>
            </div>

            <small class="auth-error-text"></small>
          </div>

          <div class="auth-form-group">
            <label for="signUpConfirmPassword">Confirm Password</label>

            <div class="auth-input-wrapper">
              <i class="fa-solid fa-lock"></i>

              <input
                type="password"
                id="signUpConfirmPassword"
                placeholder="Re-enter your password"
                autocomplete="new-password"
              />

              <button
                type="button"
                class="auth-password-toggle"
                aria-label="Show or hide password"
              >
                <i class="fa-solid fa-eye"></i>
              </button>
            </div>

            <small class="auth-error-text"></small>
          </div>

          <div class="auth-form-group">
            <label class="auth-checkbox">
              <input type="checkbox" id="signUpTerms" />
              <span>
                I agree to EatHub's Terms and Privacy Policy.
              </span>
            </label>

            <small class="auth-error-text"></small>
          </div>

          <button type="submit" class="auth-submit-btn">
            <span>Create Account</span>
            <i class="fa-solid fa-user-plus"></i>
          </button>
        </form>
      </div>

      <!-- Signed-In Account View -->
      <div id="authAccountView" class="auth-account-view">
        <div id="authAccountAvatar" class="auth-account-avatar">U</div>

        <h2 id="authAccountName">Customer</h2>
        <p>You are currently signed in to EatHub.</p>

        <div class="auth-account-details">
          <div class="auth-account-row">
            <i class="fa-solid fa-envelope"></i>

            <div>
              <span>Email Address</span>
              <strong id="authAccountEmail">customer@email.com</strong>
            </div>
          </div>

          <div class="auth-account-row">
            <i class="fa-solid fa-phone"></i>

            <div>
              <span>Mobile Number</span>
              <strong id="authAccountPhone">0000000000</strong>
            </div>
          </div>
        </div>

        <button type="button" id="authLogoutBtn" class="auth-logout-btn">
          <i class="fa-solid fa-right-from-bracket"></i>
          Sign Out
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(authPopup);
};

// ==================================================
// EATHUB AUTHENTICATION — DOM ELEMENT HELPERS
// ==================================================

const getAuthElements = () => {
  return {
    overlay: document.getElementById("eathubAuthOverlay"),
    closeBtn: document.getElementById("authCloseBtn"),
    formsView: document.getElementById("authFormsView"),
    accountView: document.getElementById("authAccountView"),
    heading: document.getElementById("authModalTitle"),
    description: document.getElementById("authModalDescription"),
    mainMessage: document.getElementById("authMainMessage"),
    signInForm: document.getElementById("eatHubSignInForm"),
    signUpForm: document.getElementById("eatHubSignUpForm"),
    tabButtons: document.querySelectorAll(".auth-tab-btn"),
    accountAvatar: document.getElementById("authAccountAvatar"),
    accountName: document.getElementById("authAccountName"),
    accountEmail: document.getElementById("authAccountEmail"),
    accountPhone: document.getElementById("authAccountPhone"),
    logoutBtn: document.getElementById("authLogoutBtn"),
  };
};

// ==================================================
// EATHUB AUTHENTICATION — VALIDATION HELPERS
// ==================================================

const setAuthFieldError = (field, message) => {
  const formGroup = field.closest(".auth-form-group");
  const errorText = formGroup?.querySelector(".auth-error-text");

  formGroup?.classList.add("has-error");

  if (errorText) {
    errorText.textContent = message;
  }
};

const clearAuthFieldError = (field) => {
  const formGroup = field.closest(".auth-form-group");
  const errorText = formGroup?.querySelector(".auth-error-text");

  formGroup?.classList.remove("has-error");

  if (errorText) {
    errorText.textContent = "";
  }
};

const clearAllAuthErrors = () => {
  document.querySelectorAll(".auth-form-group").forEach((group) => {
    group.classList.remove("has-error");
  });

  document.querySelectorAll(".auth-error-text").forEach((errorText) => {
    errorText.textContent = "";
  });
};

const showAuthMainMessage = (message, type = "error") => {
  const { mainMessage } = getAuthElements();

  if (!mainMessage) return;

  mainMessage.textContent = message;
  mainMessage.className = `auth-main-message show ${type}`;
};

const clearAuthMainMessage = () => {
  const { mainMessage } = getAuthElements();

  if (!mainMessage) return;

  mainMessage.textContent = "";
  mainMessage.className = "auth-main-message";
};

// ==================================================
// EATHUB AUTHENTICATION — SWITCH FORM
// ==================================================

const switchEatHubAuthTab = (tabName) => {
  const {
    heading,
    description,
    signInForm,
    signUpForm,
    tabButtons,
    formsView,
    accountView,
  } = getAuthElements();

  clearAllAuthErrors();
  clearAuthMainMessage();

  formsView?.removeAttribute("hidden");
  accountView?.classList.remove("active");

  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.authTab === tabName);
  });

  signInForm?.classList.toggle("active", tabName === "signin");
  signUpForm?.classList.toggle("active", tabName === "signup");

  if (heading) {
    heading.textContent =
      tabName === "signup" ? "Create Your Account" : "Welcome Back";
  }

  if (description) {
    description.textContent =
      tabName === "signup"
        ? "Sign up once and enjoy a faster EatHub checkout."
        : "Sign in to continue ordering your favourite dishes.";
  }
};

// ==================================================
// EATHUB AUTHENTICATION — UPDATE NAVBAR BUTTONS
// ==================================================

const updateEatHubAuthButtons = () => {
  const currentUser = getEatHubCurrentUser();
  const authTriggers = document.querySelectorAll(".auth-trigger");

  authTriggers.forEach((trigger) => {
    if (!currentUser) {
      trigger.classList.remove("auth-user-active");

      trigger.innerHTML = `
        Sign In
        <i class="fa-solid fa-right-to-bracket"></i>
      `;

      return;
    }

    const firstName = currentUser.fullName.trim().split(/\s+/)[0];
    const initial = firstName.charAt(0).toUpperCase();

    trigger.classList.add("auth-user-active");

    trigger.innerHTML = `
      <span class="auth-user-circle">${initial}</span>
      <span>${firstName}</span>
      <i class="fa-solid fa-angle-down"></i>
    `;
  });
};

// ==================================================
// EATHUB AUTHENTICATION — OPEN AND CLOSE POPUP
// ==================================================

const openEatHubAuth = (view = "signin", successCallback = null) => {
  const currentUser = getEatHubCurrentUser();
  const {
    overlay,
    formsView,
    accountView,
    accountAvatar,
    accountName,
    accountEmail,
    accountPhone,
  } = getAuthElements();

  eathubAuthSuccessCallback = successCallback;

  if (currentUser) {
    formsView?.setAttribute("hidden", "");

    accountView?.classList.add("active");

    const firstLetter = currentUser.fullName.trim().charAt(0).toUpperCase();

    if (accountAvatar) {
      accountAvatar.textContent = firstLetter || "U";
    }

    if (accountName) {
      accountName.textContent = currentUser.fullName;
    }

    if (accountEmail) {
      accountEmail.textContent = currentUser.email;
    }

    if (accountPhone) {
      accountPhone.textContent = currentUser.phone;
    }
  } else {
    formsView?.removeAttribute("hidden");
    accountView?.classList.remove("active");
    switchEatHubAuthTab(view);
  }

  overlay?.classList.add("auth-overlay-active");
  overlay?.setAttribute("aria-hidden", "false");

  document.body.classList.add("auth-modal-open");
};

const closeEatHubAuth = () => {
  const { overlay } = getAuthElements();

  overlay?.classList.remove("auth-overlay-active");
  overlay?.setAttribute("aria-hidden", "true");

  document.body.classList.remove("auth-modal-open");

  clearAllAuthErrors();
  clearAuthMainMessage();
};

// ==================================================
// EATHUB AUTHENTICATION — COMPLETE AUTH ACTION
// ==================================================

const completeEatHubAuthentication = (user) => {
  saveEatHubCurrentUser(user);
  updateEatHubAuthButtons();

  closeEatHubAuth();

  const callback = eathubAuthSuccessCallback;
  eathubAuthSuccessCallback = null;

  if (typeof callback === "function") {
    callback(user);
    return;
  }

  const searchParams = new URLSearchParams(window.location.search);

  if (searchParams.get("auth") === "required") {
    window.location.href = "checkout.html";
  }
};

// ==================================================
// EATHUB AUTHENTICATION — SIGN UP
// ==================================================

const handleEatHubSignUp = (event) => {
  event.preventDefault();

  const fullNameField = document.getElementById("signUpFullName");
  const emailField = document.getElementById("signUpEmail");
  const phoneField = document.getElementById("signUpPhone");
  const passwordField = document.getElementById("signUpPassword");
  const confirmPasswordField = document.getElementById("signUpConfirmPassword");
  const termsField = document.getElementById("signUpTerms");

  const fullName = fullNameField.value.trim();
  const email = emailField.value.trim().toLowerCase();
  const phone = phoneField.value.trim();
  const password = passwordField.value;
  const confirmPassword = confirmPasswordField.value;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[6-9]\d{9}$/;

  clearAllAuthErrors();
  clearAuthMainMessage();

  let isValid = true;

  if (fullName.length < 3) {
    setAuthFieldError(fullNameField, "Please enter your full name.");
    isValid = false;
  }

  if (!emailPattern.test(email)) {
    setAuthFieldError(emailField, "Enter a valid email address.");
    isValid = false;
  }

  if (!phonePattern.test(phone)) {
    setAuthFieldError(
      phoneField,
      "Enter a valid 10-digit Indian mobile number.",
    );

    isValid = false;
  }

  if (password.length < 6) {
    setAuthFieldError(
      passwordField,
      "Password must contain at least 6 characters.",
    );

    isValid = false;
  }

  if (confirmPassword !== password) {
    setAuthFieldError(confirmPasswordField, "Both passwords must be the same.");

    isValid = false;
  }

  if (!termsField.checked) {
    setAuthFieldError(
      termsField,
      "Please agree to the Terms and Privacy Policy.",
    );

    isValid = false;
  }

  if (!isValid) return;

  const users = getEatHubUsers();

  const emailAlreadyExists = users.some((user) => {
    return user.email.toLowerCase() === email;
  });

  if (emailAlreadyExists) {
    setAuthFieldError(
      emailField,
      "An EatHub account already exists with this email.",
    );

    return;
  }

  const phoneAlreadyExists = users.some((user) => {
    return user.phone === phone;
  });

  if (phoneAlreadyExists) {
    setAuthFieldError(
      phoneField,
      "An EatHub account already exists with this mobile number.",
    );

    return;
  }

  const newUser = {
    id: `USR${Date.now()}`,
    fullName,
    email,
    phone,

    // Demo only: real websites must never store plain passwords locally.
    password,

    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveEatHubUsers(users);

  event.currentTarget.reset();

  completeEatHubAuthentication(newUser);
};

// ==================================================
// EATHUB AUTHENTICATION — SIGN IN
// ==================================================

const handleEatHubSignIn = (event) => {
  event.preventDefault();

  const emailField = document.getElementById("signInEmail");
  const passwordField = document.getElementById("signInPassword");

  const email = emailField.value.trim().toLowerCase();
  const password = passwordField.value;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  clearAllAuthErrors();
  clearAuthMainMessage();

  let isValid = true;

  if (!emailPattern.test(email)) {
    setAuthFieldError(emailField, "Enter your registered email address.");
    isValid = false;
  }

  if (!password) {
    setAuthFieldError(passwordField, "Please enter your password.");
    isValid = false;
  }

  if (!isValid) return;

  const users = getEatHubUsers();

  const matchingUser = users.find((user) => {
    return user.email.toLowerCase() === email && user.password === password;
  });

  if (!matchingUser) {
    showAuthMainMessage("The email address or password is incorrect.", "error");

    return;
  }

  event.currentTarget.reset();

  completeEatHubAuthentication(matchingUser);
};

// ==================================================
// EATHUB AUTHENTICATION — SIGN OUT
// ==================================================

const handleEatHubLogout = () => {
  removeEatHubCurrentUser();
  updateEatHubAuthButtons();
  closeEatHubAuth();
};

// ==================================================
// EATHUB AUTHENTICATION — EVENT LISTENERS
// ==================================================

const initializeEatHubAuthEvents = () => {
  const { overlay, closeBtn, signInForm, signUpForm, tabButtons, logoutBtn } =
    getAuthElements();

  document.querySelectorAll(".auth-trigger").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openEatHubAuth("signin");
    });
  });

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      switchEatHubAuthTab(button.dataset.authTab);
    });
  });

  closeBtn?.addEventListener("click", closeEatHubAuth);

  overlay?.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeEatHubAuth();
    }
  });

  signInForm?.addEventListener("submit", handleEatHubSignIn);
  signUpForm?.addEventListener("submit", handleEatHubSignUp);
  logoutBtn?.addEventListener("click", handleEatHubLogout);

  document.querySelectorAll(".auth-password-toggle").forEach((toggleButton) => {
    toggleButton.addEventListener("click", () => {
      const passwordInput = toggleButton.parentElement.querySelector("input");

      const icon = toggleButton.querySelector("i");

      if (!passwordInput) return;

      const shouldShow = passwordInput.type === "password";

      passwordInput.type = shouldShow ? "text" : "password";

      icon?.classList.toggle("fa-eye", !shouldShow);
      icon?.classList.toggle("fa-eye-slash", shouldShow);
    });
  });

  document.querySelectorAll(".auth-form input").forEach((field) => {
    field.addEventListener("input", () => {
      clearAuthFieldError(field);
      clearAuthMainMessage();
    });
  });

  document
    .getElementById("forgotPasswordBtn")
    ?.addEventListener("click", () => {
      const emailField = document.getElementById("signInEmail");
      const email = emailField.value.trim().toLowerCase();

      if (!email) {
        setAuthFieldError(
          emailField,
          "Enter your registered email address first.",
        );

        return;
      }

      const userExists = getEatHubUsers().some((user) => {
        return user.email.toLowerCase() === email;
      });

      if (!userExists) {
        showAuthMainMessage(
          "No EatHub account was found with this email.",
          "error",
        );

        return;
      }

      showAuthMainMessage(
        "Password recovery is demonstrated successfully. Email delivery will be connected when a backend is added.",
        "success",
      );
    });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeEatHubAuth();
    }
  });
};

// ==================================================
// EATHUB AUTHENTICATION — PUBLIC METHODS
// ==================================================

window.EatHubAuth = {
  open: openEatHubAuth,
  close: closeEatHubAuth,
  getCurrentUser: getEatHubCurrentUser,
  isSignedIn: () => Boolean(getEatHubCurrentUser()),
  updateButtons: updateEatHubAuthButtons,
};

// ==================================================
// EATHUB AUTHENTICATION — INITIALIZE
// ==================================================

const initializeEatHubAuth = () => {
  createEatHubAuthPopup();
  initializeEatHubAuthEvents();
  updateEatHubAuthButtons();

  const searchParams = new URLSearchParams(window.location.search);

  if (searchParams.get("auth") === "required" && !getEatHubCurrentUser()) {
    openEatHubAuth("signin");
  }
};

initializeEatHubAuth();
