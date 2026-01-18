// Cart and Wishlist Management System
// Initialize cart and wishlist from storage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
// jaskiran kaur
// Update badge counts
function updateBadges() {
    const cartCount = document.getElementById('cartCount');
    const wishlistCount = document.getElementById('wishlistCount');
    
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
    }
}

// Add to cart function
function addToCart(id, name, price, image) {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
        showNotification('Item quantity updated in cart!');
    } else {
        const item = {
            id: id,
            name: name,
            price: price,
            image: image,
            quantity: 1
        };
        cart.push(item);
        showNotification('Added to cart successfully!');
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update badge
    updateBadges();
    
    // Update cart button visual feedback
    const productCard = document.querySelector(`[data-id="${id}"]`);
    if (productCard) {
        const cartBtn = productCard.querySelector('.cart-btn');
        if (cartBtn) cartBtn.classList.add('active');
    }
}

// Toggle wishlist function
function toggleWishlist(id, name, price, image) {
    const existingIndex = wishlist.findIndex(item => item.id === id);
    
    if (existingIndex > -1) {
        // Remove from wishlist
        wishlist.splice(existingIndex, 1);
        showNotification('Removed from wishlist');
    } else {
        // Add to wishlist
        const item = {
            id: id,
            name: name,
            price: price,
            image: image
        };
        wishlist.push(item);
        showNotification('Added to wishlist!');
    }
    
    // Save to localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    // Update badge
    updateBadges();
    
    // Update wishlist button visual feedback
    const productCard = document.querySelector(`[data-id="${id}"]`);
    if (productCard) {
        const wishlistBtn = productCard.querySelector('.wishlist-btn');
        const icon = wishlistBtn.querySelector('i');
        
        if (existingIndex > -1) {
            wishlistBtn.classList.remove('active');
            if (icon) {
                icon.classList.remove('fas');
                icon.classList.add('far');
            }
        } else {
            wishlistBtn.classList.add('active');
            if (icon) {
                icon.classList.remove('far');
                icon.classList.add('fas');
            }
        }
    }
}

// Show notification
function showNotification(message) {
    // Remove existing notification if any
    const existing = document.querySelector('.cart-notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #ff6b9d, #c44569);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .product-icons .icon-btn.active {
        background: linear-gradient(135deg, #ff6b9d, #c44569);
        color: #fff;
    }
`;
document.head.appendChild(style);

// Hero Carousel and Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize badges
    updateBadges();
    
    // Update button states based on cart/wishlist
    document.querySelectorAll('.product-card').forEach(card => {
        const id = parseInt(card.getAttribute('data-id'));
        
        if (!id) return; // Skip if no data-id attribute
        
        // Check if in cart
        const inCart = cart.some(item => item.id === id);
        if (inCart) {
            const cartBtn = card.querySelector('.cart-btn');
            if (cartBtn) cartBtn.classList.add('active');
        }
        
        // Check if in wishlist
        const inWishlist = wishlist.some(item => item.id === id);
        if (inWishlist) {
            const wishlistBtn = card.querySelector('.wishlist-btn');
            if (wishlistBtn) {
                wishlistBtn.classList.add('active');
                const icon = wishlistBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                }
            }
        }
    });

    // Carousel
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    let currentSlide = 0;
    const slideInterval = 4000;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    let autoSlide = setInterval(nextSlide, slideInterval);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            clearInterval(autoSlide);
            autoSlide = setInterval(nextSlide, slideInterval);
        });
    });

    showSlide(0);

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            }
        });
    });

    // Scroll to Top Button
    const scrollTopBtn = document.getElementById('scrollTop');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation
            const inputs = this.querySelectorAll('input, textarea, select');
            let isValid = true;
            
            inputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ff6b9d';
                } else {
                    input.style.borderColor = '#ddd';
                }
            });
            
            if (isValid) {
                showNotification('Thank you for your message! We will get back to you soon.');
                this.reset();
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }

    // Newsletter Form Submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            
            if (emailInput.value.trim() && emailInput.validity.valid) {
                showNotification('Thank you for subscribing to our newsletter!');
                this.reset();
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }

    // Category card click
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const categoryLabel = this.querySelector('.category-label');
            if (categoryLabel) {
                const categoryName = categoryLabel.textContent;
                showNotification(`Viewing ${categoryName} collection`);
            }
        });
    });

    // Explore Collection Button
    const exploreBtn = document.querySelector('.explore-btn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function() {
            const categoriesSection = document.getElementById('categories');
            if (categoriesSection) {
                categoriesSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Search functionality
    const searchButton = document.querySelector('.search-box button');
    const searchInput = document.querySelector('.search-box input');
    
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (searchInput.value.trim()) {
                showNotification(`Searching for: ${searchInput.value}`);
                // In a real application, this would trigger a search
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (this.value.trim()) {
                    showNotification(`Searching for: ${this.value}`);
                }
            }
        });
    }

    // Navbar icon clicks - these navigate to different pages
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.style.cursor = 'pointer';
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = 'cart.html';
        });
    }

    // Wishlist icon click
    const wishlistIcon = document.getElementById('wishlistIcon');
    if (wishlistIcon) {
        wishlistIcon.style.cursor = 'pointer';
        wishlistIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (wishlist.length === 0) {
                showNotification('Your wishlist is empty!');
            } else {
                showNotification(`You have ${wishlist.length} item(s) in your wishlist`);
            }
            // In future: window.location.href = 'wishlist.html';
        });
    }

    // Profile icon click
    const profileIcon = document.getElementById('profileIcon');
    if (profileIcon) {
        profileIcon.style.cursor = 'pointer';
        profileIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = 'profile.html';
        });
    }

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards and sections for animation
    const animatedElements = document.querySelectorAll('.product-card, .feature-card, .review-card, .occasion-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
            } else {
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            }
        });
    }
});
// Popup Functions
function closePopup() {
    const popup = document.getElementById('newsletterPopup');
    if (popup) {
        popup.classList.remove('active');
        localStorage.setItem('popupClosed', 'true');
    }
}

function submitPopupForm(event) {
    event.preventDefault();
    alert('Thank you for subscribing! Check your email for exclusive offers.');
    closePopup();
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('newsletterPopup');
    
    if (!popup) return;

    // Show popup on page load if not closed before
    const popupClosed = localStorage.getItem('popupClosed');
    if (!popupClosed) {
        setTimeout(function() {
            popup.classList.add('active');
        }, 1000); // Show after 1 second
    }

    // Close popup when clicking outside
    popup.addEventListener('click', function(e) {
        if (e.target === this) {
            closePopup();
        }
    });

    // Close button event listener
    const closeBtn = popup.querySelector('.popup-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closePopup);
    }
});