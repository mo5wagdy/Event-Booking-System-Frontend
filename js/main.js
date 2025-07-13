// Mobile menu functionality
const mobileMenuBtn = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-links') && !e.target.closest('.mobile-menu')) {
        navLinks.classList.remove('active');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return; // skip invalid selectors
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            navLinks.classList.remove('active');
        }
    });
});

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    }

    .notification.success {
        background-color: #4CAF50;
    }

    .notification.error {
        background-color: #f44336;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .event-card {
        background: white;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: var(--shadow);
        transition: var(--transition);
    }

    .event-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .event-image {
        width: 100%;
        height: 200px;
        overflow: hidden;
    }

    .event-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: var(--transition);
    }

    .event-card:hover .event-image img {
        transform: scale(1.05);
    }

    .event-details {
        padding: 1.5rem;
    }

    .event-details h3 {
        margin-bottom: 1rem;
        color: var(--text-color);
    }

    .event-date, .event-location {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        color: var(--text-color);
    }

    .event-description {
        margin: 1rem 0;
        color: #666;
        line-height: 1.5;
    }

    .event-actions {
        margin-top: 1.5rem;
    }

    .user-welcome {
        color: var(--primary-color);
        font-weight: 500;
        margin-right: 1rem;
    }

    .btn-logout {
        background-color: transparent;
        color: var(--primary-color);
        border: 2px solid var(--primary-color);
    }

    .btn-logout:hover {
        background-color: var(--primary-color);
        color: white;
    }
`;

document.head.appendChild(style);

// Add loading state to buttons
function setLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    } else {
        button.disabled = false;
        button.innerHTML = button.getAttribute('data-original-text') || 'Submit';
    }
}

// Add loading state to all buttons
document.querySelectorAll('button').forEach(button => {
    button.setAttribute('data-original-text', button.textContent);
    button.addEventListener('click', () => {
        if (button.classList.contains('btn-primary')) {
            setLoading(button, true);
            setTimeout(() => setLoading(button, false), 1000);
        }
    });
});

// Add form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    return isValid;
}

// Add error styles to inputs
const inputStyle = document.createElement('style');
inputStyle.textContent = `
    .form-group input.error {
        border-color: #f44336;
    }

    .form-group input.error:focus {
        border-color: #f44336;
        box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.2);
    }
`;

document.head.appendChild(inputStyle);

// Add form validation to all forms
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
        if (!validateForm(form)) {
            e.preventDefault();
            showNotification('Please fill in all required fields', 'error');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }
}); 