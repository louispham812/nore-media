import { useEffect, useRef, useState } from 'react';
import { Routes, Route, Link, useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Plyr } from 'plyr-react';
import 'plyr/dist/plyr.css';
import videoData from './data/videos.json';

const pages = [
  { path: '/', key: 'home' },
  { path: '/about', key: 'about' },
  { path: '/services', key: 'services' },
  { path: '/gallery', key: 'gallery' },
  { path: '/video', key: 'video' },
  { path: '/contact', key: 'contact' },
  // Also support clean URLs
  { path: '/index', key: 'home' },
];

function currentPage(pathname) {
  if (pathname === '/' || pathname === '/index') return 'home';
  const match = pages.find((page) => page.path === pathname);
  return match ? match.key : 'not-found';
}

function Header({ activePage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const isEn = i18n.resolvedLanguage === 'en' || (i18n.language && i18n.language.startsWith('en'));
  const currentLang = isEn ? 'en' : 'vi';

  const toggleLanguage = () => {
    const nextLang = currentLang === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(nextLang);
    document.documentElement.lang = nextLang;
  };

  useEffect(() => {
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth > 720) setMenuOpen(false);
    };
    window.addEventListener('resize', closeOnResize);
    return () => window.removeEventListener('resize', closeOnResize);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  // Unique pages for the menu
  const menuPages = pages.slice(0, 6);

  return (
    <header className={`site-header${menuOpen ? ' nav-open' : ''}`}>
      <div className="container nav-wrap">
        <Link className="brand" to="/">
          <img src="/logo.jpg" alt="NORE" />
          <span>NORE MEDIA</span>
        </Link>
        <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label={t('nav.mainAria')}>
          {menuPages.map((page) => {
            const isActive = activePage === page.key;
            return (
              <Link
                to={page.path}
                className={isActive ? 'active' : ''}
                aria-current={isActive ? 'page' : undefined}
                key={page.key}
                onClick={() => setMenuOpen(false)}
                style={{ position: 'relative' }}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(255,255,255,0.12)',
                      borderRadius: '999px',
                      zIndex: -1
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {t(`nav.${page.key}`)}
              </Link>
            );
          })}
          <button 
            type="button"
            className="lang-switch" 
            onClick={toggleLanguage} 
            title={t('nav.langSwitchTitle')}
          >
            <span className={currentLang === 'vi' ? 'active' : ''}>VI</span>
            <span className={currentLang === 'en' ? 'active' : ''}>EN</span>
            <motion.div
              className="lang-switch-pill"
              initial={false}
              animate={{ x: currentLang === 'en' ? '100%' : '0%' }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </nav>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

function Footer({ showSocial = false }) {
  const { t } = useTranslation();
  return (
    <footer className="site-footer">
      <div className="container footer-wrap">
        <p>{t('site.copyright')}</p>
        {showSocial && (
          <div className="social-links">
            <a href="https://zalo.me/0935997174" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              Zalo
            </a>
            <a href="https://www.facebook.com/profile.php?id=61550981890739" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              Facebook
            </a>
            <a href="https://www.instagram.com/noreagencymedia/" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              Instagram
            </a>
          </div>
        )}
      </div>
    </footer>
  );
}

function PageHero({ eyebrow, title, children }) {
  return (
    <section className="page-hero">
      <div className="container">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {children}
      </div>
    </section>
  );
}

function HomePage() {
  const { t } = useTranslation();
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!image) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setImage(null);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [image]);

  return (
    <>
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">{t('site.tagline')}</p>
              <h1>NORE MEDIA</h1>
              <p>{t('home.heroDesc')}</p>
              <div className="actions">
                <Link to="/contact" className="btn btn-primary">{t('home.contactNow')}</Link>
                <Link to="/services" className="btn btn-secondary">{t('home.viewServices')}</Link>
              </div>
            </div>
            <div className="hero-media">
              <img src="/logo.png" alt="NORE MEDIA" />
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading" style={{ maxWidth: '100%' }}>
              <p className="eyebrow">{t('home.aboutEyebrow')}</p>
              <h2 style={{ whiteSpace: 'nowrap', fontSize: 'clamp(0.9rem, 4.8vw, 2.35rem)' }}>
                {t('home.aboutHeading')}
              </h2>
            </div>
            <div className="about-preview">
              <p>{t('home.aboutDesc')}</p>
              <Link to="/about" className="text-link">{t('home.learnMore')}</Link>
            </div>
          </div>
        </section>

        <section className="section alt">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">{t('home.servicesEyebrow')}</p>
              <h2>{t('home.servicesHeading')}</h2>
            </div>
            <div className="card-grid">
              <article className="card">
                <h3>{t('home.service1Title')}</h3>
                <p>{t('home.service1Desc')}</p>
              </article>
              <article className="card">
                <h3>{t('home.service2Title')}</h3>
                <p>{t('home.service2Desc')}</p>
              </article>
              <article className="card">
                <h3>{t('home.service3Title')}</h3>
                <p>{t('home.service3Desc')}</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">{t('home.galleryEyebrow')}</p>
              <h2>{t('home.galleryHeading')}</h2>
            </div>
            <div className="gallery-grid">
              {[1, 3, 5, 6].map((number, index) => (
                <button
                  className="gallery-image-button"
                  type="button"
                  onClick={() => setImage(`/gallery/${number}.png`)}
                  aria-label={t('home.zoomAria', { index: index + 1 })}
                  key={number}
                >
                  <img src={`/gallery/${number}.png`} alt={t('home.altWork', { index: index + 1 })} />
                </button>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <Link to="/gallery" className="btn btn-secondary">{t('home.viewMoreGallery')}</Link>
            </div>
          </div>
        </section>
      </main>
      {image && (
        <div
          className="modal show"
          role="dialog"
          aria-modal="true"
          aria-label={t('home.modalAria')}
          onClick={() => setImage(null)}
        >
          <button className="close-modal" type="button" aria-label={t('home.closeModal')} onClick={() => setImage(null)}>
            &times;
          </button>
          <img
            className="modal-content"
            src={image}
            alt={t('home.modalAlt')}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

function AboutPage() {
  const { t } = useTranslation();
  return (
    <main className="page-main">
      <PageHero eyebrow={t('about.eyebrow')} title={t('about.heroTitle')}>
        <p>{t('about.heroP1')}</p>
        <p>{t('about.heroP2')}</p>
      </PageHero>
      <section className="section">
        <div className="container content-grid">
          <div>
            <h2>{t('about.visionTitle')}</h2>
            <p>{t('about.visionDesc')}</p>
          </div>
          <div>
            <h2>{t('about.missionTitle')}</h2>
            <p>{t('about.missionDesc')}</p>
          </div>
        </div>
      </section>
    </main>
  );
}

function ServicesPage() {
  const { t } = useTranslation();

  const packagesConfig = [
    { key: 'signature', popular: true },
    { key: 'premium', popular: false },
  ];

  return (
    <main className="page-main">
      <PageHero eyebrow={t('services.eyebrow')} title={t('services.title')} />
      <section className="section">
        <motion.div 
          className="container card-grid service-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 }
            }
          }}
        >
          {packagesConfig.map(({ key, popular }) => {
            const name = t(`services.packages.${key}.name`);
            const intro = t(`services.packages.${key}.intro`);
            const features = t(`services.packages.${key}.features`, { returnObjects: true }) || [];

            return (
              <motion.article 
                className="card framer-card" 
                key={key}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    transition: { type: "spring", stiffness: 80, damping: 20 }
                  }
                }}
                whileHover={{
                  y: -12,
                  transition: { type: "spring", stiffness: 300, damping: 12 }
                }}
                style={popular ? { 
                  borderColor: "rgba(255, 255, 255, 0.4)", 
                  boxShadow: "0 0 40px rgba(255,255,255,0.1)",
                  background: "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)"
                } : {}}
              >
                <div className={`service-heading${popular ? '' : ' service-heading-spaced'}`}>
                  {popular && (
                    <motion.span 
                      className="eyebrow"
                      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                      transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                      style={{
                        background: "linear-gradient(90deg, #fff, #888, #fff)",
                        backgroundSize: "200% 200%",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        display: "inline-block",
                        fontWeight: 800
                      }}
                    >
                      {t('services.popularBadge')}
                    </motion.span>
                  )}
                  <h2>{name}</h2>
                </div>
                <h3>{t('services.projectBased')}</h3>
                <p className="service-intro">{intro}</p>
                <motion.ul 
                  className="service-features"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
                    }
                  }}
                >
                  {Array.isArray(features) && features.map(([title, text], idx) => (
                    <motion.li 
                      key={idx}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
                      }}
                    >
                      <strong>{title}</strong>{text}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.article>
            );
          })}
        </motion.div>
      </section>
    </main>
  );
}

function GalleryPage() {
  const { t } = useTranslation();
  return (
    <main className="page-main">
      <PageHero eyebrow={t('gallery.eyebrow')} title={t('gallery.title')} />
      <section className="section">
        <div className="container">
          <article className="card canva-card">
            <div className="canva-embed">
              <iframe
                loading="lazy"
                src="https://www.canva.com/design/DAHJ40demyc/haPQFA94SUbCfZWUdvxPNw/view?embed"
                title={t('gallery.iframeTitle')}
                allowFullScreen
                allow="fullscreen"
              />
            </div>
            <div className="canva-credit">
              <a
                href="https://canva.link/lx72u295xwn5sel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                {t('gallery.openCanva')}
              </a>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

const VIDEO_BASE_URL = "https://pub-c58cdc739b3e41f093d0676c704c7618.r2.dev";

function VideoCard({ src, vertical = false, eager = false }) {
  const fullSrc = src.startsWith('http') ? src : `${VIDEO_BASE_URL}${src}`;
  const posterSrc = src.startsWith('http') ? undefined : `${fullSrc}.jpg`;
  
  const plyrOptions = {
    controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen', 'settings'],
    settings: ['speed'],
    hideControls: true,
    fullscreen: { enabled: true, fallback: true, iosNative: true }
  };

  return (
    <article className={`card video-card${vertical ? ' video-card-vertical' : ''} not-played`}>
      <Plyr
        source={{
          type: 'video',
          sources: [{ src: fullSrc, type: 'video/mp4' }],
          poster: posterSrc
        }}
        options={plyrOptions}
      />
    </article>
  );
}

const categoryIcons = {
  tvc: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  short: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" />
    </svg>
  ),
  recap: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
};

function VideoPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const activeCategory = videoData.find((c) => c.id === categoryParam) || null;

  useEffect(() => {
    const handlePlay = (e) => {
      const target = e.target;
      if (target && target.tagName === 'VIDEO') {
        const card = target.closest('.video-card');
        if (card) {
          card.classList.add('has-played');
          card.classList.remove('not-played');
        }
      }
    };
    
    document.addEventListener('play', handlePlay, true);
    document.addEventListener('playing', handlePlay, true);
    
    return () => {
      document.removeEventListener('play', handlePlay, true);
      document.removeEventListener('playing', handlePlay, true);
    };
  }, []);

  const handleSelectCategory = (catId) => {
    setSearchParams({ category: catId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHub = () => {
    setSearchParams({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="page-main">
      <PageHero eyebrow={t('video.eyebrow')} title={t('video.title')} />
      <section className="section">
        <div className="container">
          <AnimatePresence mode="wait">
            {!activeCategory ? (
              <motion.div
                key="hub"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <div className="video-hub-intro">
                  <p className="video-hub-desc">{t('video.hub.subtitle')}</p>
                </div>
                <div className="video-hub-grid">
                  {videoData.map((category) => {
                    const catTitle = t(`video.categories.${category.id}.title`, { defaultValue: category.title });
                    const catDesc = t(`video.categories.${category.id}.desc`, { defaultValue: category.desc });
                    const projectCount = category.projects.length;
                    const videoCount = category.projects.reduce((sum, p) => sum + p.videos.length, 0);

                    return (
                      <article
                        key={category.id}
                        className="video-hub-card"
                        onClick={() => handleSelectCategory(category.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSelectCategory(category.id);
                          }
                        }}
                      >
                        <div className="video-hub-badge-row">
                          <div className="video-hub-icon">
                            {categoryIcons[category.id] || null}
                          </div>
                          <span className="video-hub-stat">
                            {t('video.hub.projectsCount', { count: projectCount })} • {t('video.hub.videosCount', { count: videoCount })}
                          </span>
                        </div>
                        <h3>{catTitle}</h3>
                        <p>{catDesc}</p>
                        <div className="video-hub-action">
                          <span>{t('video.hub.explore')}</span>
                          <span aria-hidden="true">&rarr;</span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={activeCategory.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <div className="video-active-nav">
                  <button
                    type="button"
                    className="video-back-btn"
                    onClick={handleBackToHub}
                  >
                    {t('video.hub.backToCategories')}
                  </button>
                  <div className="video-category-pills">
                    {videoData.map((cat) => {
                      const isCurrent = cat.id === activeCategory.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          className={`video-pill${isCurrent ? ' active' : ''}`}
                          onClick={() => handleSelectCategory(cat.id)}
                        >
                          {t(`video.categories.${cat.id}.title`, { defaultValue: cat.title })}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="video-category">
                  <h2 className="video-category-title">
                    {t(`video.categories.${activeCategory.id}.title`, { defaultValue: activeCategory.title })}
                  </h2>
                  <p className="video-category-desc">
                    {t(`video.categories.${activeCategory.id}.desc`, { defaultValue: activeCategory.desc })}
                  </p>

                  {activeCategory.projects.map((project, pIdx) => {
                    const isVertical = activeCategory.isVertical;
                    const isGrid = project.videos.length > 1;
                    let containerClass = "video-featured";
                    if (isVertical) containerClass = "video-grid video-grid-vertical";
                    else if (isGrid) containerClass = "video-grid";

                    return (
                      <div key={pIdx}>
                        <h3 className="video-project-title">{project.title}</h3>
                        <div className={containerClass}>
                          {project.videos.map((src, vIdx) => (
                            <VideoCard key={vIdx} src={encodeURI(src)} vertical={isVertical} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      <section className="section alt">
        <div className="container card-grid">
          <article className="card">
            <h3>{t('video.serviceCards.card1Title')}</h3>
            <p>{t('video.serviceCards.card1Desc')}</p>
          </article>
          <article className="card">
            <h3>{t('video.serviceCards.card2Title')}</h3>
            <p>{t('video.serviceCards.card2Desc')}</p>
          </article>
          <article className="card">
            <h3>{t('video.serviceCards.card3Title')}</h3>
            <p>{t('video.serviceCards.card3Desc')}</p>
          </article>
        </div>
      </section>
    </main>
  );
}

function ContactPage() {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const submission = useRef({ key: (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : Math.random().toString(36).substring(2), details: null });

  async function submitContact(event) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback({ type: '', message: '' });
    const form = event.currentTarget;
    const details = Object.fromEntries(new FormData(form).entries());
    if (submission.current.details && JSON.stringify(submission.current.details) !== JSON.stringify(details)) {
      submission.current = { key: (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : Math.random().toString(36).substring(2), details: null };
    }
    submission.current.details = details;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': submission.current.key,
        },
        body: JSON.stringify(details),
      });
      const result = await response.json();
      if (!response.ok) {
        const missingSettings = Array.isArray(result.missing) && result.missing.length
          ? ` ${t('contact.errorMissing')}: ${result.missing.join(', ')}.`
          : '';
        setFeedback({
          type: 'error',
          message: `${result.error || t('contact.errorFail')}${missingSettings}`,
        });
        return;
      }
      form.reset();
      submission.current = { key: (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : Math.random().toString(36).substring(2), details: null };
      setFeedback({
        type: 'success',
        message: result.confirmationWarning
          ? `${t(result.messageKey || 'contact.success')} ${t('contact.successWarn')}`
          : t(result.messageKey || 'contact.success'),
      });
    } catch {
      setFeedback({ type: 'error', message: t('contact.errorConnect') });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page-main">
      <PageHero eyebrow={t('contact.heroEyebrow')} title={t('contact.heroTitle')}>
        <p>{t('contact.heroDesc')}</p>
      </PageHero>
      <section className="section contact-section">
        <div className="container contact-grid">
          <div className="contact-card contact-form-card">
            <div className="section-heading">
              <p className="eyebrow">{t('contact.formEyebrow')}</p>
              <h2>{t('contact.formTitle')}</h2>
            </div>
            <form className="contact-form" onSubmit={submitContact}>
              <label>
                {t('contact.name')}
                <input name="name" type="text" placeholder={t('contact.namePlaceholder')} autoComplete="name" maxLength={100} required />
              </label>
              <label>
                {t('contact.phone')}
                <input name="phone" type="tel" placeholder={t('contact.phonePlaceholder')} autoComplete="tel" maxLength={30} required />
              </label>
              <label>
                {t('contact.email')}
                <input name="email" type="email" placeholder={t('contact.emailPlaceholder')} autoComplete="email" maxLength={254} required />
              </label>
              <label>
                {t('contact.message')}
                <textarea name="message" rows="5" placeholder={t('contact.messagePlaceholder')} maxLength={3000} required />
              </label>
              <div className="contact-honeypot" aria-hidden="true">
                <label>
                  {t('contact.honeypot')}
                  <input name="website" type="text" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? t('contact.submitting') : t('contact.submit')}
              </button>
              {feedback.message && (
                <p className={`form-feedback ${feedback.type}`} role="status" aria-live="polite">
                  {feedback.message}
                </p>
              )}
            </form>
          </div>
          <div className="contact-card contact-info-card">
            <div className="section-heading">
              <p className="eyebrow">{t('contact.infoEyebrow')}</p>
              <h2>{t('contact.infoTitle')}</h2>
            </div>
            <div className="contact-meta">
              <div>
                <strong>{t('contact.address')}</strong>
                <p>{t('contact.addressVal')}</p>
              </div>
              <div>
                <strong>{t('contact.hotline')}</strong>
                <p>093 599 71 74</p>
              </div>
              <div>
                <strong>{t('contact.emailLabel')}</strong>
                <p>admin@noreagency.com</p>
              </div>
            </div>
            <div className="social-links contact-social">
              <a href="https://zalo.me/0935997174" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                Zalo
              </a>
              <a href="https://www.facebook.com/profile.php?id=61550981890739" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                Facebook
              </a>
              <a href="https://www.instagram.com/noreagencymedia/" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                Instagram
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <main className="page-main">
      <PageHero eyebrow={t('notFound.eyebrow')} title={t('notFound.title')}>
        <p><Link className="text-link" to="/">{t('notFound.backHome')}</Link></p>
      </PageHero>
    </main>
  );
}

const pageComponents = {
  home: HomePage,
  about: AboutPage,
  services: ServicesPage,
  gallery: GalleryPage,
  video: VideoPage,
  contact: ContactPage,
  'not-found': NotFoundPage,
};

export default function App() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const activePage = currentPage(location.pathname);

  useEffect(() => {
    const titleKey = activePage === 'not-found' ? 'notFound' : activePage;
    document.title = t(`site.pageTitles.${titleKey}`, { defaultValue: 'NORE MEDIA' });
  }, [activePage, t, i18n.language]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const observeElements = () => {
      const elements = document.querySelectorAll(
        '.reveal-up, .reveal-left, .reveal-right, .reveal-zoom, .card-grid, .gallery-grid, .video-grid, .contact-grid'
      );
      elements.forEach((el) => {
        if (!el.classList.contains('reveal-active')) {
          observer.observe(el);
        }
      });
    };

    observeElements();
    const timeout = setTimeout(observeElements, 500);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [location.pathname, location.search]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Header activePage={activePage} />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {pages.map((page) => {
            const PageComponent = pageComponents[page.key];
            return (
              <Route
                key={page.path}
                path={page.path}
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <PageComponent />
                  </motion.div>
                }
              />
            );
          })}
          {/* Catch all route */}
          <Route
            path="*"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <NotFoundPage />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>

      <Footer showSocial={activePage === 'home'} />
    </>
  );
}
