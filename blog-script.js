// Blog Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Category filtering
    const categoryBtns = document.querySelectorAll('.category-btn');
    const postCards = document.querySelectorAll('.post-card');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter posts
            postCards.forEach(card => {
                const cardCategories = card.getAttribute('data-category');
                
                if (category === 'all' || cardCategories.includes(category)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.6s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // Show all posts if search is empty
            postCards.forEach(card => {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.6s ease forwards';
            });
            return;
        }
        
        postCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const content = card.querySelector('p').textContent.toLowerCase();
            const category = card.querySelector('.post-category').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || content.includes(searchTerm) || category.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.6s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Share buttons functionality
    const shareBtns = document.querySelectorAll('.share-btn');
    
    shareBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const title = 'Check out this article from The Mushroom Agency!';
            const url = window.location.href;
            
            if (this.querySelector('.fab.fa-twitter')) {
                // Twitter share
                const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
                window.open(twitterUrl, '_blank');
            } else if (this.querySelector('.fab.fa-linkedin')) {
                // LinkedIn share
                const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                window.open(linkedinUrl, '_blank');
            } else if (this.querySelector('.fas.fa-link')) {
                // Copy link
                navigator.clipboard.writeText(url).then(() => {
                    // Show success message
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i>';
                    this.style.background = 'var(--accent-green)';
                    
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.style.background = 'var(--gray-200)';
                    }, 2000);
                });
            }
        });
    });
    
    // Load more functionality
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    let currentPosts = 6; // Initial number of posts shown
    
    // Sample additional posts data (in a real app, this would come from a database)
    const additionalPosts = [
        {
            category: 'ai',
            image: 'https://images.unsplash.com/photo-1676299251950-6d1c3c3c3c3c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            title: 'The Future of AI in Small Business: 2024 Predictions',
            excerpt: 'What AI trends will dominate small business automation this year? Our predictions and insights.',
            date: 'July 10, 2024',
            readTime: '6 min read',
            views: '1.3k',
            likes: '95'
        },
        {
            category: 'business',
            image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            title: 'Building a Digital-First Business: Lessons from Success Stories',
            excerpt: 'How successful small businesses are embracing digital transformation and automation.',
            date: 'July 8, 2024',
            readTime: '8 min read',
            views: '987',
            likes: '73'
        },
        {
            category: 'tutorials',
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            title: 'Integrating AI Tools: A Beginner\'s Guide to APIs',
            excerpt: 'Learn how to connect different AI tools and create powerful automation workflows.',
            date: 'July 6, 2024',
            readTime: '15 min read',
            views: '756',
            likes: '58'
        }
    ];
    
    loadMoreBtn.addEventListener('click', function() {
        const postsGrid = document.getElementById('postsGrid');
        
        // Add new posts
        additionalPosts.forEach((post, index) => {
            const postCard = document.createElement('article');
            postCard.className = 'post-card';
            postCard.setAttribute('data-category', post.category);
            postCard.style.animation = 'fadeInUp 0.6s ease forwards';
            postCard.style.animationDelay = `${(index + 1) * 0.1}s`;
            
            postCard.innerHTML = `
                <div class="post-image">
                    <img src="${post.image}" alt="${post.title}">
                    <div class="post-category">${getCategoryName(post.category)}</div>
                </div>
                <div class="post-content">
                    <div class="post-meta">
                        <span class="date">${post.date}</span>
                        <span class="read-time">${post.readTime}</span>
                    </div>
                    <h3>${post.title}</h3>
                    <p>${post.excerpt}</p>
                    <div class="post-footer">
                        <a href="#" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
                        <div class="post-stats">
                            <span><i class="fas fa-eye"></i> ${post.views}</span>
                            <span><i class="fas fa-heart"></i> ${post.likes}</span>
                        </div>
                    </div>
                </div>
            `;
            
            postsGrid.appendChild(postCard);
        });
        
        // Hide load more button after loading all posts
        loadMoreBtn.style.display = 'none';
    });
    
    function getCategoryName(category) {
        const categories = {
            'ai': 'AI & Automation',
            'business': 'Small Business',
            'tutorials': 'Tutorials',
            'case-studies': 'Case Studies'
        };
        return categories[category] || category;
    }
    
    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletterForm');
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        
        // Show success message
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
        submitBtn.style.background = 'var(--accent-green)';
        
        // Reset form
        this.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
        }, 3000);
        
        // In a real app, you would send this data to your server
        console.log('Newsletter subscription:', { name, email });
    });
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Mobile menu toggle (if not already handled in main script.js)
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
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
    
    // Observe all post cards
    postCards.forEach(card => {
        observer.observe(card);
    });
    
    // Add some interactive hover effects
    postCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add reading time calculation (if not already provided)
    function calculateReadingTime(text) {
        const wordsPerMinute = 200;
        const words = text.trim().split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min read`;
    }
    
    // Add view count animation
    function animateViewCount(element) {
        const currentCount = parseInt(element.textContent);
        let displayCount = 0;
        
        const timer = setInterval(() => {
            displayCount += Math.ceil(currentCount / 20);
            if (displayCount >= currentCount) {
                displayCount = currentCount;
                clearInterval(timer);
            }
            element.textContent = displayCount.toLocaleString();
        }, 50);
    }
    
    // Initialize view count animations when posts come into view
    const viewCounts = document.querySelectorAll('.post-stats .fa-eye').forEach(icon => {
        const countElement = icon.nextSibling;
        if (countElement) {
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateViewCount(countElement);
                        observer.unobserve(entry.target);
                    }
                });
            });
            observer.observe(countElement);
        }
    });
    
    console.log('Blog page loaded successfully!');
}); 