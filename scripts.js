document.addEventListener('DOMContentLoaded', () => {
    // Transparent navigation handling
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    // Show the navbar immediately if page is already scrolled on load
    if (window.scrollY > 50 && navbar) {
        navbar.classList.add('scrolled');
    }
    
    // Scroll handler for navbar
    if (navbar) {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            let scrollTop = window.scrollY;
            
            // Check for scroll direction and position
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop;
            
            // Highlight active section
            let current = '';
            const sections = document.querySelectorAll('section');
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    // Mobile menu toggle - only works when navbar is visible
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            mobileMenuBtn.innerHTML = navMenu.classList.contains('show') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }

    // Close mobile menu when clicking a link
    if (navLinks) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu) {
                    navMenu.classList.remove('show');
                    if (mobileMenuBtn) {
                        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                }
                
                // Smooth scroll to section
                const targetId = link.getAttribute('href');
                if (targetId && targetId.startsWith('#')) {
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        window.scrollTo({
                            top: targetSection.offsetTop - 70,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
    
    // Image modal functionality
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const closeBtn = document.querySelector('.close');
    const galleryImages = document.querySelectorAll('.gallery-img');
    
    // Current image index for navigation
    let currentImageIndex = 0;
    const galleryImagesArray = Array.from(galleryImages);
    
    // Add click event to all gallery images
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', (e) => {
            e.preventDefault();
            currentImageIndex = index;
            openModal(img);
        });
    });
    
    // Open modal function
    function openModal(img) {
        modal.classList.add('show');
        modalImg.src = img.src;
        
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
        
        // Add zoom animation
        modalImg.classList.add('zoom');
        setTimeout(() => {
            modalImg.classList.remove('zoom');
        }, 500);
    }
    
    // Close modal function
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
    
    // Close modal when clicking X button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside the image
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Keyboard navigation for modal
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('show')) return;
        
        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowRight' && currentImageIndex < galleryImagesArray.length - 1) {
            currentImageIndex++;
            openModal(galleryImagesArray[currentImageIndex]);
        } else if (e.key === 'ArrowLeft' && currentImageIndex > 0) {
            currentImageIndex--;
            openModal(galleryImagesArray[currentImageIndex]);
        }
    });
});
