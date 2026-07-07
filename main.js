document.addEventListener('DOMContentLoaded', () => {
    const headers = document.querySelectorAll('.site-header');

    headers.forEach((header) => {
        const nav = header.querySelector('.main-nav');
        if (!nav) return;

        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'menu-toggle';
        toggle.setAttribute('aria-label', 'Mở menu');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = '<span></span><span></span><span></span>';

        const navWrap = header.querySelector('.nav-wrap');
        if (navWrap) {
            navWrap.appendChild(toggle);
        }

        const closeMenu = () => {
            header.classList.remove('nav-open');
            nav.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', 'Mở menu');
            document.body.classList.remove('menu-open');
        };

        toggle.addEventListener('click', () => {
            const isOpen = header.classList.toggle('nav-open');
            nav.classList.toggle('is-open', isOpen);
            toggle.setAttribute('aria-expanded', String(isOpen));
            toggle.setAttribute('aria-label', isOpen ? 'Đóng menu' : 'Mở menu');
            document.body.classList.toggle('menu-open', isOpen);
        });

        nav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeMenu);
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 720) {
                closeMenu();
            }
        });
    });
});
