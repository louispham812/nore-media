import { useEffect, useRef, useState } from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Plyr } from "plyr-react";
import "plyr/dist/plyr.css";
import videoData from "./data/videos.json";
import photographyData from "./data/photography.json";

const navItems = [
  { path: "/", key: "home" },
  { path: "/about", key: "about" },
  { path: "/services", key: "services" },
  {
    path: "/projects",
    key: "projects",
    children: [
      { path: "/projects?tab=video", key: "video" },
      { path: "/projects?tab=gallery", key: "gallery" },
    ],
  },
  { path: "/contact", key: "contact" },
];

const pages = [
  { path: "/", key: "home" },
  { path: "/about", key: "about" },
  { path: "/services", key: "services" },
  { path: "/projects", key: "projects" },
  { path: "/gallery", key: "gallery" },
  { path: "/video", key: "video" },
  { path: "/contact", key: "contact" },
  // Also support clean URLs
  { path: "/index", key: "home" },
];

function currentPage(pathname) {
  if (pathname === "/" || pathname === "/index") return "home";
  if (
    pathname === "/projects" ||
    pathname === "/gallery" ||
    pathname === "/video"
  )
    return "projects";
  const match = pages.find((page) => page.path === pathname);
  return match ? match.key : "not-found";
}

function Header({ activePage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(
    activePage === "projects",
  );
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const isEn =
    i18n.resolvedLanguage === "en" ||
    (i18n.language && i18n.language.startsWith("en"));
  const currentLang = isEn ? "en" : "vi";

  const toggleLanguage = () => {
    const nextLang = currentLang === "vi" ? "en" : "vi";
    i18n.changeLanguage(nextLang);
    document.documentElement.lang = nextLang;
  };

  useEffect(() => {
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth > 720) {
        setMenuOpen(false);
        setMobileProjectsOpen(false);
      }
    };
    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  return (
    <header className={`site-header${menuOpen ? " nav-open" : ""}`}>
      <div className="container nav-wrap">
        <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>
          <img src="/logo.jpg" alt="NORE" />
          <span>NORE MEDIA</span>
        </Link>
        <nav
          className={`main-nav${menuOpen ? " is-open" : ""}`}
          aria-label={t("nav.mainAria")}
        >
          {navItems.map((item) => {
            const isActive = activePage === item.key;
            if (item.children) {
              const isGalleryActive =
                activePage === "projects" &&
                (location.search.includes("tab=gallery") ||
                  location.pathname === "/gallery");
              const isVideoActive =
                activePage === "projects" && !isGalleryActive;

              return (
                <div
                  key={item.key}
                  className={`nav-item-dropdown${mobileProjectsOpen ? " mobile-open" : ""}`}
                >
                  <div className="nav-dropdown-trigger-row">
                    <Link
                      to={item.path}
                      className={`nav-dropdown-trigger${isActive ? " active" : ""}`}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setMenuOpen(false)}
                      style={{ position: "relative" }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-pill"
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(255,255,255,0.12)",
                            borderRadius: "999px",
                            zIndex: -1,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                      <span>{t(`nav.${item.key}`)}</span>
                      <svg
                        className="dropdown-chevron"
                        viewBox="0 0 10 6"
                        width="8"
                        height="6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 1L5 5L9 1" />
                      </svg>
                    </Link>
                    <button
                      type="button"
                      className="mobile-submenu-toggle"
                      aria-label={
                        mobileProjectsOpen
                          ? t("nav.closeMenu")
                          : t("nav.openMenu")
                      }
                      aria-expanded={mobileProjectsOpen}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setMobileProjectsOpen((prev) => !prev);
                      }}
                    >
                      <svg
                        viewBox="0 0 10 6"
                        width="10"
                        height="6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          transform: mobileProjectsOpen
                            ? "rotate(180deg)"
                            : "none",
                          transition: "transform 0.2s ease",
                        }}
                      >
                        <path d="M1 1L5 5L9 1" />
                      </svg>
                    </button>
                  </div>

                  <div className="nav-dropdown-menu">
                    <Link
                      to="/projects?tab=video"
                      className={`nav-dropdown-item${isVideoActive ? " active-sub" : ""}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="15"
                        height="15"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="dropdown-item-icon"
                      >
                        <polygon points="23 7 16 12 23 17 23 7" />
                        <rect
                          x="1"
                          y="5"
                          width="15"
                          height="14"
                          rx="2"
                          ry="2"
                        />
                      </svg>
                      <span>{t("nav.video")}</span>
                    </Link>
                    <Link
                      to="/projects?tab=gallery"
                      className={`nav-dropdown-item${isGalleryActive ? " active-sub" : ""}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="15"
                        height="15"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="dropdown-item-icon"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span>{t("nav.gallery")}</span>
                    </Link>
                  </div>
                </div>
              );
            }

            return (
              <Link
                to={item.path}
                className={isActive ? "active" : ""}
                aria-current={isActive ? "page" : undefined}
                key={item.key}
                onClick={() => setMenuOpen(false)}
                style={{ position: "relative" }}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(255,255,255,0.12)",
                      borderRadius: "999px",
                      zIndex: -1,
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {t(`nav.${item.key}`)}
              </Link>
            );
          })}
          <button
            type="button"
            className="lang-switch"
            onClick={toggleLanguage}
            title={t("nav.langSwitchTitle")}
          >
            <span className={currentLang === "vi" ? "active" : ""}>VI</span>
            <span className={currentLang === "en" ? "active" : ""}>EN</span>
            <motion.div
              className="lang-switch-pill"
              initial={false}
              animate={{ x: currentLang === "en" ? "100%" : "0%" }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </nav>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
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
        <p>{t("site.copyright")}</p>
        {showSocial && (
          <div className="social-links">
            <a
              href="https://zalo.me/0935997174"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              Zalo
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61550981890739"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
              Facebook
            </a>
            <a
              href="https://www.instagram.com/noreagencymedia/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
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

const homeFeaturedWorks = [
  {
    id: "mooncake",
    category: "product",
    badgeVi: "Sản phẩm",
    badgeEn: "Product",
    titleVi: "BST Bánh Trung Thu Hoàng Gia - Le Méridien",
    titleEn: "Royal Mooncake Collection - Le Méridien",
    client: "Le Méridien Saigon",
    src: "https://pub-c58cdc739b3e41f093d0676c704c7618.r2.dev/Photography/Product/BanhTrungThu_LeMeridien/01_LeMeridien_Mooncake_Collection_ArchesWaterReflection.png",
  },
  {
    id: "cocktail",
    category: "product",
    badgeVi: "Sản phẩm",
    badgeEn: "Product",
    titleVi: "Cocktail Nghệ Thuật - SongBar Hilton",
    titleEn: "Artisan Cocktail - SongBar Hilton Saigon",
    client: "Hilton Saigon",
    src: "https://pub-c58cdc739b3e41f093d0676c704c7618.r2.dev/Photography/Product/AmThuc_DoUong_FB/01_Hilton_SongBar_Cocktail_Detail.jpg",
  },
  {
    id: "oktoberfest",
    category: "brand",
    badgeVi: "Thương hiệu",
    badgeEn: "Brand",
    titleVi: "Lễ Hội Bia Oktoberfest - East West Brewing",
    titleEn: "Oktoberfest Activation - East West Brewing",
    client: "East West Brewing Co.",
    src: "https://pub-c58cdc739b3e41f093d0676c704c7618.r2.dev/Photography/Brand/SuKien_BrandActivation_EastWest/01_EastWest_Oktoberfest_WelcomePG_Standee.jpg",
  },
  {
    id: "lasiesta",
    category: "brand",
    badgeVi: "Thương hiệu",
    badgeEn: "Brand",
    titleVi: "Hầm Rượu Kính & Không Gian - La Siesta Saigon",
    titleEn: "Luxury Glass Wine Cellar - La Siesta Saigon",
    client: "La Siesta Premium Saigon",
    src: "https://pub-c58cdc739b3e41f093d0676c704c7618.r2.dev/Photography/Brand/KhachSan_Resort_Hospitality/01_Lasiesta_Saigon_WineCellar_Dining.jpg",
  },
  {
    id: "cophong-disan",
    category: "personal",
    badgeVi: "Cá nhân",
    badgeEn: "Personal",
    titleVi: "Cổ Phong Di Sản Áo Yếm Lụa",
    titleEn: "Heritage Fine Art Silk Bodice",
    client: "Cổ Phong Di Sản",
    src: "https://pub-c58cdc739b3e41f093d0676c704c7618.r2.dev/Photography/CaNhan/ChanDung_CoPhong_AoYem/01_CoPhong_CloseUp_BeautyFan_Calligraphy.jpg",
  },
  {
    id: "bason",
    category: "personal",
    badgeVi: "Cá nhân",
    badgeEn: "Personal",
    titleVi: "Thời Trang Dạ Hội Haute Couture - Ga Ba Son",
    titleEn: "Haute Couture Red Gown - Ba Son Metro",
    client: "Editorial Haute Couture",
    src: "https://pub-c58cdc739b3e41f093d0676c704c7618.r2.dev/Photography/CaNhan/ThoiTrang_DaHoi_BaSonMetro/01_Final_CoutureRedGown_BlondeModel_EscalatorPortrait.jpg",
  },
];

function HomePage() {
  const { t, i18n } = useTranslation();
  const [selectedWorkIndex, setSelectedWorkIndex] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const isEn =
    i18n.resolvedLanguage === "en" ||
    (i18n.language && i18n.language.startsWith("en"));

  const filteredWorks =
    activeFilter === "all"
      ? homeFeaturedWorks
      : homeFeaturedWorks.filter((w) => w.category === activeFilter);

  useEffect(() => {
    if (selectedWorkIndex === null) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedWorkIndex(null);
      } else if (e.key === "ArrowLeft") {
        setSelectedWorkIndex((prev) =>
          prev > 0 ? prev - 1 : filteredWorks.length - 1
        );
      } else if (e.key === "ArrowRight") {
        setSelectedWorkIndex((prev) =>
          prev < filteredWorks.length - 1 ? prev + 1 : 0
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [selectedWorkIndex, filteredWorks.length]);

  return (
    <>
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">{t("site.tagline")}</p>
              <h1>NORE MEDIA</h1>
              <p>{t("home.heroDesc")}</p>
              <div className="actions">
                <Link to="/contact" className="btn btn-primary">
                  {t("home.contactNow")}
                </Link>
                <Link to="/services" className="btn btn-secondary">
                  {t("home.viewServices")}
                </Link>
              </div>
            </div>
            <div className="hero-media">
              <img src="/logo.png" alt="NORE MEDIA" />
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading" style={{ maxWidth: "100%" }}>
              <p className="eyebrow">{t("home.aboutEyebrow")}</p>
              <h2
                style={{
                  whiteSpace: "nowrap",
                  fontSize: "clamp(0.9rem, 4.8vw, 2.35rem)",
                }}
              >
                {t("home.aboutHeading")}
              </h2>
            </div>
            <div className="about-preview">
              <p>{t("home.aboutDesc")}</p>
              <Link to="/about" className="text-link">
                {t("home.learnMore")}
              </Link>
            </div>
          </div>
        </section>

        <section className="section alt">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">{t("home.servicesEyebrow")}</p>
              <h2>{t("home.servicesHeading")}</h2>
            </div>
            <div className="card-grid">
              <article className="card">
                <h3>{t("home.service1Title")}</h3>
                <p>{t("home.service1Desc")}</p>
              </article>
              <article className="card">
                <h3>{t("home.service2Title")}</h3>
                <p>{t("home.service2Desc")}</p>
              </article>
              <article className="card">
                <h3>{t("home.service3Title")}</h3>
                <p>{t("home.service3Desc")}</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">{t("home.galleryEyebrow")}</p>
              <h2>{t("home.galleryHeading")}</h2>
              <p className="home-gallery-sub">
                {t("home.gallerySubtitle")}
              </p>
            </div>

            <div className="home-gallery-filters" role="tablist">
              {[
                { id: "all", label: t("home.filterAll") },
                { id: "product", label: isEn ? "Product" : "Sản phẩm" },
                { id: "brand", label: isEn ? "Brand" : "Thương hiệu" },
                { id: "personal", label: isEn ? "Personal" : "Cá nhân" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`home-filter-btn${activeFilter === tab.id ? " active" : ""}`}
                  onClick={() => {
                    setActiveFilter(tab.id);
                    setSelectedWorkIndex(null);
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="home-featured-grid">
              {filteredWorks.map((work, index) => {
                const workTitle = isEn ? work.titleEn : work.titleVi;
                const badge = isEn ? work.badgeEn : work.badgeVi;

                return (
                  <article
                    className="home-work-card"
                    key={work.id}
                    onClick={() => setSelectedWorkIndex(index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedWorkIndex(index);
                      }
                    }}
                  >
                    <div className="home-work-img-wrap">
                      <img
                        src={work.src}
                        alt={workTitle}
                        loading="lazy"
                        decoding="async"
                        className="home-work-img"
                      />
                      <span className="home-work-badge">{badge}</span>
                      <div className="home-work-overlay">
                        <div className="home-work-zoom-icon" aria-hidden="true">
                          <svg
                            viewBox="0 0 24 24"
                            width="18"
                            height="18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            <line x1="11" y1="8" x2="11" y2="14" />
                            <line x1="8" y1="11" x2="14" y2="11" />
                          </svg>
                        </div>
                        <div className="home-work-info">
                          <span className="home-work-client">{work.client}</span>
                          <h3 className="home-work-title">{workTitle}</h3>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="home-gallery-actions">
              <Link to="/projects?tab=gallery" className="btn btn-secondary">
                {t("home.viewMoreGallery")} &rarr;
              </Link>
            </div>
          </div>
        </section>
      </main>

      {selectedWorkIndex !== null && filteredWorks[selectedWorkIndex] && (
        <div
          className="gallery-lightbox-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedWorkIndex(null)}
        >
          <div
            className="gallery-lightbox-container"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="gallery-lightbox-close"
              type="button"
              aria-label={t("home.closeModal")}
              onClick={() => setSelectedWorkIndex(null)}
            >
              ✕
            </button>

            <button
              type="button"
              className="gallery-lightbox-nav prev"
              onClick={() =>
                setSelectedWorkIndex((prev) =>
                  prev > 0 ? prev - 1 : filteredWorks.length - 1
                )
              }
              aria-label="Previous"
            >
              &#10094;
            </button>

            <div className="gallery-lightbox-img-wrap">
              <img
                className="gallery-lightbox-img"
                src={filteredWorks[selectedWorkIndex].src}
                alt={
                  isEn
                    ? filteredWorks[selectedWorkIndex].titleEn
                    : filteredWorks[selectedWorkIndex].titleVi
                }
              />
            </div>

            <button
              type="button"
              className="gallery-lightbox-nav next"
              onClick={() =>
                setSelectedWorkIndex((prev) =>
                  prev < filteredWorks.length - 1 ? prev + 1 : 0
                )
              }
              aria-label="Next"
            >
              &#10095;
            </button>

            <div className="gallery-lightbox-caption">
              <div className="gallery-lightbox-meta">
                <span className="gallery-lightbox-sub-title">
                  {isEn
                    ? filteredWorks[selectedWorkIndex].badgeEn
                    : filteredWorks[selectedWorkIndex].badgeVi}{" "}
                  • {filteredWorks[selectedWorkIndex].client}
                </span>
                <span className="gallery-lightbox-counter">
                  {selectedWorkIndex + 1} / {filteredWorks.length}
                </span>
              </div>
              <h4 className="gallery-lightbox-img-title">
                {isEn
                  ? filteredWorks[selectedWorkIndex].titleEn
                  : filteredWorks[selectedWorkIndex].titleVi}
              </h4>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AboutPage() {
  const { t } = useTranslation();
  return (
    <main className="page-main">
      <PageHero eyebrow={t("about.eyebrow")} title={t("about.heroTitle")}>
        <p>{t("about.heroP1")}</p>
        <p>{t("about.heroP2")}</p>
      </PageHero>
      <section className="section">
        <div className="container content-grid">
          <div>
            <h2>{t("about.visionTitle")}</h2>
            <p>{t("about.visionDesc")}</p>
          </div>
          <div>
            <h2>{t("about.missionTitle")}</h2>
            <p>{t("about.missionDesc")}</p>
          </div>
        </div>
      </section>
    </main>
  );
}

function ServicesPage() {
  const { t } = useTranslation();

  const services = [
    { key: "marketing", number: "01" },
    { key: "production", number: "02" },
    { key: "event", number: "03" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 20,
      },
    },
  };

  return (
    <main className="page-main">
      <PageHero eyebrow={t("services.eyebrow")} title={t("services.title")} />

      <section className="section">
        <div className="container">
          <motion.div
            className="card-grid service-grid nore-services"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
          >
            {services.map(({ key, number }) => {
              const baseKey = `services.packages.${key}`;

              const name = t(`${baseKey}.name`);
              const intro = t(`${baseKey}.intro`);

              const features = t(`${baseKey}.features`, {
                returnObjects: true,
              });

              return (
                <motion.article
                  key={key}
                  className={`card framer-card nore-service-card nore-service-card-${key}`}
                  variants={cardVariants}
                  whileHover={{
                    y: -8,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 22,
                    },
                  }}
                >
                  <div className="nore-service-top">
                    <span className="nore-service-number">
                      {number} / SERVICE
                    </span>
                  </div>

                  <div className="service-heading nore-service-heading">
                    <h2>{name}</h2>
                  </div>

                  <div className="nore-service-divider" />

                  <p className="service-intro nore-service-intro">{intro}</p>

                  <ul className="service-features nore-service-features">
                    {Array.isArray(features) &&
                      features.map((feature, index) => (
                        <li key={`${key}-${index}`}>
                          <span className="nore-feature-text">{feature}</span>
                        </li>
                      ))}
                  </ul>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>
    </main>
  );
}

const photographyIcons = {
  product: (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  brand: (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  ),
  personal: (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};

function GalleryContent() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const isEn =
    i18n.resolvedLanguage === "en" ||
    (i18n.language && i18n.language.startsWith("en"));

  const activeCategory =
    photographyData.find((c) => c.id === categoryParam) || null;

  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    if (!lightbox) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setLightbox(null);
      } else if (e.key === "ArrowLeft") {
        const total = lightbox.subcategory.images.length;
        setLightbox((prev) => ({
          ...prev,
          index: (prev.index - 1 + total) % total,
        }));
      } else if (e.key === "ArrowRight") {
        const total = lightbox.subcategory.images.length;
        setLightbox((prev) => ({
          ...prev,
          index: (prev.index + 1) % total,
        }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox]);

  const handleSelectCategory = (catId) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("category", catId);
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToHub = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("category");
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <section className="section">
        <div className="container">
          <AnimatePresence mode="wait">
            {!activeCategory ? (
              <motion.div
                key="gallery-hub"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <div className="video-hub-intro">
                  <p className="video-hub-desc">{t("gallery.hub.subtitle")}</p>
                </div>
                <div className="video-hub-grid gallery-hub-grid">
                  {photographyData.map((category) => {
                    const catTitle = isEn
                      ? category.titleEn
                      : t(`gallery.categories.${category.id}.title`, {
                          defaultValue: category.title,
                        });
                    const catDesc = isEn
                      ? category.descEn
                      : t(`gallery.categories.${category.id}.desc`, {
                          defaultValue: category.desc,
                        });
                    const subCount = category.subcategories.length;
                    const photoCount = category.subcategories.reduce(
                      (sum, s) => sum + s.images.length,
                      0,
                    );

                    const previewThumbnails = category.subcategories
                      .map((s) => s.images[0]?.url)
                      .filter(Boolean)
                      .slice(0, 3);

                    return (
                      <article
                        key={category.id}
                        className="video-hub-card gallery-hub-card"
                        onClick={() => handleSelectCategory(category.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleSelectCategory(category.id);
                          }
                        }}
                      >
                        <div className="video-hub-badge-row">
                          <div className="video-hub-icon">
                            {photographyIcons[category.id] || null}
                          </div>
                          <span className="video-hub-stat">
                            {t("gallery.hub.collectionsCount", {
                              count: subCount,
                            })}{" "}
                            •{" "}
                            {t("gallery.hub.photosCount", { count: photoCount })}
                          </span>
                        </div>

                        <h3>{catTitle}</h3>
                        <p>{catDesc}</p>

                        <div className="gallery-hub-preview-row">
                          {previewThumbnails.map((thumbUrl, tIdx) => (
                            <div key={tIdx} className="gallery-hub-preview-thumb">
                              <img
                                src={thumbUrl}
                                alt={`Preview ${tIdx + 1}`}
                                loading="lazy"
                              />
                            </div>
                          ))}
                        </div>

                        <div className="video-hub-action">
                          <span>{t("gallery.hub.explore")}</span>
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
                    {t("gallery.hub.backToCategories")}
                  </button>
                  <div className="video-category-pills">
                    {photographyData.map((cat) => {
                      const isCurrent = cat.id === activeCategory.id;
                      const title = isEn
                        ? cat.titleEn
                        : t(`gallery.categories.${cat.id}.title`, {
                            defaultValue: cat.title,
                          });
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          className={`video-pill${isCurrent ? " active" : ""}`}
                          onClick={() => handleSelectCategory(cat.id)}
                        >
                          {title}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="gallery-category-header">
                  <h2 className="video-category-title">
                    {isEn
                      ? activeCategory.titleEn
                      : t(`gallery.categories.${activeCategory.id}.title`, {
                          defaultValue: activeCategory.title,
                        })}
                  </h2>
                  <p className="video-category-desc">
                    {isEn
                      ? activeCategory.descEn
                      : t(`gallery.categories.${activeCategory.id}.desc`, {
                          defaultValue: activeCategory.desc,
                        })}
                  </p>
                </div>

                <div className="gallery-subcategories-list">
                  {activeCategory.subcategories.map((sub) => {
                    const subTitle = isEn ? sub.titleEn : sub.title;
                    const subDesc = isEn ? sub.descEn : sub.desc;

                    return (
                      <div key={sub.id} className="gallery-subcategory-section">
                        <div className="gallery-sub-header">
                          <div className="gallery-sub-title-row">
                            <h3 className="gallery-sub-title">{subTitle}</h3>
                            <span className="gallery-sub-badge">
                              {sub.images.length} {isEn ? "HD Photos" : "Ảnh"}
                            </span>
                          </div>
                          {subDesc && (
                            <p className="gallery-sub-desc">{subDesc}</p>
                          )}
                        </div>

                        <div className="gallery-photo-grid">
                          {sub.images.map((img, imgIdx) => {
                            const imgTitle = isEn ? img.titleEn : img.title;

                            return (
                              <figure
                                key={imgIdx}
                                className={`gallery-photo-card card-${imgIdx}`}
                                onClick={() =>
                                  setLightbox({ subcategory: sub, index: imgIdx })
                                }
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    setLightbox({
                                      subcategory: sub,
                                      index: imgIdx,
                                    });
                                  }
                                }}
                              >
                                <div className="gallery-photo-img-wrap">
                                  <img
                                    src={img.url}
                                    alt={imgTitle}
                                    loading="lazy"
                                    decoding="async"
                                    className="gallery-photo-img"
                                  />
                                  <div className="gallery-photo-overlay">
                                    <div className="gallery-photo-zoom-icon">
                                      <svg
                                        viewBox="0 0 24 24"
                                        width="18"
                                        height="18"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <circle cx="11" cy="11" r="8" />
                                        <line
                                          x1="21"
                                          y1="21"
                                          x2="16.65"
                                          y2="16.65"
                                        />
                                        <line x1="11" y1="8" x2="11" y2="14" />
                                        <line x1="8" y1="11" x2="14" y2="11" />
                                      </svg>
                                    </div>
                                    <figcaption className="gallery-photo-caption">
                                      <span className="gallery-photo-badge">
                                        {imgIdx + 1} / {sub.images.length}
                                      </span>
                                      <span className="gallery-photo-title">
                                        {imgTitle}
                                      </span>
                                    </figcaption>
                                  </div>
                                </div>
                              </figure>
                            );
                          })}
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

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="gallery-lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="gallery-lightbox-container"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="gallery-lightbox-close"
                onClick={() => setLightbox(null)}
                aria-label={t("gallery.lightbox.close", {
                  defaultValue: "Đóng",
                })}
              >
                ✕
              </button>

              <button
                type="button"
                className="gallery-lightbox-nav prev"
                onClick={() => {
                  const total = lightbox.subcategory.images.length;
                  setLightbox((prev) => ({
                    ...prev,
                    index: (prev.index - 1 + total) % total,
                  }));
                }}
                aria-label={t("gallery.lightbox.prev", {
                  defaultValue: "Ảnh trước",
                })}
              >
                &#10094;
              </button>

              <div className="gallery-lightbox-img-wrap">
                <motion.img
                  key={lightbox.subcategory.images[lightbox.index].url}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  src={lightbox.subcategory.images[lightbox.index].url}
                  alt={
                    isEn
                      ? lightbox.subcategory.images[lightbox.index].titleEn
                      : lightbox.subcategory.images[lightbox.index].title
                  }
                  className="gallery-lightbox-img"
                />
              </div>

              <button
                type="button"
                className="gallery-lightbox-nav next"
                onClick={() => {
                  const total = lightbox.subcategory.images.length;
                  setLightbox((prev) => ({
                    ...prev,
                    index: (prev.index + 1) % total,
                  }));
                }}
                aria-label={t("gallery.lightbox.next", {
                  defaultValue: "Ảnh tiếp theo",
                })}
              >
                &#10095;
              </button>

              <div className="gallery-lightbox-caption">
                <div className="gallery-lightbox-meta">
                  <span className="gallery-lightbox-sub-title">
                    {isEn
                      ? lightbox.subcategory.titleEn
                      : lightbox.subcategory.title}
                  </span>
                  <span className="gallery-lightbox-counter">
                    {lightbox.index + 1} / {lightbox.subcategory.images.length}
                  </span>
                </div>
                <h4 className="gallery-lightbox-img-title">
                  {isEn
                    ? lightbox.subcategory.images[lightbox.index].titleEn
                    : lightbox.subcategory.images[lightbox.index].title}
                </h4>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const VIDEO_BASE_URL = "https://pub-c58cdc739b3e41f093d0676c704c7618.r2.dev";

function VideoCard({ src, vertical = false, eager = false }) {
  const fullSrc = src.startsWith("http") ? src : `${VIDEO_BASE_URL}${src}`;
  const posterSrc = src.startsWith("http") ? undefined : `${fullSrc}.jpg`;

  const plyrOptions = {
    controls: [
      "play-large",
      "play",
      "progress",
      "current-time",
      "mute",
      "volume",
      "fullscreen",
      "settings",
    ],
    settings: ["speed"],
    hideControls: true,
    fullscreen: { enabled: true, fallback: true, iosNative: true },
  };

  return (
    <article
      className={`card video-card${vertical ? " video-card-vertical" : ""} not-played`}
    >
      <Plyr
        source={{
          type: "video",
          sources: [{ src: fullSrc, type: "video/mp4" }],
          poster: posterSrc,
        }}
        options={plyrOptions}
      />
    </article>
  );
}

const categoryIcons = {
  tvc: (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  short: (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" />
    </svg>
  ),
  recap: (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
};

function VideoContent() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const activeCategory = videoData.find((c) => c.id === categoryParam) || null;

  useEffect(() => {
    const handlePlay = (e) => {
      const target = e.target;
      if (target && target.tagName === "VIDEO") {
        const card = target.closest(".video-card");
        if (card) {
          card.classList.add("has-played");
          card.classList.remove("not-played");
        }
      }
    };

    document.addEventListener("play", handlePlay, true);
    document.addEventListener("playing", handlePlay, true);

    return () => {
      document.removeEventListener("play", handlePlay, true);
      document.removeEventListener("playing", handlePlay, true);
    };
  }, []);

  const handleSelectCategory = (catId) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("category", catId);
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToHub = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("category");
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
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
                  <p className="video-hub-desc">{t("video.hub.subtitle")}</p>
                </div>
                <div className="video-hub-grid">
                  {videoData.map((category) => {
                    const catTitle = t(
                      `video.categories.${category.id}.title`,
                      { defaultValue: category.title },
                    );
                    const catDesc = t(`video.categories.${category.id}.desc`, {
                      defaultValue: category.desc,
                    });
                    const projectCount = category.projects.length;
                    const videoCount = category.projects.reduce(
                      (sum, p) => sum + p.videos.length,
                      0,
                    );

                    return (
                      <article
                        key={category.id}
                        className="video-hub-card"
                        onClick={() => handleSelectCategory(category.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
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
                            {t("video.hub.projectsCount", {
                              count: projectCount,
                            })}{" "}
                            •{" "}
                            {t("video.hub.videosCount", { count: videoCount })}
                          </span>
                        </div>
                        <h3>{catTitle}</h3>
                        <p>{catDesc}</p>
                        <div className="video-hub-action">
                          <span>{t("video.hub.explore")}</span>
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
                    {t("video.hub.backToCategories")}
                  </button>
                  <div className="video-category-pills">
                    {videoData.map((cat) => {
                      const isCurrent = cat.id === activeCategory.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          className={`video-pill${isCurrent ? " active" : ""}`}
                          onClick={() => handleSelectCategory(cat.id)}
                        >
                          {t(`video.categories.${cat.id}.title`, {
                            defaultValue: cat.title,
                          })}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="video-category">
                  <h2 className="video-category-title">
                    {t(`video.categories.${activeCategory.id}.title`, {
                      defaultValue: activeCategory.title,
                    })}
                  </h2>
                  <p className="video-category-desc">
                    {t(`video.categories.${activeCategory.id}.desc`, {
                      defaultValue: activeCategory.desc,
                    })}
                  </p>

                  {activeCategory.projects.map((project, pIdx) => {
                    const isVertical = activeCategory.isVertical;
                    const isGrid = project.videos.length > 1;
                    let containerClass = "video-featured";
                    if (isVertical)
                      containerClass = "video-grid video-grid-vertical";
                    else if (isGrid) containerClass = "video-grid";

                    return (
                      <div key={pIdx}>
                        <h3 className="video-project-title">{project.title}</h3>
                        <div className={containerClass}>
                          {project.videos.map((src, vIdx) => (
                            <VideoCard
                              key={vIdx}
                              src={encodeURI(src)}
                              vertical={isVertical}
                            />
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
            <h3>{t("video.serviceCards.card1Title")}</h3>
            <p>{t("video.serviceCards.card1Desc")}</p>
          </article>
          <article className="card">
            <h3>{t("video.serviceCards.card2Title")}</h3>
            <p>{t("video.serviceCards.card2Desc")}</p>
          </article>
          <article className="card">
            <h3>{t("video.serviceCards.card3Title")}</h3>
            <p>{t("video.serviceCards.card3Desc")}</p>
          </article>
        </div>
      </section>
    </>
  );
}

function ProjectsPage({ initialTab = "video" }) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  let activeTab = initialTab;
  if (location.pathname === "/gallery") {
    activeTab = "gallery";
  } else if (location.pathname === "/video") {
    activeTab = "video";
  } else {
    activeTab = searchParams.get("tab") === "gallery" ? "gallery" : "video";
  }

  const handleTabChange = (newTab) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("tab", newTab);
      if (newTab === "gallery") {
        next.delete("category");
      }
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="page-main">
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">{t("projects.eyebrow")}</p>
          <h1>
            {activeTab === "gallery" ? t("gallery.title") : t("video.title")}
          </h1>
          <div className="projects-tab-wrap">
            <div
              className="projects-tab-bar"
              role="tablist"
              aria-label={t("projects.eyebrow")}
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "video"}
                className={`projects-tab-btn${activeTab === "video" ? " active" : ""}`}
                onClick={() => handleTabChange("video")}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
                <span>{t("nav.video")}</span>
                {activeTab === "video" && (
                  <motion.div
                    layoutId="projects-tab-indicator"
                    className="projects-tab-indicator"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "gallery"}
                className={`projects-tab-btn${activeTab === "gallery" ? " active" : ""}`}
                onClick={() => handleTabChange("gallery")}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span>{t("nav.gallery")}</span>
                {activeTab === "gallery" && (
                  <motion.div
                    layoutId="projects-tab-indicator"
                    className="projects-tab-indicator"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {activeTab === "gallery" ? (
          <motion.div
            key="gallery-content"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <GalleryContent />
          </motion.div>
        ) : (
          <motion.div
            key="video-content"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <VideoContent />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function GalleryPage() {
  return <ProjectsPage initialTab="gallery" />;
}

function VideoPage() {
  return <ProjectsPage initialTab="video" />;
}

function ContactPage() {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const submission = useRef({
    key:
      window.crypto && window.crypto.randomUUID
        ? window.crypto.randomUUID()
        : Math.random().toString(36).substring(2),
    details: null,
  });

  async function submitContact(event) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    const form = event.currentTarget;
    const details = Object.fromEntries(new FormData(form).entries());
    if (
      submission.current.details &&
      JSON.stringify(submission.current.details) !== JSON.stringify(details)
    ) {
      submission.current = {
        key:
          window.crypto && window.crypto.randomUUID
            ? window.crypto.randomUUID()
            : Math.random().toString(36).substring(2),
        details: null,
      };
    }
    submission.current.details = details;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": submission.current.key,
        },
        body: JSON.stringify(details),
      });
      const result = await response.json();
      if (!response.ok) {
        setFeedback({
          type: "error",
          key:
            result.errorKey ||
            (result.missing?.length
              ? "contact.errorMissing"
              : !result.error
                ? "contact.errorFail"
                : null),
          fallback: result.error || "",
          missing: result.missing,
          destinations: result.failedDestinations,
        });
        return;
      }
      form.reset();
      submission.current = {
        key:
          window.crypto && window.crypto.randomUUID
            ? window.crypto.randomUUID()
            : Math.random().toString(36).substring(2),
        details: null,
      };
      setFeedback({
        type: "success",
        key: result.messageKey || "contact.success",
        warning: Boolean(result.confirmationWarning),
        fallback: result.message || "",
      });
    } catch {
      setFeedback({ type: "error", key: "contact.errorConnect" });
    } finally {
      setSubmitting(false);
    }
  }

  const getFeedbackMessage = () => {
    if (!feedback) return "";
    if (feedback.key) {
      let msg = t(feedback.key, {
        defaultValue: feedback.fallback || "",
        destinations: feedback.destinations || "",
      });
      if (feedback.warning) {
        msg += ` ${t("contact.successWarn")}`;
      }
      if (feedback.missing && feedback.missing.length > 0) {
        msg += `: ${feedback.missing.join(", ")}.`;
      }
      return msg;
    }
    return feedback.fallback || "";
  };

  return (
    <main className="page-main">
      <PageHero
        eyebrow={t("contact.heroEyebrow")}
        title={t("contact.heroTitle")}
      >
        <p>{t("contact.heroDesc")}</p>
      </PageHero>
      <section className="section contact-section">
        <div className="container contact-grid">
          <div className="contact-card contact-form-card">
            <div className="section-heading">
              <p className="eyebrow">{t("contact.formEyebrow")}</p>
              <h2>{t("contact.formTitle")}</h2>
            </div>
            <form className="contact-form" onSubmit={submitContact}>
              <label>
                {t("contact.name")}
                <input
                  name="name"
                  type="text"
                  placeholder={t("contact.namePlaceholder")}
                  autoComplete="name"
                  maxLength={100}
                  required
                />
              </label>
              <label>
                {t("contact.phone")}
                <input
                  name="phone"
                  type="tel"
                  placeholder={t("contact.phonePlaceholder")}
                  autoComplete="tel"
                  maxLength={30}
                  required
                />
              </label>
              <label>
                {t("contact.email")}
                <input
                  name="email"
                  type="email"
                  placeholder={t("contact.emailPlaceholder")}
                  autoComplete="email"
                  maxLength={254}
                  required
                />
              </label>
              <label>
                {t("contact.message")}
                <textarea
                  name="message"
                  rows="5"
                  placeholder={t("contact.messagePlaceholder")}
                  maxLength={3000}
                  required
                />
              </label>
              <div className="contact-honeypot" aria-hidden="true">
                <label>
                  {t("contact.honeypot")}
                  <input
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? t("contact.submitting") : t("contact.submit")}
              </button>
              {feedback && (
                <p
                  className={`form-feedback ${feedback.type}`}
                  role="status"
                  aria-live="polite"
                >
                  {getFeedbackMessage()}
                </p>
              )}
            </form>
          </div>
          <div className="contact-card contact-info-card">
            <div className="section-heading">
              <p className="eyebrow">{t("contact.infoEyebrow")}</p>
              <h2>{t("contact.infoTitle")}</h2>
            </div>
            <div className="contact-meta">
              <div>
                <strong>{t("contact.address")}</strong>
                <p>{t("contact.addressVal")}</p>
              </div>
              <div>
                <strong>{t("contact.hotline")}</strong>
                <p>093 599 71 74</p>
              </div>
              <div>
                <strong>{t("contact.emailLabel")}</strong>
                <p>admin@noreagency.com</p>
              </div>
            </div>
            <div className="social-links contact-social">
              <a
                href="https://zalo.me/0935997174"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                Zalo
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61550981890739"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                Facebook
              </a>
              <a
                href="https://www.instagram.com/noreagencymedia/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
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
      <PageHero eyebrow={t("notFound.eyebrow")} title={t("notFound.title")}>
        <p>
          <Link className="text-link" to="/">
            {t("notFound.backHome")}
          </Link>
        </p>
      </PageHero>
    </main>
  );
}

const pageComponents = {
  home: HomePage,
  about: AboutPage,
  services: ServicesPage,
  projects: ProjectsPage,
  gallery: GalleryPage,
  video: VideoPage,
  contact: ContactPage,
  "not-found": NotFoundPage,
};

export default function App() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const activePage = currentPage(location.pathname);

  useEffect(() => {
    const titleKey = activePage === "not-found" ? "notFound" : activePage;
    document.title = t(`site.pageTitles.${titleKey}`, {
      defaultValue: "NORE MEDIA",
    });
  }, [activePage, t, i18n.language]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    const observeElements = () => {
      const elements = document.querySelectorAll(
        ".reveal-up, .reveal-left, .reveal-right, .reveal-zoom, .card-grid, .gallery-grid, .video-grid, .contact-grid",
      );
      elements.forEach((el) => {
        if (!el.classList.contains("reveal-active")) {
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

      <Footer showSocial={activePage === "home"} />
    </>
  );
}
