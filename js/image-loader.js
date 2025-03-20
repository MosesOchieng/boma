document.addEventListener('DOMContentLoaded', function() {
    // Lazy Loading Implementation
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => {
        imageObserver.observe(img);
        img.classList.add('lazy-load');
    });

    // Image Error Handling
    const handleImageError = (img) => {
        img.src = 'images/fallback-image.jpg'; // Create a fallback image
        img.alt = 'Image not available';
    };

    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', () => handleImageError(img));
    });
}); 