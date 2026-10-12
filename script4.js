// Reusable function to get an HTML element
const getElement = (id) => document.getElementById(id);

// Show one page and hide the others
const showPage = (pageId) => {
    ["registerPage", "loginPage", "dashboardPage"].forEach(id => {
        getElement(id).hidden = id !== pageId;
    });
};

// Display a message
const showMessage = (id, message, type) => {
    const element = getElement(id);
    element.textContent = message;
    element.className = type;
};

// Read saved user information
const getUser = () => {
    const data = localStorage.getItem("registeredUser");
    return data ? JSON.parse(data) : null;
};

// Validate registration information
const validateRegistration = (name, email, password, confirm) => {
    if (!name.trim() || !email.trim() || !password || !confirm) {
        return "Please fill in all fields.";
    }

    if (password.length < 6) {
        return "Password must contain at least 6 characters.";
    }

    if (password !== confirm) {
        return "Passwords do not match.";
    }

    return "";
};

// Register form
getElement("registerForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const name = getElement("regName").value.trim();
    const email = getElement("regEmail").value.trim().toLowerCase();
    const password = getElement("regPassword").value;
    const confirm = getElement("confirmPassword").value;

    const error = validateRegistration(name, email, password, confirm);

    if (error) {
        showMessage("registerMessage", error, "error");
        return;
    }

    if (getUser()) {
        showMessage(
            "registerMessage",
            "An account already exists in this browser. Please login.",
            "error"
        );
        return;
    }

    // Demo only: never store real passwords in browser storage.
    localStorage.setItem("registeredUser", JSON.stringify({
        name: name,
        email: email,
        password: password
    }));

    showMessage(
        "registerMessage",
        "Account created successfully! Please login.",
        "success"
    );

    getElement("registerForm").reset();

    setTimeout(() => showPage("loginPage"), 800);
});

// Login form
getElement("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const email = getElement("loginEmail").value.trim().toLowerCase();
    const password = getElement("loginPassword").value;

    if (!email || !password) {
        showMessage("loginMessage", "Please fill in all fields.", "error");
        return;
    }

    const user = getUser();

    if (!user || user.email !== email || user.password !== password) {
        showMessage("loginMessage", "Invalid email or password.", "error");
        return;
    }

    // Store only the session identity, not the password.
    sessionStorage.setItem("loggedIn", user.email);

    getElement("welcomeMessage").textContent = "Welcome, " + user.name + "!";
    getElement("loginForm").reset();

    showPage("dashboardPage");
});

// Navigate between Register and Login
getElement("showLogin").addEventListener("click", (event) => {
    event.preventDefault();
    showPage("loginPage");
});

getElement("showRegister").addEventListener("click", (event) => {
    event.preventDefault();
    showPage("registerPage");
});

// Logout
getElement("logoutButton").addEventListener("click", () => {
    sessionStorage.removeItem("loggedIn");
    getElement("loginForm").reset();
    showPage("loginPage");
});

// Restore the dashboard if the session exists
const restoreSession = () => {
    const user = getUser();
    const sessionEmail = sessionStorage.getItem("loggedIn");

    if (user && sessionEmail === user.email) {
        getElement("welcomeMessage").textContent =
            "Welcome, " + user.name + "!";
        showPage("dashboardPage");
    } else {
        showPage("registerPage");
    }
};

restoreSession();
