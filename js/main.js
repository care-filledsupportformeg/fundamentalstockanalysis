/**
 * Main JavaScript for Fundamental Stock Analysis Website
 * 
 * This script handles:
 * - Mobile menu toggle
 * - Scroll animations
 * - Video modal functionality
 * - Smooth scrolling
 */

// DOM Elements
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const videoContainers = document.querySelectorAll('.video-container');
const videoModal = document.getElementById('video-modal');
const modalClose = document.getElementById('modal-close');
const modalVideoContainer = document.getElementById('modal-video-container');
const fadeElements = document.querySelectorAll('.fade-in');

// Mobile Menu Toggle
if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const expanded = mobileMenuButton.getAttribute('aria-expanded') === 'true' || false;
        mobileMenuButton.setAttribute('aria-expanded', !expanded);
    });
}

// Scroll Animation
function handleScrollAnimation() {
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// Video Modal Functionality
if (videoContainers.length > 0 && videoModal && modalClose && modalVideoContainer) {
    videoContainers.forEach(container => {
        container.addEventListener('click', () => {
            const videoSrc = container.getAttribute('data-src');
            const videoTitle = container.getAttribute('data-title');
            
            if (videoSrc) {
                // Create iframe
                const iframe = document.createElement('iframe');
                iframe.setAttribute('src', `${videoSrc}?autoplay=1&rel=0`);
                iframe.setAttribute('title', videoTitle || 'Video');
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
                iframe.setAttribute('allowfullscreen', '');
                
                // Clear previous content and append iframe
                modalVideoContainer.innerHTML = '';
                modalVideoContainer.appendChild(iframe);
                
                // Show modal
                videoModal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        });
    });
    
    // Close modal
    modalClose.addEventListener('click', closeVideoModal);
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.style.display === 'block') {
            closeVideoModal();
        }
    });
}

function closeVideoModal() {
    videoModal.style.display = 'none';
    modalVideoContainer.innerHTML = '';
    document.body.style.overflow = ''; // Restore scrolling
}

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if (this.getAttribute('href') !== '#') {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                }
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for navbar height
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Initialize
window.addEventListener('load', () => {
    handleScrollAnimation(); // Initial check for elements in viewport
});

window.addEventListener('scroll', () => {
    handleScrollAnimation();
});
