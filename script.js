// ===== GLOBAL VARIABLES =====
let isScrolled = false;
let currentSection = 'home';

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeAOS();
    initializeNavbar();
    initializeSmoothScrolling();
    initializeScrollProgress();
    initializeChatbot();
    initializeAnimations();
    initializeParallax();
    initializeNewsletterForm();
});

// ===== AOS INITIALIZATION =====
function initializeAOS() {
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: 100
    });
}

// ===== NAVBAR FUNCTIONALITY =====
function initializeNavbar() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Sticky navbar on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100 && !isScrolled) {
            navbar.classList.add('scrolled');
            isScrolled = true;
        } else if (window.scrollY <= 100 && isScrolled) {
            navbar.classList.remove('scrolled');
            isScrolled = false;
        }
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
    });
    
    // Active nav link highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
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
    
    // Mobile navbar toggle
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler) {
        navbarToggler.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
        });
        
        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navbarCollapse.classList.remove('show');
            });
        });
    }
}

// ===== SMOOTH SCROLLING =====
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== SCROLL PROGRESS INDICATOR =====
function initializeScrollProgress() {
    // Create scroll progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

// ===== CHATBOT FUNCTIONALITY =====
function initializeChatbot() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotMessages = document.getElementById('chatbotMessages');
    
    // Chatbot responses database
    const chatbotResponses = {
        'maldives': {
            title: 'Maldives Tour Packages',
            response: 'Our Maldives packages start from $1,500 per person for 5 days/4 nights. We offer overwater bungalows, all-inclusive resorts, and romantic honeymoon packages. Would you like me to send you our detailed Maldives brochure?'
        },
        'thailand': {
            title: 'Thailand Visa Requirements',
            response: 'For most nationalities, Thailand offers visa-free entry for up to 30 days. For longer stays, you\'ll need a tourist visa. We can help you with visa applications and provide all necessary documentation support.'
        },
        'book': {
            title: 'How to Book a Trip',
            response: 'Booking with TourCur is easy! You can call us at +1 (555) 123-4567, email us at bookings@tourcur.com, or use our online booking system. We offer flexible payment plans and 24/7 customer support.'
        },
        'package': {
            title: 'Travel Packages',
            response: 'We offer various packages including luxury tours, adventure trips, cultural experiences, and family vacations. Our packages are fully customizable and include flights, accommodation, transfers, and guided tours.'
        },
        'price': {
            title: 'Pricing Information',
            response: 'Our prices vary based on destination, duration, and accommodation type. We offer competitive rates starting from $800 for budget tours to $5,000+ for luxury experiences. Contact us for a personalized quote!'
        },
        'insurance': {
            title: 'Travel Insurance',
            response: 'We highly recommend travel insurance for all trips. Our comprehensive coverage includes medical expenses, trip cancellation, lost luggage, and emergency assistance. Premiums start from $50 per person.'
        },
        'kashmir': {
            title: 'Kashmir Tour Packages',
            response: 'Kashmir is truly "Paradise on Earth"! Our Kashmir packages start from ₹25,999 for 5 days/4 nights. We offer Dal Lake houseboat stays, Gulmarg skiing adventures, and Pahalgam valley tours. The best time to visit is March-June and September-November. Would you like our detailed Kashmir itinerary?'
        },
        'dal lake': {
            title: 'Dal Lake Experience',
            response: 'Dal Lake is the crown jewel of Kashmir! Our packages include luxury houseboat stays, romantic shikara rides, and floating market experiences. The houseboats feature traditional Kashmiri architecture with modern amenities. Prices start from ₹8,000 per night for a premium houseboat.'
        },
        'gulmarg': {
            title: 'Gulmarg Adventure',
            response: 'Gulmarg is Asia\'s premier skiing destination! Our adventure packages include skiing lessons, gondola rides to Apharwat Peak, and snow activities. The skiing season runs from December to March. We also offer summer packages with golf, trekking, and mountain biking. Adventure packages start from ₹15,000 per person.'
        },
        'pahalgam': {
            title: 'Pahalgam Valley Tour',
            response: 'Pahalgam, the "Valley of Shepherds," offers breathtaking landscapes and adventure sports. Our packages include river rafting, trekking to Betaab Valley, and visits to Aru Valley. It\'s perfect for nature lovers and adventure seekers. Valley tours start from ₹12,000 per person for 3 days.'
        },
        'srinagar': {
            title: 'Srinagar City Tour',
            response: 'Srinagar, the summer capital, offers rich culture and history. Our city tours include Mughal Gardens, Shankaracharya Temple, and local handicraft markets. We also arrange traditional Kashmiri cuisine experiences and carpet weaving demonstrations. City tours start from ₹5,000 per person.'
        }
    };
    
    // Toggle chatbot window
    chatbotToggle.addEventListener('click', function() {
        chatbotWindow.classList.add('active');
        chatbotInput.focus();
    });
    
    chatbotClose.addEventListener('click', function() {
        chatbotWindow.classList.remove('active');
    });
    
    // Send message function
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message === '') return;
        
        // Add user message
        addMessage(message, 'user');
        chatbotInput.value = '';
        
        // Simulate typing delay
        setTimeout(() => {
            const response = generateResponse(message.toLowerCase());
            addMessage(response, 'bot');
        }, 1000);
    }
    
    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.innerHTML = `<p>${text}</p>`;
        chatbotMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Generate chatbot response
    function generateResponse(message) {
        // Check for specific keywords
        for (const [keyword, data] of Object.entries(chatbotResponses)) {
            if (message.includes(keyword)) {
                return data.response;
            }
        }
        
        // Default responses
        const defaultResponses = [
            "I'd be happy to help you plan your next adventure! Could you tell me more about your travel preferences?",
            "That's a great question! Let me connect you with our travel experts. You can also call us at +1 (555) 123-4567 for immediate assistance.",
            "I can help you with destination information, booking procedures, visa requirements, and travel packages. What specific information do you need?",
            "For the most accurate and up-to-date information, I recommend speaking with our travel specialists. Would you like me to arrange a callback?"
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
    
    // Event listeners
    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Close chatbot when clicking outside
    document.addEventListener('click', function(e) {
        if (!chatbotWindow.contains(e.target) && !chatbotToggle.contains(e.target)) {
            chatbotWindow.classList.remove('active');
        }
    });
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Animate stats on scroll
    const stats = document.querySelectorAll('.stat-item h3');
    const animateStats = () => {
        stats.forEach(stat => {
            const statTop = stat.getBoundingClientRect().top;
            const statBottom = stat.getBoundingClientRect().bottom;
            
            if (statTop < window.innerHeight && statBottom > 0) {
                const target = parseInt(stat.textContent);
                animateNumber(stat, 0, target, 2000);
            }
        });
    };
    
    window.addEventListener('scroll', animateStats);
    
    // Number animation function
    function animateNumber(element, start, end, duration) {
        if (element.dataset.animated) return;
        element.dataset.animated = 'true';
        
        const startTime = performance.now();
        const originalText = element.textContent;
        
        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (end - start) * progress);
            element.textContent = current + originalText.replace(/\d+/g, '');
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        }
        
        requestAnimationFrame(updateNumber);
    }
    
    // Hover effects for destination cards
    const destinationCards = document.querySelectorAll('.destination-card');
    destinationCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Service card animations
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) rotateY(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateY(0deg)';
        });
    });
}

