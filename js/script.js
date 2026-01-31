// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize portfolio
    initializePortfolio();
    
    // Initialize wave text animation
    initializeWaveText();
});

function initializePortfolio() {
    console.log('Portfolio initialization started...');
    
    // Hide all content initially
    document.body.classList.add('content-hidden');
    
    // Show content after a short delay to ensure everything is ready
    setTimeout(() => {
        // Mobile Navigation Toggle
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');

        if (hamburger) {
            hamburger.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                const icon = hamburger.querySelector('i');
                if (icon.classList.contains('fa-bars')) {
                    icon.classList.replace('fa-bars', 'fa-times');
                } else {
                    icon.classList.replace('fa-times', 'fa-bars');
                }
            });
        }

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                if (hamburger) {
                    hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
                }
            });
        });

        // Theme Toggle
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;

        // Check for saved theme or prefer-color-scheme
        const savedTheme = localStorage.getItem('theme') || 'dark';
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Set initial theme
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            body.classList.add('dark-theme');
            body.classList.remove('light-theme');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
        } else {
            body.classList.add('light-theme');
            body.classList.remove('dark-theme');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
        }

        // Toggle theme
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                if (body.classList.contains('dark-theme')) {
                    body.classList.remove('dark-theme');
                    body.classList.add('light-theme');
                    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                    localStorage.setItem('theme', 'light');
                } else {
                    body.classList.remove('light-theme');
                    body.classList.add('dark-theme');
                    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                    localStorage.setItem('theme', 'dark');
                }
            });
        }

        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.getElementById('header');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Back to top button visibility
            const backToTop = document.getElementById('backToTop');
            if (backToTop) {
                if (window.scrollY > 300) {
                    backToTop.classList.add('show');
                } else {
                    backToTop.classList.remove('show');
                }
            }
        });

        // Contact form submission with Web3Forms
        const form = document.getElementById('contactForm');
        if (form) {
            const submitBtn = form.querySelector('button[type="submit"]');
            
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const formData = new FormData(form);
                const originalText = submitBtn.textContent;

                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;

                try {
                    const response = await fetch("https://api.web3forms.com/submit", {
                        method: "POST",
                        body: formData
                    });

                    const data = await response.json();

                    if (data.success) {
                        showNotification("✅ Success! Your message has been sent. I'll get back to you soon!", "success");
                        form.reset();
                    } else {
                        showNotification("❌ Error: " + data.message, "error");
                    }

                } catch (error) {
                    showNotification("⚠️ Something went wrong. Please try again.", "error");
                    console.error('Form submission error:', error);
                } finally {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            });
        }

        // Notification Function
        function showNotification(message, type) {
            const existingNotification = document.querySelector('.notification');
            if (existingNotification) {
                existingNotification.remove();
            }

            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <span>${message}</span>
                    <button class="notification-close"><i class="fas fa-times"></i></button>
                </div>
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.classList.add('show');
            }, 10);

            const closeBtn = notification.querySelector('.notification-close');
            closeBtn.addEventListener('click', () => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            });

            setTimeout(() => {
                if (notification.parentNode) {
                    notification.classList.remove('show');
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.remove();
                        }
                    }, 300);
                }
            }, 5000);
        }

        // Back to top functionality
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // Active navigation link based on scroll position
        const sections = document.querySelectorAll('section[id]');

        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            let currentSection = '';
            
            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 100;
                const sectionId = section.getAttribute('id');
                
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    currentSection = sectionId;
                }
            });
            
            // Update active class
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes(currentSection)) {
                    link.classList.add('active');
                }
            });
        });

        // Now show the content and hide the loader
        document.body.classList.remove('content-hidden');
        document.body.classList.add('content-visible');
        
        // Hide loader after content is visible
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.remove();
                }
            }, 500);
        }
        
        console.log('Portfolio loaded successfully!');
        
        // Trigger scroll event to set initial active nav link
        window.dispatchEvent(new Event('scroll'));
        
        // Add animation to project items
        const projectItems = document.querySelectorAll('.project-item');
        projectItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 300 + (index * 100));
        });
        
    }, 1000); // 1 second delay to show the loader
}

// Initialize wave text animation
function initializeWaveText() {
    const name = "Abhay Saharawat";
    const waveName = document.getElementById('waveName');
    
    if (waveName) {
        name.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.setProperty('--i', index);
            waveName.appendChild(span);
        });
    }
}

// Profile image hover effects
const profileImage = document.getElementById('profileImage');
if (profileImage) {
    profileImage.addEventListener('click', () => {
        profileImage.classList.add('animated-border');
        
        // Remove after animation completes
        setTimeout(() => {
            profileImage.classList.remove('animated-border');
        }, 2000);
    });

    // Add hover effect with delay
    let hoverTimeout;
    profileImage.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
        profileImage.classList.add('hover-active');
    });

    profileImage.addEventListener('mouseleave', () => {
        hoverTimeout = setTimeout(() => {
            profileImage.classList.remove('hover-active');
        }, 300);
    });
}

// Floating resume button visibility on scroll
window.addEventListener('scroll', function() {
    const floatingResume = document.getElementById('floatingResume');
    if (floatingResume) {
        if (window.scrollY > 300) {
            floatingResume.style.opacity = '1';
            floatingResume.style.visibility = 'visible';
            floatingResume.style.transform = 'translateY(0)';
        } else {
            floatingResume.style.opacity = '0';
            floatingResume.style.visibility = 'hidden';
            floatingResume.style.transform = 'translateY(20px)';
        }
    }
});

// Add smooth scroll to all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe all glass cards
document.querySelectorAll('.glass-card').forEach(card => {
    observer.observe(card);
});

// Simple fallback in case of errors
window.addEventListener('load', function() {
    // If portfolio isn't visible after 3 seconds, force it
    setTimeout(() => {
        const loader = document.querySelector('.loader');
        if (loader && loader.parentNode) {
            loader.classList.add('hidden');
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.remove();
                }
            }, 500);
        }
        
        document.body.classList.remove('content-hidden');
        document.body.classList.add('content-visible');
    }, 3000);
});