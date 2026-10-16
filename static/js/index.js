window.HELP_IMPROVE_VIDEOJS = false;

// More Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (container && !container.contains(event.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('moreWorksDropdown');
        const button = document.querySelector('.more-works-btn');
        if (dropdown) dropdown.classList.remove('show');
        if (button) button.classList.remove('active');
    }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (!scrollButton) return;
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
    const carouselVideos = document.querySelectorAll(
        '.results-carousel:not([data-video-sync]) video, video.autoplay-in-view');
    
    if (carouselVideos.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    carouselVideos.forEach(video => {
        observer.observe(video);
    });
}


// Play only the video on the visible slide of a managed carousel.
// Slide visibility is decided geometrically (the slide's horizontal centre inside
// the carousel viewport), which stays correct with looped/cloned slides.
function syncCarouselVideos(root) {
    if (root.dataset.inView === 'false') {
        root.querySelectorAll('video').forEach(function (v) { v.pause(); });
        return;
    }
    const box = root.getBoundingClientRect();
    root.querySelectorAll('video').forEach(function (v) {
        const r = v.getBoundingClientRect();
        if (r.width === 0) { v.pause(); return; }
        const centre = r.left + r.width / 2;
        if (centre > box.left + 4 && centre < box.right - 4) {
            v.play().catch(function () { /* autoplay policy */ });
        } else {
            v.pause();
            v.currentTime = 0;
        }
    });
}

function setupManagedCarousels(instances) {
    document.querySelectorAll('[data-video-sync]').forEach(function (root) {
        const sync = function () { syncCarouselVideos(root); };

        // pause everything while the carousel is off-screen
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) {
                entries.forEach(function (e) {
                    root.dataset.inView = e.isIntersecting ? 'true' : 'false';
                    sync();
                });
            }, { threshold: 0.25 }).observe(root);
        } else {
            root.dataset.inView = 'true';
        }

        // re-sync after the slide transition settles
        (instances || []).forEach(function (inst) {
            if (inst && inst.element === root && typeof inst.on === 'function') {
                inst.on('after:show', function () { setTimeout(sync, 60); });
            }
        });
        root.addEventListener('transitionend', sync);
        window.addEventListener('resize', sync);

        setTimeout(sync, 120);
    });
}

$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
		slidesToScroll: 1,
		slidesToShow: 1,
		loop: true,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 5000,
    }

	// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
	
    bulmaSlider.attach();
    
    // Setup video autoplay for carousel
    setupVideoCarouselAutoplay();

    // The MEAD carousel is attached separately: its options must be real booleans.
    // Passing them as data-* would hand bulma-carousel the STRING "false", which is
    // truthy, and autoplay would switch itself back on.
    var managed = [];
    if (document.querySelector('#mead-carousel, #convo-carousel')) {
        managed = bulmaCarousel.attach('#mead-carousel, #convo-carousel', {
            slidesToShow: 1,
            slidesToScroll: 1,
            loop: true,
            infinite: true,
            autoplay: false
        });
    }

    // Slide-aware playback for carousels that opt in via data-video-sync
    setupManagedCarousels((carousels || []).concat(managed || []));

})