// ===== PARALLAX EFFECTS =====
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const rate = scrolled * -0.5;
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// ===== NEWSLETTER FORM =====
function initializeNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                // Simulate form submission
                const button = this.querySelector('button');
                const originalText = button.innerHTML;
                
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                button.disabled = true;
                
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-check"></i>';
                    this.querySelector('input[type="email"]').value = '';
                    
                    setTimeout(() => {
                        button.innerHTML = originalText;
                        button.disabled = false;
                    }, 2000);
                }, 1500);
                
                // Show success message
                showNotification('Thank you for subscribing to our newsletter!', 'success');
            }
        });
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// ===== LAZY LOADING FOR IMAGES =====
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== PERFORMANCE OPTIMIZATION =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll events
const optimizedScrollHandler = debounce(function() {
    // Scroll-based animations and updates
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// ===== UTILITY FUNCTIONS =====
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You can add error reporting logic here
});

// ===== PAGE LOAD OPTIMIZATION =====
window.addEventListener('load', function() {
    // Remove loading states
    document.body.classList.add('loaded');
    
    // Initialize lazy loading
    initializeLazyLoading();
    
    // Preload critical resources
    const criticalImages = [
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// ===== MOBILE OPTIMIZATIONS =====
function initializeMobileOptimizations() {
    // Disable hover effects on touch devices
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
    
    // Optimize for mobile performance
    if (window.innerWidth <= 768) {
        // Reduce animation complexity on mobile
        document.body.classList.add('mobile-optimized');
    }
}

// Initialize mobile optimizations
initializeMobileOptimizations();

// ===== ACCESSIBILITY IMPROVEMENTS =====
function initializeAccessibility() {
    // Add keyboard navigation for chatbot
    const chatbotToggle = document.getElementById('chatbotToggle');
    if (chatbotToggle) {
        chatbotToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
    
    // Add focus indicators
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--secondary-color)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
}

// Initialize accessibility features
initializeAccessibility();

// ===== READ MORE DESTINATIONS =====
function initializeReadMore() {
    const readMoreBtn = document.getElementById('readMoreBtn');
    const hiddenDestination = document.querySelector('.hidden-destination');
    
    if (readMoreBtn && hiddenDestination) {
        readMoreBtn.addEventListener('click', function() {
            // Show the hidden destination with smooth animation
            hiddenDestination.style.display = 'block';
            hiddenDestination.style.opacity = '0';
            hiddenDestination.style.transform = 'translateY(20px)';
            
            // Trigger AOS animation
            AOS.refresh();
            
            // Smooth fade in animation
            setTimeout(() => {
                hiddenDestination.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                hiddenDestination.style.opacity = '1';
                hiddenDestination.style.transform = 'translateY(0)';
            }, 100);
            
            // Hide the button after showing the destination
            setTimeout(() => {
                readMoreBtn.style.opacity = '0';
                readMoreBtn.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    readMoreBtn.style.display = 'none';
                }, 300);
            }, 800);
            
            // Update button text temporarily
            const originalText = readMoreBtn.innerHTML;
            readMoreBtn.innerHTML = '<i class="fas fa-check-circle me-2"></i>Destination Added!';
            readMoreBtn.classList.remove('btn-primary');
            readMoreBtn.classList.add('btn-success');
        });
    }
}

// Initialize read more functionality
initializeReadMore();

// ===== KASHMIR READ MORE DESTINATIONS =====
function initializeKashmirReadMore() {
    const readMoreKashmirBtn = document.getElementById('readMoreKashmirBtn');
    const hiddenKashmirDestination = document.querySelector('.hidden-kashmir-destination');
    
    if (readMoreKashmirBtn && hiddenKashmirDestination) {
        readMoreKashmirBtn.addEventListener('click', function() {
            // Show the hidden destination with smooth animation
            hiddenKashmirDestination.style.display = 'block';
            hiddenKashmirDestination.style.opacity = '0';
            hiddenKashmirDestination.style.transform = 'translateY(20px)';
            
            // Trigger AOS animation
            AOS.refresh();
            
            // Smooth fade in animation
            setTimeout(() => {
                hiddenKashmirDestination.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                hiddenKashmirDestination.style.opacity = '1';
                hiddenKashmirDestination.style.transform = 'translateY(0)';
            }, 100);
            
            // Hide the button after showing the destination
            setTimeout(() => {
                readMoreKashmirBtn.style.opacity = '0';
                readMoreKashmirBtn.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    readMoreKashmirBtn.style.display = 'none';
                }, 300);
            }, 800);
            
            // Update button text temporarily
            const originalText = readMoreKashmirBtn.innerHTML;
            readMoreKashmirBtn.innerHTML = '<i class="fas fa-check-circle me-2"></i>Place Added!';
            readMoreKashmirBtn.classList.remove('btn-outline-primary');
            readMoreKashmirBtn.classList.add('btn-success');
        });
    }
}

// Initialize Kashmir read more functionality
initializeKashmirReadMore(); 