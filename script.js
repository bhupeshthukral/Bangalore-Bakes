// Main JavaScript for Bangalore Bakes

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
        });
    }
    
    // Cart Sidebar Toggle
    const cartIcon = document.getElementById('cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCart = document.getElementById('close-cart');
    
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            cartSidebar.classList.add('active');
        });
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', function() {
            cartSidebar.classList.remove('active');
        });
    }
    
    // Click outside to close cart
    document.addEventListener('click', function(e) {
        if (cartSidebar && cartSidebar.classList.contains('active') && 
            !cartSidebar.contains(e.target) && e.target !== cartIcon) {
            cartSidebar.classList.remove('active');
        }
    });
    
    // Product Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filter products
            productCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Scroll to Top Button
    const scrollTopBtn = document.getElementById('scroll-top');
    
    window.addEventListener('scroll', function() {
        if (scrollTopBtn) {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('active');
            } else {
                scrollTopBtn.classList.remove('active');
            }
        }
    });
    
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Shopping Cart Functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItems = document.querySelector('.cart-items');
    const totalAmount = document.querySelector('.total-amount');
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart UI
    function updateCartUI() {
        if (!cartItems) return;
        
        cartItems.innerHTML = '';
        let total = 0;
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        } else {
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');
                cartItemElement.innerHTML = `
                    <img src="${item.image || 'https://via.placeholder.com/70x70'}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <p class="cart-item-price">₹${item.price}</p>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus-btn" data-index="${index}">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-index="${index}">
                            <button class="quantity-btn plus-btn" data-index="${index}">+</button>
                        </div>
                    </div>
                    <div class="cart-item-remove" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </div>
                `;
                
                cartItems.appendChild(cartItemElement);
            });
        }
        
        if (totalAmount) {
            totalAmount.textContent = `₹${total.toFixed(2)}`;
        }
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Add event listeners to quantity buttons and remove buttons
        const minusButtons = document.querySelectorAll('.minus-btn');
        const plusButtons = document.querySelectorAll('.plus-btn');
        const quantityInputs = document.querySelectorAll('.quantity-input');
        const removeButtons = document.querySelectorAll('.cart-item-remove');
        
        minusButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                    updateCartUI();
                }
            });
        });
        
        plusButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                cart[index].quantity++;
                updateCartUI();
            });
        });
        
        quantityInputs.forEach(input => {
            input.addEventListener('change', function() {
                const index = this.getAttribute('data-index');
                const value = parseInt(this.value);
                if (!isNaN(value) && value >= 1) {
                    cart[index].quantity = value;
                    updateCartUI();
                }
            });
        });
        
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                cart.splice(index, 1);
                updateCartUI();
            });
        });
    }
    
    // Add item to cart
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            const image = this.closest('.product-card').querySelector('.product-image img').src;
            
            // Check if item already exists in cart
            const existingItemIndex = cart.findIndex(item => item.id === id);
            
            if (existingItemIndex !== -1) {
                cart[existingItemIndex].quantity++;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    image,
                    quantity: 1
                });
            }
            
            // Show notification
            const notification = document.createElement('div');
            notification.classList.add('notification');
            notification.innerHTML = `<p>"${name}" added to cart!</p>`;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('show');
                
                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => {
                        document.body.removeChild(notification);
                    }, 300);
                }, 2000);
            }, 100);
            
            updateCartUI();
            cartSidebar.classList.add('active');
        });
    });
    
    // Initialize cart UI
    updateCartUI();
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                // Show notification
                const notification = document.createElement('div');
                notification.classList.add('notification');
                notification.innerHTML = `<p>Thank you for subscribing!</p>`;
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.classList.add('show');
                    
                    setTimeout(() => {
                        notification.classList.remove('show');
                        setTimeout(() => {
                            document.body.removeChild(notification);
                        }, 300);
                    }, 2000);
                }, 100);
                
                this.reset();
            }
        });
    }
    
    // Contact form submission
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show notification
            const notification = document.createElement('div');
            notification.classList.add('notification');
            notification.innerHTML = `<p>Thank you for your message! We'll get back to you soon.</p>`;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('show');
                
                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => {
                        document.body.removeChild(notification);
                    }, 300);
                }, 2000);
            }, 100);
            
            this.reset();
        });
    }
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--primary);
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            opacity: 0;
            transform: translateY(-20px);
            transition: opacity 0.3s, transform 0.3s;
            z-index: 1000;
        }
        
        .notification.show {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
});
