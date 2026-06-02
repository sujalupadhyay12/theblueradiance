// ====================================
// MAIN JAVASCRIPT FUNCTIONALITY
// ====================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    initializeNavigation();
    initializeStatistics();
    initializeFormHandler();
    handleScrollEffects();
    detectNavbarScroll();
    initializeContactCardPopup();
}

// ====================================
// LOADER FUNCTIONALITY
// ====================================


// ====================================
// NAVIGATION FUNCTIONALITY
// ====================================

function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
        });
    });

    updateActiveNavLink();
}

function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// ====================================
// SCROLL ANIMATIONS
// ====================================

function handleScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatableElements = document.querySelectorAll(
        '.feature-card, .service-card, .stat-card, .value-card, .vm-card, .info-card'
    );
    animatableElements.forEach(el => observer.observe(el));
}

// ====================================
// STATISTICS COUNTER ANIMATION
// ====================================

function initializeStatistics() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const dataAttr = entry.target.getAttribute('data-target');
                const target = dataAttr ? parseInt(dataAttr, 10) : NaN;
                if (Number.isNaN(target)) {
                    // Not a numeric counter (e.g., icon cards). Mark as handled and skip animation.
                    entry.target.classList.add('counted');
                    observer.unobserve(entry.target);
                    return;
                }

                animateCount(entry.target, target);
                entry.target.classList.add('counted');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(el => observer.observe(el));
}

function animateCount(element, target) {
    let current = 0;
    const increment = target / 30;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 50);
}

// ====================================
// FORM HANDLER
// ====================================

function initializeFormHandler() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const name = form.querySelector('#name').value;
    const email = form.querySelector('#email').value;
    const service = form.querySelector('#service').value;
    const message = form.querySelector('#message').value;

    if (!name || !email || !service || !message) {
        alert('Please fill in all required fields');
        return;
    }

    if (!isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }

    const successMessage = document.getElementById('successMessage');
    form.style.display = 'none';
    successMessage.style.display = 'block';

    console.log({
        name: name,
        company: form.querySelector('#company').value,
        email: email,
        phone: form.querySelector('#phone').value,
        service: service,
        message: message,
        timestamp: new Date().toISOString()
    });

    setTimeout(() => {
        form.reset();
        form.style.display = 'block';
        successMessage.style.display = 'none';
    }, 5000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ====================================
// NAVBAR SCROLL DETECTION
// ====================================

function detectNavbarScroll() {
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ====================================
// SMOOTH SCROLL UTILITY
// ====================================

document.addEventListener('click', function(e) {
    const target = e.target.closest('a[href^="#"]');
    if (!target) return;

    e.preventDefault();
    const href = target.getAttribute('href');
    const element = document.querySelector(href);

    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
});

// ====================================
// EXTERNAL LINK HANDLING
// ====================================

document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="http"]');
    links.forEach(link => {
        if (!link.hostname.includes(window.location.hostname)) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        }
    });
});

// ====================================
// DIGITAL CONTACT CARD FUNCTIONS
// ====================================

function openCardPopup() {
    const popup = document.getElementById('cardPopup');
    const popupContent = document.querySelector('.popup-content');
    
    // Create or update the vCard download link
    const vcardData = generateVCard();
    const vcardBlob = new Blob([vcardData], { type: 'text/vcard' });
    const vcardUrl = URL.createObjectURL(vcardBlob);
    
    // Add download button to popup
    popupContent.innerHTML = `
        <button class="close-popup" onclick="closeCardPopup()">×</button>
        <div style="padding: 40px; text-align: center;">
            <h3 style="color: #0d1d3b; margin-bottom: 20px; font-size: 1.5rem;">Digital Contact Card</h3>
            <p style="color: #555; margin-bottom: 25px; line-height: 1.6;">
                <strong>Name:</strong> Sujal Upadhyay<br>
                <strong>Position:</strong> IT Head<br>
                <strong>Company:</strong> Blue Radiance Marine Company<br>
                <strong>Email:</strong> ithead@theblueradiance.com<br>
                <strong>Website:</strong> https://theblueradiance.com
            </p>
            <a href="${vcardUrl}" download="Sujal_Upadhyay.vcf" 
                style="display: inline-block; padding: 12px 28px; background: #0066ff; color: white; 
                text-decoration: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.3s;"
                onmouseover="this.style.background='#0051cc'"
                onmouseout="this.style.background='#0066ff'">
                📥 Download vCard
            </a>
        </div>
    `;
    
    popup.style.display = 'flex';
}

function closeCardPopup() {
    const popup = document.getElementById('cardPopup');
    popup.style.display = 'none';
}

function generateVCard() {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Sujal Upadhyay
N:Upadhyay;Sujal;;;
TITLE:IT Head
ORG:Blue Radiance Marine Company
EMAIL:ithead@theblueradiance.com
URL:https://theblueradiance.com
END:VCARD`;
    return vcard;
}

function initializeContactCardPopup() {
    const cardPopup = document.getElementById('cardPopup');
    if (cardPopup) {
        cardPopup.addEventListener('click', function(e) {
            if (e.target === cardPopup) {
                closeCardPopup();
            }
        });
    }
}

console.log('The Blue Radiance website loaded successfully!');
