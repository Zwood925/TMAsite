// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.service-card, .timeline-item, .testimonial-text, .fact, .value').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Magic Mushroom functionality
    const magicMushroom = document.getElementById('magicMushroom');
    const magicModal = document.getElementById('magicModal');
    const closeModal = document.querySelector('.close-modal');
    const magicTitle = document.getElementById('magicTitle');
    const magicContent = document.getElementById('magicContent');

    // Add psychedelic mouse trail effect
    let mouseTrail = [];
    const maxTrailLength = 20;

    document.addEventListener('mousemove', function(e) {
        const trailDot = document.createElement('div');
        trailDot.className = 'mouse-trail';
        trailDot.style.left = e.pageX + 'px';
        trailDot.style.top = e.pageY + 'px';
        document.body.appendChild(trailDot);

        mouseTrail.push(trailDot);

        if (mouseTrail.length > maxTrailLength) {
            const oldDot = mouseTrail.shift();
            if (oldDot && oldDot.parentNode) {
                oldDot.parentNode.removeChild(oldDot);
            }
        }

        setTimeout(() => {
            if (trailDot.parentNode) {
                trailDot.parentNode.removeChild(trailDot);
            }
        }, 1000);
    });

    // AI tips and facts - Enhanced with more trippy content
    const magicItems = [
        {
            title: "🌈 AI Tip of the Day",
            content: "Start small! Automate one repetitive task first, then gradually expand. Small wins build momentum. Like a mushroom growing from a single spore! 🍄"
        },
        {
            title: "✨ Automation Fact",
            content: "Businesses that automate customer service see a 33% increase in customer satisfaction scores. The future is now, and it's glowing! ✨"
        },
        {
            title: "🧠 Quick Quiz",
            content: "What's the first step to AI success? A) Buy expensive software B) Start with a simple chatbot C) Hire a team of developers. Answer: B! Start simple and grow like mycelium! 🌱"
        },
        {
            title: "🍄 Mushroom Wisdom",
            content: "Like mycelium connecting trees, automation connects your business processes. The network is stronger than individual parts. We're all connected! 🌐"
        },
        {
            title: "⚡ Tech Tip",
            content: "Use AI to handle routine inquiries so your team can focus on complex customer needs. It's about augmentation, not replacement. Let the machines do the boring stuff! 🤖"
        },
        {
            title: "🎉 Success Story",
            content: "A local bakery saved 15 hours per week by automating their order confirmation system. That's time for more baking and customer service! Sweet success! 🍰"
        },
        {
            title: "🌌 Cosmic Connection",
            content: "Did you know? The internet is like mycelium - connecting everything! Your business is part of this vast digital network. Embrace the connection! 🌟"
        },
        {
            title: "🎨 Creative Automation",
            content: "AI isn't just about efficiency - it's about creativity! Free your mind from repetitive tasks and let your imagination flow like a psychedelic river! 🌊"
        },
        {
            title: "🔮 Future Vision",
            content: "Small towns are the future of tech innovation. Local businesses + AI = unstoppable growth! The revolution starts in your community! 🚀"
        },
        {
            title: "💫 Magic Moment",
            content: "You're not just learning AI - you're becoming part of a digital evolution! Every automation you build creates ripples of positive change! ✨"
        }
    ];

    magicMushroom.addEventListener('click', function() {
        const randomItem = magicItems[Math.floor(Math.random() * magicItems.length)];
        magicTitle.textContent = randomItem.title;
        magicContent.textContent = randomItem.content;
        magicModal.style.display = 'block';
        
        // Add psychedelic effect
        document.body.style.overflow = 'hidden';
        magicMushroom.style.animation = 'none';
        setTimeout(() => {
            magicMushroom.style.animation = 'float 3s ease-in-out infinite';
        }, 100);
    });

    closeModal.addEventListener('click', function() {
        magicModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close modal when clicking outside
    magicModal.addEventListener('click', function(e) {
        if (e.target === magicModal) {
            magicModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Form handling
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const phone = this.querySelector('input[type="tel"]').value;
            const message = this.querySelector('textarea').value;

            // Simple validation
            if (!name || !email || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            // Simulate form submission
            showNotification('Message sent! We\'ll get back to you soon.', 'success');
            this.reset();
        });
    }

    // Button click handlers
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const mushroomAnimation = document.querySelector('.mushroom-animation');
        const heroVideo = document.querySelector('.hero-video-bg video');
        
        if (hero && mushroomAnimation) {
            const rate = scrolled * -0.5;
            mushroomAnimation.style.transform = `translate(-50%, calc(-50% + ${rate}px))`;
        }
        
        // Parallax effect for hero video
        if (heroVideo) {
            const videoRate = scrolled * -0.3;
            heroVideo.style.transform = `translateY(${videoRate}px)`;
        }
    });

    // Video interaction effects
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        // Add click to pause/play functionality
        video.addEventListener('click', function() {
            if (this.paused) {
                this.play();
            } else {
                this.pause();
            }
        });

        // Add hover effects
        video.addEventListener('mouseenter', function() {
            this.style.filter = 'blur(0px) brightness(1) saturate(2)';
            this.style.transition = 'filter 0.5s ease';
        });

        video.addEventListener('mouseleave', function() {
            this.style.filter = '';
            this.style.transition = 'filter 0.5s ease';
        });
    });

    // Hover effects for service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Timeline animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
    });

    // Spore animation enhancement
    const spores = document.querySelectorAll('.spore');
    spores.forEach((spore, index) => {
        spore.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.5)';
            this.style.background = '#F59E0B';
        });
        
        spore.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.background = '#F59E0B';
        });
    });

    // Mushroom image interactions
    const mushroomImages = document.querySelectorAll('.floating-mushroom, .service-mushroom, .timeline-mushroom, .testimonial-mushroom, .about-mushroom, .contact-mushroom, .ai-logo, .why-logo, .contact-logo');
    
    mushroomImages.forEach((mushroom, index) => {
        // Add click effect
        mushroom.addEventListener('click', function() {
            this.style.animation = 'none';
            this.style.transform = 'scale(2) rotate(720deg)';
            this.style.filter = 'drop-shadow(0 0 50px rgba(255, 0, 128, 1)) brightness(1.5)';
            
            setTimeout(() => {
                this.style.animation = '';
                this.style.transform = '';
                this.style.filter = '';
            }, 1000);
        });

        // Add random movement on hover
        mushroom.addEventListener('mouseenter', function() {
            const randomX = (Math.random() - 0.5) * 20;
            const randomY = (Math.random() - 0.5) * 20;
            this.style.transform += ` translate(${randomX}px, ${randomY}px)`;
        });

        // Add sparkle effect
        mushroom.addEventListener('mouseenter', function() {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--gradient-trippy);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                animation: sparkle 1s ease-out forwards;
            `;
            
            const rect = this.getBoundingClientRect();
            sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
            sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 1000);
        });
    });

    // Add sparkle animation
    const sparkleStyle = document.createElement('style');
    sparkleStyle.textContent = `
        @keyframes sparkle {
            0% {
                transform: scale(0) rotate(0deg);
                opacity: 1;
            }
            50% {
                transform: scale(1) rotate(180deg);
                opacity: 1;
            }
            100% {
                transform: scale(0) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(sparkleStyle);

    // Mushroom transformation enhancement
    const mushroomTransform = document.querySelector('.mushroom-transformation');
    if (mushroomTransform) {
        mushroomTransform.addEventListener('click', function() {
            this.classList.toggle('transformed');
        });
    }

    // Mycelium animation
    const myceliumStrands = document.querySelectorAll('.mycelium-strand');
    myceliumStrands.forEach((strand, index) => {
        strand.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(90deg, #8B5CF6, #10B981, #3B82F6)';
            this.style.boxShadow = '0 0 10px rgba(139, 92, 246, 0.5)';
        });
        
        strand.addEventListener('mouseleave', function() {
            this.style.background = 'linear-gradient(135deg, #8B5CF6, #10B981)';
            this.style.boxShadow = 'none';
        });
    });
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        color: white;
        font-weight: 500;
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #10B981, #059669)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #EF4444, #DC2626)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #3B82F6, #2563EB)';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Add ripple effect styles
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .mushroom-transformation.transformed .mushroom-cap-transform {
        transform: translate(-50%, -50%) scale(0);
        opacity: 0;
    }
    
    .mushroom-transformation.transformed .lightbulb {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
    }
`;
document.head.appendChild(style);

// Performance optimization
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const mushroomAnimation = document.querySelector('.mushroom-animation');
    
    if (hero && mushroomAnimation) {
        const rate = scrolled * -0.5;
        mushroomAnimation.style.transform = `translate(-50%, calc(-50% + ${rate}px))`;
    }
    
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick);

// Form validation and security
let lastSubmissionTime = 0;
const SUBMISSION_COOLDOWN = 5000; // 5 seconds between submissions

function validateForm(event) {
    event.preventDefault();
    
    // Check for honeypot field (bot detection)
    const honeypotField = document.querySelector('input[name="website"]');
    if (honeypotField && honeypotField.value.trim() !== '') {
        console.log('Bot detected via honeypot field');
        return false;
    }
    
    // Rate limiting
    const currentTime = Date.now();
    if (currentTime - lastSubmissionTime < SUBMISSION_COOLDOWN) {
        showNotification('Please wait a few seconds before submitting again.', 'error');
        return false;
    }
    
    // Get form elements
    const form = document.getElementById('contactForm');
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const message = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Clear previous errors
    clearErrors();
    
    let isValid = true;
    
    // Validate name
    if (!name.value.trim()) {
        showError('name', 'Name is required');
        isValid = false;
    } else if (name.value.trim().length < 2) {
        showError('name', 'Name must be at least 2 characters');
        isValid = false;
    } else if (name.value.trim().length > 50) {
        showError('name', 'Name must be less than 50 characters');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(email.value.trim())) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate phone
    const phoneRegex = /^[\d\-\+\(\)\s]{10,20}$/;
    if (!phone.value.trim()) {
        showError('phone', 'Phone number is required');
        isValid = false;
    } else if (!phoneRegex.test(phone.value.trim())) {
        showError('phone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Validate message
    if (!message.value.trim()) {
        showError('message', 'Message is required');
        isValid = false;
    } else if (message.value.trim().length < 10) {
        showError('message', 'Message must be at least 10 characters');
        isValid = false;
    } else if (message.value.trim().length > 1000) {
        showError('message', 'Message must be less than 1000 characters');
        isValid = false;
    }
    
    if (!isValid) {
        showNotification('Please fix the errors above.', 'error');
        return false;
    }
    
    // Add timestamp
    document.getElementById('timestamp').value = currentTime;
    
    // Show loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-block';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual submission)
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Reset button state
        btnText.style.display = 'inline-block';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
        
        // Update last submission time
        lastSubmissionTime = currentTime;
        
        // Show success message
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        
        // Clear any remaining errors
        clearErrors();
        
        // Submit the form to the webhook
        form.submit();
        
    }, 2000);
    
    return false;
}

function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    const fieldElement = document.getElementById(fieldId);
    
    if (errorElement && fieldElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        fieldElement.style.borderColor = '#EF4444';
        fieldElement.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    const formFields = document.querySelectorAll('#contactForm input, #contactForm textarea');
    
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
    
    formFields.forEach(field => {
        field.style.borderColor = '';
        field.style.boxShadow = '';
    });
}

// Real-time validation
document.addEventListener('DOMContentLoaded', function() {
    const formFields = document.querySelectorAll('#contactForm input, #contactForm textarea');
    
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            // Clear error when user starts typing
            const errorElement = document.getElementById(this.id + 'Error');
            if (errorElement && errorElement.style.display === 'block') {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
                this.style.borderColor = '';
                this.style.boxShadow = '';
            }
        });
    });
});

function validateField(field) {
    const value = field.value.trim();
    const fieldId = field.id;
    
    switch (fieldId) {
        case 'name':
            if (value && value.length < 2) {
                showError('name', 'Name must be at least 2 characters');
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                showError('email', 'Please enter a valid email address');
            }
            break;
        case 'phone':
            const phoneRegex = /^[\d\-\+\(\)\s]{10,20}$/;
            if (value && !phoneRegex.test(value)) {
                showError('phone', 'Please enter a valid phone number');
            }
            break;
        case 'message':
            if (value && value.length < 10) {
                showError('message', 'Message must be at least 10 characters');
            }
            break;
    }
}

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // Close modal with Escape key
    if (e.key === 'Escape' && magicModal.style.display === 'block') {
        magicModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

    // Social links
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Coming Soon!!', 'info');
        });
    });

    // Add focus styles for better accessibility
    document.querySelectorAll('button, a, input, textarea').forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #8B5CF6';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    }); 