/**
 * Saffron Brew Café - Premium Animation Engine (GSAP Powered)
 * 
 * Features:
 * - GSAP Core + ScrollTrigger for performance
 * - Physics-based Magnetic Buttons
 * - Distinct per-category 3D animations (Steam, Glow, Liquid, Snap, Zoom)
 * - Cinematic Hero Entrances
 */

gsap.registerPlugin(ScrollTrigger);

class AnimationEngine {
    constructor() {
        this.config = {
            magneticForce: 0.6, // Strength of button magnet
            cursorEase: "power2.out",
        };

        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    start() {
        this.initLoader();
        this.initHero();
        this.initNavbar();
        this.initMagneticButtons();
        this.initMenuAnimations();
        this.initTiltCards(); // Restore generic tilt
        this.initGlobalReveals();
    }

    // Generic 3D Tilt for Gallery & Contact
    initTiltCards() {
        const cards = document.querySelectorAll('.tilt-card:not(.menu-item)');

        cards.forEach(card => {
            // Add Glare
            const glare = document.createElement('div');
            glare.className = 'card-glare';
            card.appendChild(glare);

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const xPct = (x / rect.width - 0.5) * 2; // -1 to 1
                const yPct = (y / rect.height - 0.5) * 2;

                // Tilt
                gsap.to(card, {
                    rotationY: xPct * 10,
                    rotationX: -yPct * 10,
                    duration: 0.5,
                    ease: "power2.out",
                    transformPerspective: 1000
                });

                // Glare Movement
                gsap.to(glare, {
                    opacity: 0.6,
                    background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.3) 0%, transparent 60%)`,
                    duration: 0.1
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" });
                gsap.to(glare, { opacity: 0, duration: 0.5 });
            });
        });
    }

    // 0. Page Loader
    initLoader() {
        const loader = document.querySelector('.page-loader');
        if (loader) {
            gsap.to(loader, {
                scaleY: 0,
                duration: 1.2,
                ease: "power4.inOut",
                delay: 0.2
            });
        }
    }

    // 1. Hero Section: Cinematic Entrance & Parallax
    initHero() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        // Timeline for Entrance
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Initial set
        gsap.set('.hero h1', { y: 100, opacity: 0, rotateX: 20 });
        gsap.set('.hero p', { y: 50, opacity: 0 });
        gsap.set('.hero .btn', { y: 40, opacity: 0 });

        // Sequence
        tl.to('.hero h1', {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.4,
            stagger: 0.1
        })
            .to('.hero h1', {
                // Shimmer effect
                textShadow: "0 0 30px rgba(255, 153, 51, 0.6)",
                repeat: 1,
                yoyo: true,
                duration: 0.5
            }, "-=0.8")
            .to('.hero p', { y: 0, opacity: 1, duration: 1 }, "-=1")
            .to('.hero .btn', { y: 0, opacity: 1, duration: 0.8 }, "-=0.8");

        // 3D Parallax on Mouse Move
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const xPos = (clientX / window.innerWidth - 0.5) * 40;
            const yPos = (clientY / window.innerHeight - 0.5) * 40;

            gsap.to('.hero-content', {
                rotationY: xPos,
                rotationX: -yPos,
                duration: 1,
                ease: 'power2.out',
                transformPerspective: 900
            });
        });
    }

    // 2. Navbar: Glassmorphism & Slide-in
    initNavbar() {
        const nav = document.querySelector('.navbar');
        // Start hidden/transparent
        gsap.set(nav, { y: -100, opacity: 0 });

        // Slide in
        gsap.to(nav, { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: "power3.out" });

        // Scroll Effect (Glassmorphism)
        ScrollTrigger.create({
            start: "top -50",
            onUpdate: (self) => {
                if (self.scroll() > 50) {
                    gsap.to(nav, {
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(10px)",
                        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                        height: "70px",
                        duration: 0.4
                    });
                    nav.classList.add('scrolled');
                } else {
                    gsap.to(nav, {
                        backgroundColor: "rgba(255, 255, 255, 0.95)", // Keep it solid for now as per design
                        backdropFilter: "none",
                        boxShadow: "none",
                        height: "80px",
                        duration: 0.4
                    });
                    nav.classList.remove('scrolled');
                }
            }
        });
    }

    // 3. Magnetic Buttons (Physics-based)
    initMagneticButtons() {
        const buttons = document.querySelectorAll('.btn-primary, .nav-links a');

        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                // Move button towards cursor (Magnetic)
                gsap.to(btn, {
                    x: x * this.config.magneticForce,
                    y: y * this.config.magneticForce,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            btn.addEventListener('mouseleave', () => {
                // Elastic snap back
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.3)"
                });
            });
        });
    }

    // 4. Distinct Menu Animations per Category
    initMenuAnimations() {
        const items = document.querySelectorAll('.menu-item');

        items.forEach(item => {
            const type = item.getAttribute('data-type');

            // Common Render settings
            gsap.set(item, { transformPerspective: 1000, transformStyle: "preserve-3d" });

            switch (type) {
                case 'coffee':
                    this.animCoffee(item);
                    break;
                case 'chai':
                    this.animChai(item);
                    break;
                case 'cold-brew':
                    this.animColdBrew(item);
                    break;
                case 'snack':
                    this.animSnack(item);
                    break;
                case 'dessert':
                    this.animDessert(item);
                    break;
                default:
                    this.animDefault(item);
            }
        });
    }

    // --- Specific Animation Logic ---

    // A. Coffee: Soft Tilt + Steam Effect
    animCoffee(item) {
        // Add steam element
        const steam = document.createElement('div');
        steam.className = 'steam-effect';
        item.appendChild(steam);

        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) / 20;
            const y = (e.clientY - rect.top - rect.height / 2) / 20;

            gsap.to(item, {
                rotationY: x,
                rotationX: -y,
                transformOrigin: "center center",
                duration: 0.5,
                ease: "power1.out"
            });

            // Steam rises faster
            gsap.to(steam, { opacity: 0.6, y: -20, duration: 1 });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item, { rotationY: 0, rotationX: 0, duration: 0.8, ease: "power3.out" });
            gsap.to(steam, { opacity: 0, y: 0, duration: 0.5 });
        });
    }

    // B. Chai: Floating Warmth + Glow
    animChai(item) {
        // Continuous organic float
        gsap.to(item.querySelector('.item-image img'), {
            y: -10,
            rotation: 2,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                boxShadow: "0 20px 50px rgba(255, 153, 51, 0.25)",
                scale: 1.02,
                duration: 0.5
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                scale: 1,
                duration: 0.5
            });
        });
    }

    // C. Cold Brew: Liquid Feel + Parallax Background
    animColdBrew(item) {
        const image = item.querySelector('.item-image img');

        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;

            // Move image opposite to cursor (Liquid/Glass feel)
            gsap.to(image, {
                x: (x - 0.5) * -30,
                duration: 0.8,
                ease: "power2.out"
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(image, { x: 0, duration: 0.8 });
        });
    }

    // D. Snacks: Physical Snap/Bounce
    animSnack(item) {
        // Scroll Trigger Reveal (Hard Snap)
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 85%"
            },
            y: 100,
            opacity: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.5)"
        });

        item.addEventListener('mousedown', () => {
            gsap.to(item, { scale: 0.95, duration: 0.1 });
        });

        item.addEventListener('mouseup', () => {
            gsap.to(item, { scale: 1.02, duration: 0.4, ease: "elastic.out(1, 0.3)" });
            gsap.to(item, { scale: 1, delay: 0.1, duration: 0.2 });
        });
    }

    // E. Dessert: Cinematic Slow Zoom + Bloom
    animDessert(item) {
        const img = item.querySelector('.item-image img');

        item.addEventListener('mouseenter', () => {
            gsap.to(img, {
                scale: 1.15,
                duration: 1.5, // Slow cinematic
                ease: "power2.inOut"
            });
            // Bloom
            gsap.to(item, {
                filter: "brightness(1.1)",
                duration: 0.5
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(img, { scale: 1, duration: 1 });
            gsap.to(item, { filter: "brightness(1)", duration: 0.5 });
        });
    }

    animDefault(item) {
        // Fallback simple hover
        item.addEventListener('mouseenter', () => gsap.to(item, { y: -10, duration: 0.3 }));
        item.addEventListener('mouseleave', () => gsap.to(item, { y: 0, duration: 0.3 }));
    }

    // 5. Global Scroll Reveals
    initGlobalReveals() {
        const elements = document.querySelectorAll('.category-title, .gallery-item, .info-card');

        elements.forEach(el => {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 80%"
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });
        });
    }
}

// Initialize
window.saffronEngine = new AnimationEngine();
