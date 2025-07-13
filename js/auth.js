console.log('auth.js loaded');
// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Helper: Validate email format
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Helper: Show form error
function showFormError(form, message) {
    let errorDiv = form.querySelector('.form-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        form.prepend(errorDiv);
    }
    errorDiv.textContent = message;
}

// Helper: Clear form error
function clearFormError(form) {
    const errorDiv = form.querySelector('.form-error');
    if (errorDiv) errorDiv.remove();
}

// Helper: Authenticated fetch with JWT
async function authFetch(url, options = {}) {
    const token = localStorage.getItem('token');
    options.headers = options.headers || {};
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }
    return fetch(url, options);
}

// Helper: Check if JWT token is expired
function isTokenExpired(token) {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    } catch (e) {
        return true;
    }
}

// Auto-logout if token is expired
function checkTokenExpiryAndLogout() {
    const token = localStorage.getItem('token');
    if (isTokenExpired(token)) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
       // window.location.href = 'login.html';
    }
}

// Make logout globally available
window.logout = logout;

// Handle Login
const loginBtn = document.querySelector('#loginForm button[type="submit"]');
if (loginBtn) {
  loginBtn.addEventListener('click', (e) => {
    console.log('Login button clicked');
    loginForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  });
}

if (loginForm) {
    console.log('loginForm found');
    loginForm.addEventListener('submit', async (e) => {
        console.log('login submit');
        e.preventDefault();
        clearFormError(loginForm);
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        // Validation
        if (!email || !password) {
            showFormError(loginForm, 'All fields are required.');
            return;
        }
        if (!isValidEmail(email)) {
            showFormError(loginForm, 'Please enter a valid email address.');
            return;
        }
        // Password strength check (optional, for user guidance)
        if (password.length < 8) {
            showFormError(loginForm, 'Password must be at least 8 characters.');
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/api/Accounts/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ Email: email, Password: password })
            });
            if (!response.ok) {
                showFormError(loginForm, 'Invalid email or password.');
                showNotification('Login failed. Please check your credentials.', 'error');
                return;
            }
            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            showNotification('Login successful!', 'success');
            updateAuthUI();
            setTimeout(() => { window.location.href = '/index.html#events'; }, 1200);
        } catch (error) {
            showFormError(loginForm, 'Login failed. Please try again.');
            showNotification('Login failed. Please try again.', 'error');
            console.error('Login error:', error);
        }
    });
}

// Helper: Password strength validation
function isStrongPassword(password) {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
}

// Helper: Egyptian phone number validation (starts with 01, 11 digits)
function isValidEgyptianPhone(phone) {
    return /^(01)[0-9]{9}$/.test(phone) || /^\+201[0-9]{9}$/.test(phone);
}

// Handle Registration
if (registerForm) {
    console.log('registerForm found');
    registerForm.addEventListener('submit', async (e) => {
        console.log('register submit');
        e.preventDefault();
        clearFormError(registerForm);
        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const phone = document.getElementById('regPhone').value.trim();

        // Validation
        if (!name || !email || !password || !phone) {
            showFormError(registerForm, 'All fields are required.');
            return;
        }
        if (!isValidEmail(email)) {
            showFormError(registerForm, 'Please enter a valid email address.');
            return;
        }
        if (!isStrongPassword(password)) {
            showFormError(registerForm, 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
            return;
        }
        if (!isValidEgyptianPhone(phone)) {
            showFormError(registerForm, 'Please enter a valid Egyptian phone number (e.g., 010xxxxxxxx or +2010xxxxxxxx).');
            return;
        }

        try {
            const emailCheck = await fetch(`${API_BASE_URL}/api/Accounts/EmailExist?Email=${email}`);
            const emailExists = await emailCheck.json();
            if (emailExists) {
                showFormError(registerForm, 'Email already exists. Please use a different email.');
                showNotification('Email already exists. Please use a different email.', 'error');
                return;
            }
            const response = await fetch(`${API_BASE_URL}/api/Accounts/Register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ DisplayName: name, Email: email, phoneNumber: phone, Password: password })
            });
            if (!response.ok) {
                showFormError(registerForm, 'Registration failed. Please try again.');
                showNotification('Registration failed. Please try again.', 'error');
                return;
            }
            showNotification('Registration successful! Please login.', 'success');
            setTimeout(() => { window.location.href = '/index.html#events'; }, 1200);
        } catch (error) {
            showFormError(registerForm, 'Registration failed. Please try again.');
            showNotification('Registration failed. Please try again.', 'error');
            console.error('Registration error:', error);
        }
    });
}

const signupBtn = document.querySelector('#registerForm button[type="submit"]');
if (signupBtn) {
  signupBtn.addEventListener('click', (e) => {
    console.log('Sign Up button clicked');
    // Manually trigger the submit event
    registerForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  });
}

// Update UI based on authentication status
function updateAuthUI() {
    const user = JSON.parse(localStorage.getItem('user'));
    const authButtons = document.querySelector('.auth-buttons');
    const welcomeDiv = document.getElementById('welcome-message');
    const name = user?.DisplayName || user?.displayName || user?.name || '';
    if (user && authButtons) {
        authButtons.innerHTML = `
            <span class="user-welcome">Welcome, ${name}</span>
            <button class="btn btn-logout" onclick="logout()">Logout</button>
        `;
        if (welcomeDiv) {
            welcomeDiv.innerHTML = `<span class='user-welcome'>Welcome, <b>${name}</b>!</span>`;
        }
    } else {
        if (authButtons) {
            authButtons.innerHTML = `
                <a href="../pages/login.html" class="btn btn-login">Login</a>
                <a href="../pages/signup.html" class="btn btn-register">Register</a>
            `;
        }
        if (welcomeDiv) {
            welcomeDiv.innerHTML = '';
        }
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    updateAuthUI();
    showNotification('Logged out successfully', 'success');
    setTimeout(() => { window.location.href = '/index.html#events'; }, 1000);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    checkTokenExpiryAndLogout();
    updateAuthUI();
}); 