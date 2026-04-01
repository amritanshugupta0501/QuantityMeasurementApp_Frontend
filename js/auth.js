document.addEventListener("DOMContentLoaded", () => {
    updateHeaderButtons();
});

function updateHeaderButtons() {
    const token = localStorage.getItem('jwt_token');
    const btnLogin = document.getElementById('nav-login');
    const btnRegister = document.getElementById('nav-register');
    const btnHistory = document.getElementById('nav-history');
    const btnLogout = document.getElementById('nav-logout');
    if (btnLogin && btnLogout) {
        if (token) {
            btnLogin.classList.add('hidden');
            btnRegister.classList.add('hidden');
            btnHistory.classList.remove('hidden');
            btnLogout.classList.remove('hidden');
        } else {
            btnLogin.classList.remove('hidden');
            btnRegister.classList.remove('hidden');
            btnHistory.classList.add('hidden');
            btnLogout.classList.add('hidden');
        }
    }
}

function viewHistory() {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
        alert("🔒 You must be logged in to view measurement history.");
        window.location.href = 'index.html'; 
    } else {
        window.location.href = 'history.html'; 
    }
}

function showMessage(elementId, text, isError = false) {
    const el = document.getElementById(elementId);
    if(el) {
        el.innerText = text;
        el.className = isError ? "message error" : "message success";
    }
}

async function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Registered successfully! Please login.");
            window.location.href = 'index.html';
        } else {
            showMessage('auth-message', data.error || "Registration failed.", true);
        }
    } catch (error) {
        showMessage('auth-message', "Server error. Is the backend running?", true);
    }
}

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('jwt_token', data.token);
            window.location.href = 'measurements.html'; 
        } else {
            showMessage('auth-message', data.error || "Login failed.", true);
        }
    } catch (error) {
        showMessage('auth-message', "Server error. Is the backend running?", true);
    }
}

function logout() {
    localStorage.removeItem('jwt_token');
    window.location.href = 'measurements.html';
}