const parallaxWrapper = document.querySelector('.parallax-wrapper');
const parallaxImg = document.querySelector('.parallax-img');
const heroText = document.querySelector('.introducao > div');

parallaxWrapper?.classList.add('hero-enter', 'hero-enter--img');
heroText?.classList.add('hero-enter', 'hero-enter--text');

const prefersMotion = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
const isFinePointer = window.matchMedia('(pointer: fine)').matches;

if (parallaxImg && prefersMotion) {
    let ticking = false;

    const applyParallax = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            parallaxImg.style.transform = `translateY(${window.scrollY * 0.2}px)`;
            ticking = false;
        });
    };

    parallaxWrapper.addEventListener('animationend', () => {
        parallaxWrapper.classList.remove('hero-enter', 'hero-enter--img');
        window.addEventListener('scroll', applyParallax, { passive: true });
    }, { once: true });
}

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
    });
}, { threshold: 0.1 });

document.querySelectorAll('.empresa, .faculdade, .formacao-extra > div').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.setProperty('--reveal-delay', `${(i % 3) * 0.12}s`);
    revealObserver.observe(el);
});

const navLinks = document.querySelectorAll('.header-menu a');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(a => a.classList.remove('active'));
        document.querySelector(`.header-menu a[href="#${entry.target.id}"]`)
            ?.classList.add('active');
    });
}, { rootMargin: '-30% 0px -60% 0px' });

document.querySelectorAll('section[id], footer[id]').forEach(s => sectionObserver.observe(s));

function showToast(msg) {
    document.querySelector('.toast')?.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('toast--visible')));
    setTimeout(() => {
        toast.classList.remove('toast--visible');
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, 2500);
}

document.querySelectorAll('.footer-contato a[href^="mailto:"], .footer-contato a[href^="tel:"]')
    .forEach(link => {
        link.title = 'Clique para copiar';
        link.addEventListener('click', e => {
            e.preventDefault();
            navigator.clipboard.writeText(link.textContent.trim())
                .then(() => showToast('Copiado ✓'))
                .catch(() => showToast(link.textContent.trim()));
        });
    });

if (isFinePointer) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    (function animate() {
        glowX += (mouseX - glowX) * 0.07;
        glowY += (mouseY - glowY) * 0.07;
        glow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animate);
    })();
}
