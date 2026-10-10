import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  vi: {
    translation: {
      site: {
        title: "NORE MEDIA",
        tagline: "Navigate - Optimize - Result - Empower",
        copyright: "© 2026 NORE MEDIA. Bản quyền thuộc về NORE MEDIA.",
        pageTitles: {
          home: "NORE MEDIA",
          about: "Về Chúng Tôi | NORE MEDIA",
          services: "Dịch Vụ | NORE MEDIA",
          projects: "Dự Án | NORE MEDIA",
          gallery: "Hình Ảnh | NORE MEDIA",
          video: "Video | NORE MEDIA",
          contact: "Liên Hệ | NORE MEDIA",
          notFound: "Không tìm thấy trang | NORE MEDIA",
        },
      },
      nav: {
        home: "Trang Chủ",
        about: "Về Chúng Tôi",
        services: "Dịch Vụ",
        projects: "Dự Án",
        gallery: "Hình Ảnh",
        video: "Video",
        contact: "Liên Hệ",
        mainAria: "Điều hướng chính",
        langSwitchTitle: "Đổi ngôn ngữ (Change Language)",
        openMenu: "Mở menu",
        closeMenu: "Đóng menu",
      },
      home: {
        heroDesc:
          'NORE MEDIA là Creative House hàng đầu, tiên phong kết nối giữa sản xuất hình ảnh thương mại cao cấp và hệ thống Marketing bài bản. Chúng tôi không tạo ra những nội dung đại trà - chúng tôi kiến tạo "dấu ấn thị giác" khác biệt, được thiết kế riêng để nâng tầm các thương hiệu của bạn.',
        contactNow: "Liên hệ ngay",
        viewServices: "Xem dịch vụ",
        aboutEyebrow: "Về chúng tôi",
        aboutHeading: "Tạo dấu ấn bằng hình ảnh và câu chuyện",
        aboutDesc:
          "Với kinh nghiệm trong lĩnh vực truyền thông và sản xuất nội dung, NORE MEDIA luôn đặt sự chân thật, chuyên nghiệp và sáng tạo lên hàng đầu.",
        learnMore: "Tìm hiểu thêm",
        servicesEyebrow: "Dịch vụ",
        servicesHeading: "Giải pháp truyền thông toàn diện",
        service1Title: "Quay phim sự kiện",
        service1Desc:
          "Ghi lại những khoảnh khắc đáng nhớ với phong cách chuyên nghiệp.",
        service2Title: "Chụp ảnh thương hiệu",
        service2Desc:
          "Hình ảnh sắc nét, đúng bản sắc doanh nghiệp và sản phẩm.",
        service3Title: "Dựng video quảng cáo",
        service3Desc:
          "Tạo nội dung ngắn, thu hút và tối ưu cho các nền tảng số.",
        galleryEyebrow: "Hình ảnh nổi bật",
        galleryHeading: "Một số tác phẩm gần đây",
        gallerySubtitle:
          "Tuyển chọn các tác phẩm nhiếp ảnh thương mại, thương hiệu và nghệ thuật cá nhân tiêu biểu của NORE MEDIA.",
        filterAll: "Tất cả",
        viewMoreGallery: "Xem tất cả 45 tác phẩm nhiếp ảnh",
        zoomAria: "Phóng to tác phẩm {{title}}",
        altWork: "Tác phẩm {{title}}",
        modalAlt: "Tác phẩm NORE MEDIA",
        closeModal: "Đóng ảnh",
        modalAria: "Ảnh phóng to",
      },
      about: {
        eyebrow: "Về chúng tôi",
        heroTitle: "Chúng tôi tạo nội dung để doanh nghiệp bứt phá",
        heroP1:
          'NORE MEDIA là Creative House hàng đầu, tiên phong kết nối giữa sản xuất hình ảnh thương mại cao cấp và hệ thống Marketing bài bản. Chúng tôi không tạo ra những nội dung đại trà - chúng tôi kiến tạo "dấu ấn thị giác" khác biệt, được thiết kế riêng để nâng tầm các thương hiệu của bạn.',
        heroP2:
          "Bằng việc tinh gọn và đảm nhận trọn vẹn từng giai đoạn của chiến dịch - từ lập kế hoạch chiến lược, sản xuất chất lượng cinema đến thực thi đa kênh - NORE MEDIA loại bỏ triệt để rủi ro đứt gãy vận hành vốn có khi làm việc với nhiều cá nhân tự do hoặc các agency kiểu cũ. Chúng tôi chuyển hóa sức mạnh sáng tạo thành bộ máy tạo đà tăng trưởng doanh thu bền vững.",
        visionTitle: "VISION",
        visionDesc:
          "Khao khát lớn nhất của chúng tôi là trở thành Creative House hàng đầu tại Việt Nam - nơi định hình vị thế bằng những dấu ấn thị giác độc bản và hệ thống tăng trưởng đo lường được cho các thương hiệu tầm trung và lớn.",
        missionTitle: "MISSION",
        missionDesc:
          "Để hiện thực hóa điều đó, chúng tôi cam kết đồng hành cùng các thương hiệu bằng sản xuất hình ảnh thương mại chuẩn thẩm mỹ cao kết hợp hệ thống Marketing bài bản - biến từng sản phẩm sáng tạo thành động cơ tăng trưởng doanh thu.",
      },
      services: {
        eyebrow: "Dịch vụ của chúng tôi",
        title: "GIẢI PHÁP DỊCH VỤ",

        cta: "TƯ VẤN DỊCH VỤ",

        packages: {
          marketing: {
            name: "MARKETING & BRANDING",
            intro: "Xây dựng từ chiến lược đến vận hành và phát triển",

            features: [
              "Nghiên cứu & định hướng thương hiệu",
              "Xây dựng chiến lược Marketing & Branding",
              "Xây dựng hệ thống Content & Social Media",
              "Xây dựng và phát triển các kênh truyền thông",
              "Triển khai Campaign & Digital Marketing",
              "Theo dõi, đo lường và tối ưu hiệu quả",
            ],
          },

          production: {
            name: "PHOTO & VIDEO PRODUCTION",
            intro: "Sản xuất hình ảnh và nội dung thương hiệu",

            features: [
              "Concept & Creative Direction",
              "Chụp ảnh sản phẩm, thương hiệu, lifestyle",
              "Quay dựng TVC / Brand Film",
              "Quay dựng Event / Recap",
              "Sản xuất Short-form Video",
              "Hậu kỳ, Retouch & Motion",
            ],
          },

          event: {
            name: "EVENT MANAGEMENT",
            intro: "Tổ chức và triển khai sự kiện",

            features: [
              "Event Concept & Planning",
              "Kịch bản & Production",
              "Booking nhân sự, đối tác & nhà cung cấp",
              "Setup sân khấu, âm thanh, ánh sáng, decor",
              "Điều phối & vận hành sự kiện",
              "Quản lý toàn bộ quá trình trước – trong – sau Event",
            ],
          },
        },
      },
      projects: {
        eyebrow: "Dự Án",
        title: "Projects Showcase",
        tabVideo: "Video Production",
        tabGallery: "Image Production",
      },
      gallery: {
        eyebrow: "Hình ảnh",
        title: "Image Production",
        hub: {
          subtitle:
            "Khám phá các bộ sưu tập nhiếp ảnh thương mại, thương hiệu và nghệ thuật của NORE MEDIA",
          explore: "Khám phá bộ sưu tập",
          backToCategories: "← Tất cả danh mục",
          collectionsCount_one: "{{count}} bộ sưu tập",
          collectionsCount_other: "{{count}} bộ sưu tập",
          photosCount_one: "{{count}} hình ảnh",
          photosCount_other: "{{count}} hình ảnh",
          photosPerCollection: "{{count}} ảnh / bộ",
        },
        lightbox: {
          close: "Đóng (Esc)",
          prev: "Ảnh trước",
          next: "Ảnh tiếp theo",
          photoCount: "Ảnh {{current}} / {{total}}",
        },
        categories: {
          product: {
            title: "Product (Sản phẩm)",
            desc: "Nhiếp ảnh sản phẩm thương mại, bao bì cao cấp tĩnh vật và nghệ thuật ẩm thực F&B.",
          },
          brand: {
            title: "Brand (Thương hiệu)",
            desc: "Nhiếp ảnh kiến trúc không gian khách sạn, resort 5 sao và sự kiện kích hoạt thương hiệu.",
          },
          personal: {
            title: "Cá nhân (Chân dung & Lookbook)",
            desc: "Nhiếp ảnh chân dung nghệ thuật cổ phong di sản, dạ hội Haute Couture và lookbook Y2K.",
          },
        },
      },
      video: {
        eyebrow: "Video",
        title: "Video Production",
        hub: {
          subtitle:
            "Chọn danh mục để khám phá các dự án video được thiết kế riêng của chúng tôi",
          explore: "Khám phá dự án",
          backToCategories: "← Tất cả danh mục",
          projectsCount_one: "{{count}} dự án",
          projectsCount_other: "{{count}} dự án",
          videosCount_one: "{{count}} video",
          videosCount_other: "{{count}} video",
        },
        categories: {
          tvc: {
            title: "TVC Doanh Nghiệp",
            desc: "Các dự án quảng cáo, giới thiệu doanh nghiệp tiêu biểu",
          },
          short: {
            title: "Short-video Content",
            desc: "Nội dung ngắn tối ưu cho TikTok, Reels, Shorts",
          },
          recap: {
            title: "Recap Event",
            desc: "Ghi lại những khoảnh khắc đáng nhớ của các sự kiện",
          },
        },
        serviceCards: {
          card1Title: "Video ngắn viral",
          card1Desc:
            "Thiết kế nội dung ngắn, sáng tạo và tối ưu cho Facebook, TikTok, Instagram.",
          card2Title: "Video sự kiện",
          card2Desc:
            "Ghi lại toàn bộ trải nghiệm và cảm xúc của mỗi sự kiện một cách chân thực.",
          card3Title: "Video quảng cáo",
          card3Desc:
            "Biến sản phẩm và dịch vụ thành câu chuyện thu hút khách hàng.",
        },
      },
      contact: {
        heroEyebrow: "Liên hệ",
        heroTitle: "Gửi thông tin hoặc liên hệ trực tiếp với NORE",
        heroDesc:
          "Chúng tôi sẵn sàng tư vấn dịch vụ hình ảnh, video và truyền thông theo nhu cầu của bạn.",
        formEyebrow: "Gửi thông tin",
        formTitle: "Chúng tôi sẽ phản hồi nhanh nhất có thể",
        name: "Họ và tên",
        namePlaceholder: "Nhập họ tên của bạn",
        phone: "Số điện thoại",
        phonePlaceholder: "Nhập số điện thoại",
        email: "Email",
        emailPlaceholder: "Nhập email",
        message: "Tin nhắn",
        messagePlaceholder: "Nói cho chúng tôi biết nhu cầu của bạn",
        honeypot: "Để trống trường này",
        submitting: "Đang gửi...",
        submit: "Gửi thông tin",
        infoEyebrow: "Thông tin",
        infoTitle: "Liên hệ trực tiếp",
        address: "Địa chỉ",
        addressVal: "TP. Hồ Chí Minh, Việt Nam",
        hotline: "Hotline",
        emailLabel: "Email",
        errorMissing: "Thiếu cấu hình máy chủ",
        errorFail: "Không thể gửi thông tin. Vui lòng thử lại.",
        errorConnect: "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.",
        errorRateLimit:
          "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 15 phút.",
        errorDelivery:
          "Chưa thể hoàn tất gửi thông tin đến {{destinations}} sau nhiều lần thử. Vui lòng thử lại sau.",
        successWarn:
          "Tuy nhiên, email xác nhận chưa gửi được; vui lòng kiểm tra hộp thư sau.",
        success:
          "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.",
      },
      notFound: {
        eyebrow: "404",
        title: "Không tìm thấy trang",
        backHome: "Quay về Trang Chủ",
      },
    },
  },
  en: {
    translation: {
      site: {
        title: "NORE MEDIA",
        tagline: "Navigate - Optimize - Result - Empower",
        copyright: "© 2026 NORE MEDIA. All rights reserved.",
        pageTitles: {
          home: "NORE MEDIA",
          about: "About Us | NORE MEDIA",
          services: "Services | NORE MEDIA",
          projects: "Projects | NORE MEDIA",
          gallery: "Photography | NORE MEDIA",
          video: "Video | NORE MEDIA",
          contact: "Contact | NORE MEDIA",
          notFound: "Page Not Found | NORE MEDIA",
        },
      },
      nav: {
        home: "Home",
        about: "About Us",
        services: "Services",
        projects: "Projects",
        gallery: "Photography",
        video: "Video",
        contact: "Contact",
        mainAria: "Main navigation",
        langSwitchTitle: "Change Language",
        openMenu: "Open menu",
        closeMenu: "Close menu",
      },
      home: {
        heroDesc:
          'NORE MEDIA is a premier Creative House, pioneering the synergy between premium commercial visual production and systematic marketing frameworks. We do not produce generic content - we craft distinct "visual signatures" uniquely tailored to elevate your brand.',
        contactNow: "Contact Us",
        viewServices: "View Services",
        aboutEyebrow: "About Us",
        aboutHeading: "Making an Impression Through Imagery and Storytelling",
        aboutDesc:
          "With rich experience in digital media and content production, NORE MEDIA always places authenticity, professionalism, and creativity at the forefront.",
        learnMore: "Learn More",
        servicesEyebrow: "Services",
        servicesHeading: "Comprehensive Media Solutions",
        service1Title: "Event Videography",
        service1Desc:
          "Capturing unforgettable moments with distinct professionalism and flair.",
        service2Title: "Brand Photography",
        service2Desc:
          "Sharp, vibrant imagery reflecting genuine corporate identity and products.",
        service3Title: "Commercial Video Editing",
        service3Desc:
          "Creating engaging, high-retention short-form content optimized for digital platforms.",
        galleryEyebrow: "Featured Works",
        galleryHeading: "Recent Works Showcase",
        gallerySubtitle:
          "Curated commercial product, brand space, and artistic portrait photography from NORE MEDIA.",
        filterAll: "All",
        viewMoreGallery: "Explore All 45 Photography Works",
        zoomAria: "Enlarge artwork {{title}}",
        altWork: "Artwork {{title}}",
        modalAlt: "NORE MEDIA Artwork",
        closeModal: "Close image",
        modalAria: "Enlarged image",
      },
      about: {
        eyebrow: "About Us",
        heroTitle:
          "We Create Content That Empowers Businesses to Break Through",
        heroP1:
          'NORE MEDIA is a premier Creative House, pioneering the synergy between premium commercial visual production and systematic marketing frameworks. We do not produce generic content - we craft distinct "visual signatures" uniquely tailored to elevate your brand.',
        heroP2:
          "By streamlining and overseeing every campaign phase - from strategic planning and cinema-grade production to multi-channel execution - NORE MEDIA completely eliminates operational bottlenecks common with fragmented freelancers or legacy agencies. We transform creative power into a sustainable revenue-driving engine.",
        visionTitle: "VISION",
        visionDesc:
          "Our highest ambition is to become Vietnam's leading Creative House - defining prestige through bespoke visual signatures and quantifiable growth frameworks for medium-to-enterprise brands.",
        missionTitle: "MISSION",
        missionDesc:
          "To realize this vision, we partner with brands through aesthetic commercial imagery combined with rigorous marketing systems - turning every creative output into a direct engine for sustainable revenue growth.",
      },
      services: {
        eyebrow: "Our Services",
        title: "OUR SERVICES",

        cta: "GET CONSULTATION",

        packages: {
          marketing: {
            name: "MARKETING & BRANDING",
            intro: "From strategy to execution and sustainable growth",

            features: [
              "Brand Research & Positioning",
              "Marketing & Branding Strategy Development",
              "Content & Social Media System Development",
              "Media Channel Development & Management",
              "Campaign & Digital Marketing Execution",
              "Performance Tracking, Measurement & Optimization",
            ],
          },

          production: {
            name: "PHOTO & VIDEO PRODUCTION",
            intro: "Visual production and branded content creation",

            features: [
              "Concept & Creative Direction",
              "Product, Brand & Lifestyle Photography",
              "TVC & Brand Film Production",
              "Event Filming & Recap Videos",
              "Short-form Video Production",
              "Post-production, Retouching & Motion Graphics",
            ],
          },

          event: {
            name: "EVENT MANAGEMENT",
            intro: "End-to-end event planning and execution",

            features: [
              "Event Concept & Planning",
              "Event Scripting & Production",
              "Talent, Partner & Vendor Booking",
              "Stage, Sound, Lighting & Décor Setup",
              "Event Coordination & Operations",
              "Pre-event, On-site & Post-event Management",
            ],
          },
        },
      },
      projects: {
        eyebrow: "Projects",
        title: "Projects Showcase",
        tabVideo: "Video Production",
        tabGallery: "Image Production",
      },
      gallery: {
        eyebrow: "Photography",
        title: "Image Production",
        hub: {
          subtitle:
            "Explore our curated commercial product, brand spaces, and fine art photography collections",
          explore: "Explore Collection",
          backToCategories: "← All Categories",
          collectionsCount_one: "{{count}} collection",
          collectionsCount_other: "{{count}} collections",
          photosCount_one: "{{count}} photo",
          photosCount_other: "{{count}} photos",
          photosPerCollection: "{{count}} photos / set",
        },
        lightbox: {
          close: "Close (Esc)",
          prev: "Previous Photo",
          next: "Next Photo",
          photoCount: "Photo {{current}} / {{total}}",
        },
        categories: {
          product: {
            title: "Product",
            desc: "Commercial product photography, luxury packaging, still life and culinary fine dining.",
          },
          brand: {
            title: "Brand",
            desc: "Architecture, 5-star hotel & resort hospitality spaces, and brand activation events.",
          },
          personal: {
            title: "Personal (Portrait & Lookbook)",
            desc: "Heritage fine art portraits, haute couture evening gowns and Y2K streetwear lookbook.",
          },
        },
      },
      video: {
        eyebrow: "Video",
        title: "Video Production",
        hub: {
          subtitle:
            "Select a category to explore our featured bespoke video projects",
          explore: "Explore Projects",
          backToCategories: "← All Categories",
          projectsCount_one: "{{count}} project",
          projectsCount_other: "{{count}} projects",
          videosCount_one: "{{count}} video",
          videosCount_other: "{{count}} videos",
        },
        categories: {
          tvc: {
            title: "Corporate TVC",
            desc: "Featured corporate brand films and high-impact commercial advertisements",
          },
          short: {
            title: "Short-video Content",
            desc: "Short-form visual storytelling optimized for TikTok, Reels, and Shorts",
          },
          recap: {
            title: "Event Recap",
            desc: "Capturing the vibrant energy and memorable highlights of premium events",
          },
        },
        serviceCards: {
          card1Title: "Viral Short Videos",
          card1Desc:
            "Creative short-form narratives optimized for maximum engagement on Facebook, TikTok, and Instagram.",
          card2Title: "Event Videos",
          card2Desc:
            "Capturing authentic emotions, atmosphere, and full event experiences with high fidelity.",
          card3Title: "Commercial Videos",
          card3Desc:
            "Transforming products and services into compelling stories that captivate your audience.",
        },
      },
      contact: {
        heroEyebrow: "Contact",
        heroTitle: "Send Us a Message or Reach Out Directly to NORE",
        heroDesc:
          "We are ready to consult on tailored image, video, and integrated media services designed for your goals.",
        formEyebrow: "Send Information",
        formTitle: "We Will Respond as Promptly as Possible",
        name: "Full Name",
        namePlaceholder: "Enter your full name",
        phone: "Phone Number",
        phonePlaceholder: "Enter your phone number",
        email: "Email",
        emailPlaceholder: "Enter your email",
        message: "Message",
        messagePlaceholder: "Tell us about your project requirements",
        honeypot: "Leave this field empty",
        submitting: "Sending...",
        submit: "Send Information",
        infoEyebrow: "Information",
        infoTitle: "Direct Contact",
        address: "Address",
        addressVal: "Ho Chi Minh City, Vietnam",
        hotline: "Hotline",
        emailLabel: "Email",
        errorMissing: "Missing server configuration",
        errorFail: "Could not send information. Please try again.",
        errorConnect: "Could not connect to the server. Please try later.",
        errorRateLimit: "Too many requests. Please try again after 15 minutes.",
        errorDelivery:
          "Could not complete delivery to {{destinations}} after multiple attempts. Please try again later.",
        successWarn:
          "However, the confirmation email could not be sent; please check your inbox later.",
        success:
          "Thank you for reaching out! We will get in touch with you as soon as possible.",
      },
      notFound: {
        eyebrow: "404",
        title: "Page Not Found",
        backHome: "Return to Homepage",
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "vi",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
