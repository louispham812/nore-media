import { useEffect, useRef, useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Plyr from 'plyr-react';
import 'plyr/dist/plyr.css';

const pages = [
  { path: '/', label: 'Trang Chủ', key: 'home' },
  { path: '/about.html', label: 'Về Chúng Tôi', key: 'about' },
  { path: '/services.html', label: 'Dịch Vụ', key: 'services' },
  { path: '/gallery.html', label: 'Hình Ảnh', key: 'gallery' },
  { path: '/video.html', label: 'Video', key: 'video' },
  { path: '/contact.html', label: 'Liên Hệ', key: 'contact' },
  // Also support clean URLs
  { path: '/index.html', label: 'Trang Chủ', key: 'home' },
];

function currentPage(pathname) {
  const file = pathname.split('/').pop();
  return pages.find((page) => page.path.endsWith(file || '/'))?.key ?? (pathname === '/' ? 'home' : 'not-found');
}

function Header({ activePage }) {
  const [menuOpen, setMenuOpen] = useState(false);

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
        <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Điều hướng chính">
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
                {page.label}
              </Link>
            );
          })}
        </nav>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
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
  return (
    <footer className="site-footer">
      <div className="container footer-wrap">
        <p>© 2026 NORE MEDIA. Bản quyền thuộc về NORE MEDIA.</p>
        {showSocial && (
          <div className="social-links">
            <a href="https://zalo.me/0935997174">Zalo</a>
            <a href="https://www.facebook.com/messages/t/61550981890739">Messenger</a>
            <a href="https://www.instagram.com/noreagencymedia/">Instagram</a>
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
              <p className="eyebrow">Navigate - Optimize - Result - Empower</p>
              <h1>NORE MEDIA</h1>
              <p>
                NORE MEDIA là Creative House hàng đầu, tiên phong kết nối giữa sản xuất hình ảnh thương mại cao
                cấp và hệ thống Marketing bài bản. Chúng tôi không tạo ra những nội dung đại trà - chúng tôi kiến
                tạo &quot;dấu ấn thị giác&quot; khác biệt, được thiết kế riêng để nâng tầm các thương hiệu của bạn.
              </p>
              <div className="actions">
                <Link to="/contact.html" className="btn btn-primary">Liên hệ ngay</Link>
                <Link to="/services.html" className="btn btn-secondary">Xem dịch vụ</Link>
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
              <p className="eyebrow">Về chúng tôi</p>
              <h2 style={{ whiteSpace: 'nowrap' }}>Tạo dấu ấn bằng hình ảnh và câu chuyện</h2>
            </div>
            <div className="about-preview">
              <p>
                Với kinh nghiệm trong lĩnh vực truyền thông và sản xuất nội dung, NORE MEDIA luôn đặt sự chân thật,
                chuyên nghiệp và sáng tạo lên hàng đầu.
              </p>
              <Link to="/about.html" className="text-link">Tìm hiểu thêm</Link>
            </div>
          </div>
        </section>

        <section className="section alt">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Dịch vụ</p>
              <h2>Giải pháp truyền thông toàn diện</h2>
            </div>
            <div className="card-grid">
              <article className="card">
                <h3>Quay phim sự kiện</h3>
                <p>Ghi lại những khoảnh khắc đáng nhớ với phong cách chuyên nghiệp.</p>
              </article>
              <article className="card">
                <h3>Chụp ảnh thương hiệu</h3>
                <p>Hình ảnh sắc nét, đúng bản sắc doanh nghiệp và sản phẩm.</p>
              </article>
              <article className="card">
                <h3>Dựng video quảng cáo</h3>
                <p>Tạo nội dung ngắn, thu hút và tối ưu cho các nền tảng số.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Hình ảnh nổi bật</p>
              <h2>Một số tác phẩm gần đây</h2>
            </div>
            <div className="gallery-grid">
              {[1, 3, 5, 6].map((number, index) => (
                <button
                  className="gallery-image-button"
                  type="button"
                  onClick={() => setImage(`/gallery/${number}.png`)}
                  aria-label={`Phóng to tác phẩm ${index + 1}`}
                  key={number}
                >
                  <img src={`/gallery/${number}.png`} alt={`Tác phẩm ${index + 1}`} />
                </button>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <Link to="/gallery.html" className="btn btn-secondary">Xem thêm hình ảnh</Link>
            </div>
          </div>
        </section>
      </main>
      {image && (
        <div
          className="modal show"
          role="dialog"
          aria-modal="true"
          aria-label="Ảnh phóng to"
          onClick={() => setImage(null)}
        >
          <button className="close-modal" type="button" aria-label="Đóng ảnh" onClick={() => setImage(null)}>
            &times;
          </button>
          <img
            className="modal-content"
            src={image}
            alt="Tác phẩm NORE MEDIA"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

function AboutPage() {
  return (
    <main className="page-main">
      <PageHero eyebrow="Về chúng tôi" title="Chúng tôi tạo nội dung để doanh nghiệp bứt phá">
        <p>
          NORE MEDIA là Creative House hàng đầu, tiên phong kết nối giữa sản xuất hình ảnh thương mại cao cấp và hệ
          thống Marketing bài bản. Chúng tôi không tạo ra những nội dung đại trà - chúng tôi kiến tạo &quot;dấu ấn
          thị giác&quot; khác biệt, được thiết kế riêng để nâng tầm các thương hiệu của bạn.
        </p>
        <p>
          Bằng việc tinh gọn và đảm nhận trọn vẹn từng giai đoạn của chiến dịch - từ lập kế hoạch chiến lược, sản
          xuất chất lượng cinema đến thực thi đa kênh - NORE MEDIA loại bỏ triệt để rủi ro đứt gãy vận hành vốn có
          khi làm việc với nhiều cá nhân tự do hoặc các agency kiểu cũ. Chúng tôi chuyển hóa sức mạnh sáng tạo
          thành bộ máy tạo đà tăng trưởng doanh thu bền vững.
        </p>
      </PageHero>
      <section className="section">
        <div className="container content-grid">
          <div>
            <h2>VISION</h2>
            <p>
              Khao khát lớn nhất của chúng tôi là trở thành Creative House hàng đầu tại Việt Nam - nơi định hình
              vị thế bằng những dấu ấn thị giác độc bản và hệ thống tăng trưởng đo lường được cho các thương hiệu
              tầm trung và lớn.
            </p>
          </div>
          <div>
            <h2>MISSION</h2>
            <p>
              Để hiện thực hóa điều đó, chúng tôi cam kết đồng hành cùng các thương hiệu bằng sản xuất hình ảnh
              thương mại chuẩn thẩm mỹ cao kết hợp hệ thống Marketing bài bản - biến từng sản phẩm sáng tạo thành
              động cơ tăng trưởng doanh thu.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

const servicePackages = [
  {
    name: 'SIGNATURE COMMERCIALS',
    popular: true,
    intro: 'Giải pháp trọn gói, toàn diện để sản xuất hình ảnh và video quảng cáo mang dấu ấn riêng biệt.',
    features: [
      ['Tư vấn Ý tưởng & Storyboard:', ' Trực tiếp phát triển ý tưởng và phác thảo kịch bản hình ảnh (animatic) chi tiết.'],
      ['Sản xuất In-house:', ' Đảm nhận toàn bộ từ bối cảnh, tuyển chọn diễn viên (talent casting) đến đạo diễn tại hiện trường.'],
      ['Tối ưu hóa nguồn lực:', ' Kết hợp chụp Key Visual (KV) đồng thời ngay trên set quay.'],
      ['Hậu kỳ chuyên sâu:', ' Chỉnh màu chuẩn điện ảnh (Cinematic color grading) và dựng đa định dạng phù hợp với mọi kênh truyền thông.'],
      ['Quản lý tập trung:', ' Có Nhà sản xuất (Producer) riêng theo sát tiến độ và làm việc trực tiếp với khách hàng.'],
    ],
  },
  {
    name: 'PREMIUM SHOWCASE',
    popular: false,
    intro: 'Giải pháp hình ảnh & TVC cao cấp, định hình đẳng cấp thương hiệu cho các chiến dịch lớn.',
    features: [
      ['Giám đốc Nghệ thuật (Art Direction):', ' Art Director trực tiếp dẫn dắt định hướng chiến dịch và thiết kế bối cảnh độc bản.'],
      ['Sản xuất Cao cấp:', ' Thiết bị chuẩn điện ảnh, quay đa bối cảnh cùng đội ngũ chuyên gia hàng đầu (stylist, makeup artist, gaffer).'],
      ['Quản lý Talent:', ' Đảm nhận trọn gói việc booking KOLs/Celebrities hạng A và bản quyền hình ảnh thương mại.'],
      ['Hậu kỳ Nâng cao:', ' Kỹ xảo, âm thanh bản quyền và chỉnh màu đạt tiêu chuẩn điện ảnh.'],
      ['Tích hợp IMC:', ' Chiến lược phân phối đa kênh tích hợp nhằm tiếp cận đúng công chúng mục tiêu và tối ưu hóa tỷ lệ chuyển đổi.'],
    ],
  },
];

function ServicesPage() {
  return (
    <main className="page-main">
      <PageHero eyebrow="Service Packages" title="Các Gói Dịch Vụ" />
      <section className="section">
        <div className="container card-grid service-grid">
          {servicePackages.map((service) => (
            <article className="card" key={service.name}>
              <div className={`service-heading${service.popular ? '' : ' service-heading-spaced'}`}>
                {service.popular && <span className="eyebrow">PHỔ BIẾN NHẤT</span>}
                <h2>{service.name}</h2>
              </div>
              <h3>Theo dự án (Project-based)</h3>
              <p className="service-intro">{service.intro}</p>
              <ul className="service-features">
                {service.features.map(([title, text]) => (
                  <li key={title}><strong>{title}</strong>{text}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function GalleryPage() {
  return (
    <main className="page-main">
      <PageHero eyebrow="Hình ảnh" title="Image Production" />
      <section className="section">
        <div className="container">
          <article className="card canva-card">
            <div className="canva-embed">
              <iframe
                loading="lazy"
                src="https://www.canva.com/design/DAHLPDs6pRA/GuwCRPCtD6C4RWzvfqj-4w/view?embed"
                title="NORE MEDIA - Image Production"
                allowFullScreen
                allow="fullscreen"
              />
            </div>
            <div className="canva-credit">
              <a
                href="https://www.canva.com/design/DAHLPDs6pRA/GuwCRPCtD6C4RWzvfqj-4w/view?utm_content=DAHLPDs6pRA&amp;utm_campaign=designshare&amp;utm_medium=embeds&amp;utm_source=link"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                Mở bản trình bày trên Canva
              </a>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

const VIDEO_BASE_URL = "https://pub-c58cdc739b3e41f093d0676c704c7618.r2.dev"; // e.g. "https://pub-c58cdc739b3e41f093d0676c704c7618.r2.dev"

function VideoCard({ src, vertical = false, eager = false }) {
  const fullSrc = src.startsWith('http') ? src : `${VIDEO_BASE_URL}${src}`;
  
  const plyrOptions = {
    controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen', 'settings'],
    settings: ['speed'],
    hideControls: true,
  };

  return (
    <article className={`card video-card${vertical ? ' video-card-vertical' : ''}`}>
      <Plyr
        source={{
          type: 'video',
          sources: [{ src: fullSrc, type: 'video/mp4' }]
        }}
        options={plyrOptions}
      />
    </article>
  );
}

function VideoPage() {
  return (
    <main className="page-main">
      <PageHero eyebrow="Video" title="Video Production" />
      <section className="section">
        <div className="container">
          <h2 className="video-project-title">Sunshine Beach Resort</h2>
          <div className="video-grid">
            {[1, 2, 3, 4].map((number) => (
              <VideoCard src={`/video/Sunshine/video-${number}.mp4`} key={number} />
            ))}
          </div>
          <h2 className="video-project-title">SGARZI LUIGI</h2>
          <div className="video-featured">
            <VideoCard src="/video/SGARZI-LUIGI.mp4" />
          </div>
          <h2 className="video-project-title">OTOD</h2>
          <div className="video-grid video-grid-vertical">
            {[1, 2, 3].map((number) => (
              <VideoCard src={`/video/OTOD/${number}.mp4#t=0.001`} vertical eager key={number} />
            ))}
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="container card-grid">
          <article className="card">
            <h3>Video ngắn viral</h3>
            <p>Thiết kế nội dung ngắn, sáng tạo và tối ưu cho Facebook, TikTok, Instagram.</p>
          </article>
          <article className="card">
            <h3>Video sự kiện</h3>
            <p>Ghi lại toàn bộ trải nghiệm và cảm xúc của mỗi sự kiện một cách chân thực.</p>
          </article>
          <article className="card">
            <h3>Video quảng cáo</h3>
            <p>Biến sản phẩm và dịch vụ thành câu chuyện thu hút khách hàng.</p>
          </article>
        </div>
      </section>
    </main>
  );
}

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const submission = useRef({ key: window.crypto.randomUUID(), details: null });

  async function submitContact(event) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback({ type: '', message: '' });
    const form = event.currentTarget;
    const details = Object.fromEntries(new FormData(form).entries());
    if (submission.current.details && JSON.stringify(submission.current.details) !== JSON.stringify(details)) {
      submission.current = { key: window.crypto.randomUUID(), details: null };
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
          ? ` Thiếu cấu hình máy chủ: ${result.missing.join(', ')}.`
          : '';
        setFeedback({
          type: 'error',
          message: `${result.error || 'Không thể gửi thông tin. Vui lòng thử lại.'}${missingSettings}`,
        });
        return;
      }
      form.reset();
      submission.current = { key: window.crypto.randomUUID(), details: null };
      setFeedback({
        type: 'success',
        message: result.confirmationWarning
          ? `${result.message} Tuy nhiên, email xác nhận chưa gửi được; vui lòng kiểm tra hộp thư sau.`
          : result.message,
      });
    } catch {
      setFeedback({ type: 'error', message: 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page-main">
      <PageHero eyebrow="Liên hệ" title="Gửi thông tin hoặc liên hệ trực tiếp với NORE">
        <p>Chúng tôi sẵn sàng tư vấn dịch vụ hình ảnh, video và truyền thông theo nhu cầu của bạn.</p>
      </PageHero>
      <section className="section contact-section">
        <div className="container contact-grid">
          <div className="contact-card contact-form-card">
            <div className="section-heading">
              <p className="eyebrow">Gửi thông tin</p>
              <h2>Chúng tôi sẽ phản hồi nhanh nhất có thể</h2>
            </div>
            <form className="contact-form" onSubmit={submitContact}>
              <label>
                Họ và tên
                <input name="name" type="text" placeholder="Nhập họ tên của bạn" autoComplete="name" maxLength={100} required />
              </label>
              <label>
                Số điện thoại
                <input name="phone" type="tel" placeholder="Nhập số điện thoại" autoComplete="tel" maxLength={30} required />
              </label>
              <label>
                Email
                <input name="email" type="email" placeholder="Nhập email" autoComplete="email" maxLength={254} required />
              </label>
              <label>
                Tin nhắn
                <textarea name="message" rows="5" placeholder="Nói cho chúng tôi biết nhu cầu của bạn" maxLength={3000} required />
              </label>
              <div className="contact-honeypot" aria-hidden="true">
                <label>
                  Để trống trường này
                  <input name="website" type="text" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Đang gửi...' : 'Gửi thông tin'}
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
              <p className="eyebrow">Thông tin</p>
              <h2>Liên hệ trực tiếp</h2>
            </div>
            <div className="contact-meta">
              <div>
                <strong>Địa chỉ</strong>
                <p>TP. Hồ Chí Minh, Việt Nam</p>
              </div>
              <div>
                <strong>Hotline</strong>
                <p>093 599 71 74</p>
              </div>
              <div>
                <strong>Email</strong>
                <p>admin@noreagency.com</p>
              </div>
            </div>
            <div className="social-links contact-social">
              <a href="https://zalo.me/0935997174">Zalo</a>
              <a href="https://www.facebook.com/profile.php?id=61550981890739">Facebook</a>
              <a href="https://www.instagram.com/noreagencymedia/">Instagram</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main className="page-main">
      <PageHero eyebrow="404" title="Không tìm thấy trang">
        <p><Link className="text-link" to="/index.html">Quay về Trang Chủ</Link></p>
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

const pageTitles = {
  home: 'NORE MEDIA',
  about: 'Về Chúng Tôi | NORE MEDIA',
  services: 'Dịch Vụ | NORE MEDIA',
  gallery: 'Hình Ảnh | NORE MEDIA',
  video: 'Video | NORE MEDIA',
  contact: 'Liên Hệ | NORE MEDIA',
  'not-found': 'Không tìm thấy trang | NORE MEDIA',
};

export default function App() {
  const location = useLocation();
  const activePage = currentPage(location.pathname);

  useEffect(() => {
    document.title = pageTitles[activePage];

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

    // Observer new elements as they are mounted by Framer Motion transitions
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    
    // Initial check
    observeElements();

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname]); // re-run when path changes

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
