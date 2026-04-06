/* capyside/js/main.js */

document.addEventListener('DOMContentLoaded', () => {

    /* --- TRANSLATION LOGIC --- */
    const langBtns = document.querySelectorAll('.lang-btn');
    const defaultLang = 'en';

    function setLanguage(lang) {
        if (!translations[lang]) return;
        localStorage.setItem('capyside-lang', lang);

        // Update DOM elements
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const val = translations[lang][key];
            if (val) {
                el.innerHTML = val;
            }
        });

        // Update Button toggle — show current language, and set tooltip to full name
        const fullName = lang === 'en' ? 'English' : 'Español';
        const abbr = lang === 'en' ? 'EN' : 'ES';
        langBtns.forEach(btn => {
            btn.textContent = abbr;
            btn.setAttribute('data-label', fullName);
        });
    }

    // Init language
    const savedLang = localStorage.getItem('capyside-lang') || defaultLang;
    setLanguage(savedLang);

    // Build a shared dropdown element
    const langDropdown = document.createElement('div');
    langDropdown.className = 'lang-dropdown';
    langDropdown.innerHTML = `
        <button class="lang-option" data-lang="en">English</button>
        <button class="lang-option" data-lang="es">Español</button>
    `;
    document.body.appendChild(langDropdown);

    let activeBtn = null;

    function closeLangDropdown() {
        langDropdown.classList.remove('open');
        activeBtn = null;
    }

    langDropdown.querySelectorAll('.lang-option').forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.stopPropagation();
            setLanguage(opt.dataset.lang);
            closeLangDropdown();
        });
    });

    langBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const isMobile = window.innerWidth <= 1024;

            if (isMobile) {
                e.stopPropagation();
                if (langDropdown.classList.contains('open') && activeBtn === btn) {
                    // Toggle off if same button
                    closeLangDropdown();
                } else {
                    // Position dropdown below this button
                    const rect = btn.getBoundingClientRect();
                    langDropdown.style.top = (rect.bottom + window.scrollY + 6) + 'px';
                    langDropdown.style.left = rect.left + 'px';
                    langDropdown.classList.add('open');
                    activeBtn = btn;
                }
            } else {
                // Desktop: single click switches immediately
                const currentLang = localStorage.getItem('capyside-lang') || defaultLang;
                const newLang = currentLang === 'en' ? 'es' : 'en';
                setLanguage(newLang);
            }
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', closeLangDropdown);

    /* --- NAVBAR & SCROLL MENU --- */
    const navbar = document.getElementById('navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-actions .btn:not(.lang-btn)');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    /* --- GSAP HERO TRAILS ANIMATION --- */
    gsap.utils.toArray('.hero-trail path').forEach(path => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
            strokeDashoffset: 0,
            duration: 8,
            ease: "power1.inOut",
            repeat: -1,
            yoyo: true
        });
    });

    /* --- GSAP SCROLL REVEALS --- */
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('[data-animate="fade-up"]').forEach(el => {
        const delay = parseFloat(el.style.transitionDelay) || 0;
        gsap.fromTo(el,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: delay,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    gsap.utils.toArray('[data-animate="fade-in"]').forEach(el => {
        const delay = parseFloat(el.style.transitionDelay) || 0;
        gsap.fromTo(el,
            { opacity: 0 },
            {
                opacity: 1,
                duration: 1,
                delay: delay,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    /* --- WHY US ACCORDION (MOBILE) --- */
    const whyItems = document.querySelectorAll('.why-item');
    if (window.innerWidth < 600) {
        whyItems.forEach(item => {
            item.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                // Close all
                whyItems.forEach(i => i.classList.remove('active'));

                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    /* --- SWIPER CAROUSEL --- */
    const track = document.getElementById('carouselTrack');
    const customImages = [
        'images/Branding_00.webp',
        'images/dashboardUI_00.webp',
        'images/fintechappUI_00.webp',
        'images/saaslanding_00.webp'
    ];
    const totalImages = 7;

    for (let i = 1; i <= totalImages; i++) {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide carousel-slide';
        const src = i <= customImages.length ? customImages[i-1] : `https://picsum.photos/800/600?random=${i}`;
        slide.innerHTML = `<img src="${src}" loading="lazy" alt="Work sample ${i}">`;
        track.appendChild(slide);
    }

    const swiper = new Swiper('.mySwiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        }
    });

    /* --- MOBILE PRICING SCROLL LOGIC --- */
    const pricingTrack = document.getElementById('pricingTrack');
    const pricingLeftArr = document.querySelector('.pricing-arrow-left');
    const pricingRightArr = document.querySelector('.pricing-arrow-right');

    if (pricingTrack && pricingLeftArr && pricingRightArr) {
        // Auto scroll to center element on load if mobile
        if(window.innerWidth <= 768) {
             setTimeout(() => {
                 const centerCard = pricingTrack.children[1];
                 if(centerCard) {
                     pricingTrack.scrollTo({
                         left: centerCard.offsetLeft - (window.innerWidth / 2) + (centerCard.offsetWidth / 2),
                         behavior: 'smooth'
                     });
                 }
             }, 500); // Slight delay for rendering
        }

        pricingLeftArr.addEventListener('click', () => {
            pricingTrack.scrollBy({ left: -window.innerWidth * 0.8, behavior: 'smooth' });
        });

        pricingRightArr.addEventListener('click', () => {
            pricingTrack.scrollBy({ left: window.innerWidth * 0.8, behavior: 'smooth' });
        });
    }

    /* --- CALENDLY POPUP LOGIC --- */
    const calendlyButtons = document.querySelectorAll('.book-call-btn, .hero-btn, .footer-btn');
    const calendlyUrl = 'https://calendly.com/capysideinfo/30min';

    calendlyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof Calendly !== 'undefined') {
                Calendly.initPopupWidget({ 
                    url: calendlyUrl,
                    color: '#ff4848', // Capyside Red
                    textColor: '#ffffff',
                    branding: false
                });
            } else {
                window.open(calendlyUrl, '_blank');
            }
            return false;
        });
    });

});
