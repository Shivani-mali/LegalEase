// Authentication JavaScript

// Login Form Handler
document.getElementById('loginForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Clear previous errors
    clearErrors();

    // Validate inputs
    if (!email || !password) {
        showError('generalError', 'Please fill in all fields');
        return;
    }

    if (!isValidEmail(email)) {
        showError('emailError', 'Please enter a valid email');
        return;
    }

    // Disable button during submission
    const btn = document.querySelector('.btn-login');
    btn.disabled = true;
    btn.textContent = 'Logging in...';

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Redirect to dashboard
            window.location.href = data.redirect;
        } else {
            showError('generalError', data.message || 'Login failed');
            btn.disabled = false;
            btn.textContent = 'Login';
        }
    } catch (error) {
        console.error('Error:', error);
        showError('generalError', 'An error occurred. Please try again.');
        btn.disabled = false;
        btn.textContent = 'Login';
    }
});

// Register Form Handler
document.getElementById('registerForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.querySelector('input[name="terms"]').checked;

    // Clear previous errors
    clearErrors();

    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
        showError('generalError', 'Please fill in all fields');
        return;
    }

    if (!isValidEmail(email)) {
        showError('emailError', 'Please enter a valid email');
        return;
    }

    if (password.length < 6) {
        showError('passwordError', 'Password must be at least 6 characters');
        return;
    }

    if (password !== confirmPassword) {
        showError('confirmPasswordError', 'Passwords do not match');
        return;
    }

    if (!terms) {
        showError('generalError', 'Please agree to the terms and conditions');
        return;
    }

    // Disable button during submission
    const btn = document.querySelector('.btn-login');
    btn.disabled = true;
    btn.textContent = 'Creating Account...';

    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, confirm_password: confirmPassword })
        });

        const data = await response.json();

        if (response.ok) {
            // Show success message and redirect
            alert('Registration successful! Please login with your credentials.');
            window.location.href = data.redirect;
        } else {
            showError('generalError', data.message || 'Registration failed');
            btn.disabled = false;
            btn.textContent = 'Create Account';
        }
    } catch (error) {
        console.error('Error:', error);
        showError('generalError', 'An error occurred. Please try again.');
        btn.disabled = false;
        btn.textContent = 'Create Account';
    }
});

// Helper Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        if (elementId === 'generalError') {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        } else {
            errorElement.textContent = message;
        }
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message, .general-error');
    errorElements.forEach(el => {
        el.textContent = '';
        el.classList.remove('show');
    });
}

// Show password toggle (basic behavior)
document.querySelectorAll('input[type="password"]').forEach(input => {
    input.addEventListener('blur', function () {
        this.type = 'password';
    });
});

// Hamburger Menu Logic
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navLinks = document.getElementById('navLinks');

    if (hamburgerMenu && navLinks) {
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
});

// Typewriter effect for feature list on auth pages
document.addEventListener('DOMContentLoaded', function () {
    const featuresList = document.querySelector('.auth-features ul');
    if (!featuresList) return;

    const features = [
        '✓ Simplified Legal Information',
        '✓ Instant Document Generation',
        '✓ Multi-language Support',
        '✓ Easy to Understand Explanations',
        '✓ Case Status Tracking'
    ];

    // Clear any existing static items so we can type them out
    featuresList.innerHTML = '';

    let featureIndex = 0;
    let charIndex = 0;
    let currentLi = null;
    const typingSpeed = 40;  // ms per character
    const lineDelay = 400;   // delay between lines

    function typeNextChar() {
        if (featureIndex >= features.length) return;

        if (!currentLi) {
            currentLi = document.createElement('li');
            featuresList.appendChild(currentLi);
        }

        const text = features[featureIndex];
        currentLi.textContent = text.slice(0, charIndex + 1);
        charIndex++;

        if (charIndex < text.length) {
            setTimeout(typeNextChar, typingSpeed);
        } else {
            featureIndex++;
            charIndex = 0;
            currentLi = null;
            setTimeout(typeNextChar, lineDelay);
        }
    }

    // Small initial delay so the page renders before typing starts
    setTimeout(typeNextChar, 500);
});
