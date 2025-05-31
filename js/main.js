/**
 * Main JavaScript for Fundamental Stock Analysis Website
 * Modern, interactive, and responsive UI enhancements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    initScrollAnimations();
    initVideoLazyLoad();
    initCharts();
    initAccessibility();
    
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            if (href.length > 1 && document.querySelector(href)) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                const navbarHeight = document.querySelector('nav').offsetHeight || 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            } else if (href === "#") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
});

/**
 * Navbar functionality - mobile menu toggle, sticky behavior
 */
function initNavbar() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    // Mobile menu toggle
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('open');
            this.classList.toggle('open');
            this.setAttribute('aria-expanded', 
                this.getAttribute('aria-expanded') === 'false' ? 'true' : 'false'
            );
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target) && mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
                mobileMenuButton.classList.remove('open');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // Navbar scroll behavior
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add shadow and background opacity based on scroll position
        if (scrollTop > 10) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
        
        // Hide/show navbar on scroll up/down
        if (scrollTop > lastScrollTop && scrollTop > 300) {
            // Scrolling down & past threshold
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up or at top
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

/**
 * Scroll animations for elements
 */
function initScrollAnimations() {
    const scrollElements = document.querySelectorAll('.fade-in');
    
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
        });
    };
    
    // Throttle function to limit execution of scroll handler
    const throttle = (callback, delay) => {
        let throttleTimeout = null;
        return (...args) => {
            if (!throttleTimeout) {
                throttleTimeout = setTimeout(() => {
                    callback.apply(this, args);
                    throttleTimeout = null;
                }, delay);
            }
        };
    };
    
    // Add throttled scroll event listener
    window.addEventListener('scroll', throttle(handleScrollAnimation, 100));
    
    // Trigger on load for elements already in view
    handleScrollAnimation();
}

/**
 * Lazy load videos for better performance
 */
function initVideoLazyLoad() {
    const videoContainers = document.querySelectorAll('.video-container[data-src]');
    
    const loadVideo = (container) => {
        const iframe = document.createElement('iframe');
        iframe.src = container.dataset.src;
        iframe.title = container.dataset.title || 'YouTube video';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        
        container.appendChild(iframe);
        container.removeAttribute('data-src');
    };
    
    const handleIntersection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadVideo(entry.target);
                observer.unobserve(entry.target);
            }
        });
    };
    
    // Set up Intersection Observer
    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver(handleIntersection, {
            rootMargin: '100px 0px',
            threshold: 0.1
        });
        
        videoContainers.forEach(container => {
            videoObserver.observe(container);
        });
    } else {
        // Fallback for browsers that don't support Intersection Observer
        videoContainers.forEach(container => {
            loadVideo(container);
        });
    }
}

/**
 * Initialize interactive charts if Chart.js is available
 */
function initCharts() {
    if (typeof Chart === 'undefined') return;
    
    // Sample chart initialization - can be expanded based on actual data
    const chartElements = document.querySelectorAll('.chart-container');
    
    chartElements.forEach(container => {
        const canvas = container.querySelector('canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const chartType = container.dataset.chartType || 'line';
        const chartData = JSON.parse(container.dataset.chartData || '{}');
        
        new Chart(ctx, {
            type: chartType,
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    });
}

/**
 * Accessibility enhancements
 */
function initAccessibility() {
    // Skip to content functionality
    const skipLink = document.querySelector('.skip-to-content');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.setAttribute('tabindex', '-1');
                target.focus();
            }
        });
    }
    
    // Add appropriate ARIA attributes to interactive elements
    document.querySelectorAll('.card, .btn, .feature-card').forEach(el => {
        if (!el.getAttribute('role') && el.tagName !== 'A' && el.tagName !== 'BUTTON') {
            el.setAttribute('role', 'button');
        }
        
        if (!el.getAttribute('tabindex') && el.tagName !== 'A' && el.tagName !== 'BUTTON') {
            el.setAttribute('tabindex', '0');
        }
    });
    
    // Ensure all images have alt text
    document.querySelectorAll('img:not([alt])').forEach(img => {
        console.warn('Image missing alt text:', img);
        img.alt = ''; // Empty alt for decorative images
    });
}

/**
 * Theme toggle functionality (light/dark mode)
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use OS preference
    const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Set initial theme
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    
    // Theme toggle click handler
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            let theme = 'light';
            
            if (!document.body.classList.contains('dark-theme')) {
                document.body.classList.add('dark-theme');
                theme = 'dark';
            } else {
                document.body.classList.remove('dark-theme');
            }
            
            // Save preference to localStorage
            localStorage.setItem('theme', theme);
        });
    }
}

/**
 * Newsletter subscription form handling
 */
function initNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            const submitButton = this.querySelector('button[type="submit"]');
            const statusMessage = this.querySelector('.form-status') || document.createElement('div');
            
            if (!statusMessage.classList.contains('form-status')) {
                statusMessage.classList.add('form-status');
                this.appendChild(statusMessage);
            }
            
            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                statusMessage.textContent = 'Thank you for subscribing!';
                statusMessage.classList.add('success');
                submitButton.innerHTML = 'Subscribed!';
                
                // Reset form
                this.reset();
                
                // Reset button after delay
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Subscribe';
                    statusMessage.textContent = '';
                    statusMessage.classList.remove('success');
                }, 3000);
            }, 1500);
        });
    }
}

/**
 * Initialize interactive stock data displays
 * This would connect to actual stock data APIs in production
 */
function initStockData() {
    const stockWidgets = document.querySelectorAll('.stock-widget');
    
    stockWidgets.forEach(widget => {
        const symbol = widget.dataset.symbol;
        const type = widget.dataset.type || 'price';
        
        if (!symbol) return;
        
        // Placeholder for actual API call
        fetchStockData(symbol, type)
            .then(data => {
                updateStockWidget(widget, data);
            })
            .catch(error => {
                console.error('Error fetching stock data:', error);
                widget.innerHTML = '<p class="error">Unable to load stock data</p>';
            });
    });
}

// Placeholder function - would be replaced with actual API call
function fetchStockData(symbol, type) {
    // Simulate API response with sample data
    return new Promise((resolve) => {
        setTimeout(() => {
            const sampleData = {
                price: {
                    current: 142.56,
                    change: 1.23,
                    changePercent: 0.87
                },
                fundamentals: {
                    pe: 24.5,
                    eps: 5.82,
                    marketCap: '2.3T',
                    dividend: 0.92
                }
            };
            
            resolve(sampleData[type] || sampleData.price);
        }, 500);
    });
}

function updateStockWidget(widget, data) {
    if (data.current) {
        // Price widget
        const isPositive = data.change > 0;
        widget.innerHTML = `
            <div class="stock-price">${data.current.toFixed(2)}</div>
            <div class="stock-change ${isPositive ? 'positive' : 'negative'}">
                ${isPositive ? '+' : ''}${data.change.toFixed(2)} (${data.changePercent.toFixed(2)}%)
            </div>
        `;
    } else {
        // Fundamentals widget
        widget.innerHTML = `
            <div class="stock-fundamentals">
                <div class="fundamental-item">
                    <span class="label">P/E</span>
                    <span class="value">${data.pe}</span>
                </div>
                <div class="fundamental-item">
                    <span class="label">EPS</span>
                    <span class="value">$${data.eps}</span>
                </div>
                <div class="fundamental-item">
                    <span class="label">Market Cap</span>
                    <span class="value">${data.marketCap}</span>
                </div>
                <div class="fundamental-item">
                    <span class="label">Dividend</span>
                    <span class="value">$${data.dividend}</span>
                </div>
            </div>
        `;
    }
}
