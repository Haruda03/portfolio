// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const skillBars = document.querySelectorAll('.skill-progress');
const contactForm = document.querySelector('.contact-form');
const profileModal = document.getElementById('profile-modal');
const profileTrigger = document.getElementById('profile-trigger');
const modalClose = document.getElementById('modal-close');

// Mobile Navigation
function initMobileNav() {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Active Navigation Link Highlighting
function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveLink() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Initial call
}

// Portfolio Filtering
function initPortfolioFilter() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.5s ease';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Skill Bars Animation
function initSkillBars() {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.getAttribute('data-width');
                
                setTimeout(() => {
                    skillBar.style.width = width;
                }, 200);
                
                observer.unobserve(skillBar);
            }
        });
    }, observerOptions);
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.hero-text, .hero-image, .about-text, .about-image, .portfolio-item, .skill-item, .timeline-item, .contact-info, .contact-form');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Navbar Background on Scroll
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(17, 24, 39, 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(17, 24, 39, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });
}

// Contact Form Handling with EmailJS
function initContactForm() {
    if (contactForm) {
        // Initialize EmailJS
        emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const userName = formData.get('user_name');
            const userEmail = formData.get('user_email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Simple validation
            if (!userName || !userEmail || !subject || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(userEmail)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = document.getElementById('submit-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-flex';
            submitBtn.disabled = true;
            
            // EmailJS template parameters
            const templateParams = {
                user_name: userName,
                user_email: userEmail,
                subject: subject,
                message: message,
                to_email: 'tamilnilavan1234@gmail.com'
            };
            
            // Send email using EmailJS
            emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                }, function(error) {
                    console.log('FAILED...', error);
                    showNotification('Failed to send message. Please try again or contact me directly.', 'error');
                })
                .finally(function() {
                    // Reset button state
                    btnText.style.display = 'inline-flex';
                    btnLoading.style.display = 'none';
                    submitBtn.disabled = false;
                });
        });
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Typing Animation for Hero Title
function initTypingAnimation() {
    const titleName = document.querySelector('.title-name');
    if (titleName) {
        const text = titleName.textContent;
        titleName.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                titleName.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing animation after a delay
        setTimeout(typeWriter, 1000);
    }
}

// Parallax Effect for Hero Background
function initParallaxEffect() {
    const orbs = document.querySelectorAll('.gradient-orb');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.1;
            orb.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
}

// Cursor Trail Effect
function initCursorTrail() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-trail';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        opacity: 0;
    `;
    
    document.body.appendChild(cursor);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.opacity = '1';
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursor.style.left = cursorX - 10 + 'px';
        cursor.style.top = cursorY - 10 + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
}

// Performance Optimization
function initPerformanceOptimizations() {
    // Lazy loading for images
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '1';
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        imageObserver.observe(img);
    });
    
    // Throttle scroll events
    let ticking = false;
    function updateOnScroll() {
        // Scroll-based animations go here
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Initialize all functionality
function init() {
    // Core functionality
    initMobileNav();
    initSmoothScrolling();
    initActiveNavLink();
    initNavbarScroll();
    
    // Animations and effects
    initScrollAnimations();
    initSkillBars();
    initTypingAnimation();
    initParallaxEffect();
    
    // Interactive features
    initPortfolioFilter();
    initContactForm();
    initProfileModal();
    
    // Performance and visual enhancements
    initCursorTrail();
    initPerformanceOptimizations();
    
    console.log('Portfolio website initialized successfully! 🚀');
}

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when page becomes visible
        document.body.style.animationPlayState = 'running';
    }
});

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalculate layouts if needed
        if (window.innerWidth <= 768) {
            // Mobile optimizations
            document.querySelectorAll('.portfolio-item').forEach(item => {
                item.style.animation = 'none';
            });
        }
    }, 250);
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Hide loading screen if exists
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
});

// Profile Modal Functionality
function initProfileModal() {
    if (!profileModal || !profileTrigger || !modalClose) return;
    
    // Open modal
    profileTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        openProfileModal();
    });
    
    // Close modal with close button
    modalClose.addEventListener('click', (e) => {
        e.preventDefault();
        closeProfileModal();
    });
    
    // Close modal when clicking outside
    profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal) {
            closeProfileModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && profileModal.classList.contains('active')) {
            closeProfileModal();
        }
    });
}

function openProfileModal() {
    profileModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Add entrance animation delay for content
    const cardContent = profileModal.querySelector('.visiting-card');
    if (cardContent) {
        cardContent.style.opacity = '0';
        cardContent.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            cardContent.style.transition = 'all 0.4s ease 0.2s';
            cardContent.style.opacity = '1';
            cardContent.style.transform = 'translateY(0)';
        }, 100);
    }
}

function closeProfileModal() {
    const cardContent = profileModal.querySelector('.visiting-card');
    
    // Add exit animation
    if (cardContent) {
        cardContent.style.transition = 'all 0.3s ease';
        cardContent.style.opacity = '0';
        cardContent.style.transform = 'translateY(20px)';
    }
    
    setTimeout(() => {
        profileModal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scrolling
        
        // Reset card content styles for next opening
        if (cardContent) {
            cardContent.style.transition = '';
            cardContent.style.opacity = '';
            cardContent.style.transform = '';
        }
    }, 300);
}

// Export functions for potential external use
window.Portfolio = {
    showNotification,
    openProfileModal,
    closeProfileModal,
    init
};
