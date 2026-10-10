import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  vi: {
    translation: {
      site: {
        title: "NORE MEDIA",
        tagline: "Navigate - Optimize - Result - Empower",
        copyright: "© 2026 NORE\u00A0MEDIA. Bản quyền thuộc về\u00A0NORE\u00A0MEDIA.",
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
          'NORE MEDIA là Creative House hàng\u00A0đầu, tiên\u00A0phong kết\u00A0nối giữa sản\u00A0xuất hình\u00A0ảnh thương\u00A0mại cao\u00A0cấp và hệ\u00A0thống Marketing bài\u00A0bản. Chúng tôi không tạo ra những nội\u00A0dung đại\u00A0trà\u00A0– chúng tôi kiến\u00A0tạo "dấu\u00A0ấn thị\u00A0giác" khác\u00A0biệt, được thiết\u00A0kế riêng để nâng\u00A0tầm các\u00A0thương\u00A0hiệu của\u00A0bạn.',
        contactNow: "Liên hệ ngay",
        viewServices: "Xem dịch vụ",
        aboutEyebrow: "Về chúng tôi",
        aboutHeading: "Tạo dấu\u00A0ấn bằng hình\u00A0ảnh và\u00A0câu\u00A0chuyện",
        aboutDesc:
          "Với kinh\u00A0nghiệm trong lĩnh\u00A0vực truyền\u00A0thông và sản\u00A0xuất nội\u00A0dung, NORE\u00A0MEDIA luôn đặt sự chân\u00A0thật, chuyên\u00A0nghiệp và sáng\u00A0tạo lên\u00A0hàng\u00A0đầu.",
        learnMore: "Tìm hiểu thêm",
        servicesEyebrow: "Dịch vụ",
        servicesHeading: "Giải\u00A0pháp truyền\u00A0thông toàn\u00A0diện",
        service1Title: "Quay\u00A0phim sự\u00A0kiện",
        service1Desc:
          "Ghi\u00A0lại những khoảnh\u00A0khắc đáng\u00A0nhớ với phong\u00A0cách chuyên\u00A0nghiệp.",
        service2Title: "Chụp\u00A0ảnh thương\u00A0hiệu",
        service2Desc:
          "Hình\u00A0ảnh sắc\u00A0nét, đúng bản\u00A0sắc doanh\u00A0nghiệp và\u00A0sản\u00A0phẩm.",
        service3Title: "Dựng\u00A0video quảng\u00A0cáo",
        service3Desc:
          "Tạo nội\u00A0dung ngắn, thu\u00A0hút và tối\u00A0ưu cho các\u00A0nền\u00A0tảng\u00A0số.",
        galleryEyebrow: "Hình ảnh nổi bật",
        galleryHeading: "Một số tác phẩm gần đây",
        gallerySubtitle:
          "Tuyển chọn các tác\u00A0phẩm nhiếp\u00A0ảnh thương\u00A0mại, thương\u00A0hiệu và nghệ\u00A0thuật cá\u00A0nhân tiêu\u00A0biểu của\u00A0NORE\u00A0MEDIA.",
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
        heroTitle: "Chúng tôi tạo nội\u00A0dung để doanh\u00A0nghiệp bứt\u00A0phá",
        heroP1:
          'NORE MEDIA là Creative House hàng\u00A0đầu, tiên\u00A0phong kết\u00A0nối giữa sản\u00A0xuất hình\u00A0ảnh thương\u00A0mại cao\u00A0cấp và hệ\u00A0thống Marketing bài\u00A0bản. Chúng tôi không tạo ra những nội\u00A0dung đại\u00A0trà\u00A0– chúng tôi kiến\u00A0tạo "dấu\u00A0ấn thị\u00A0giác" khác\u00A0biệt, được thiết\u00A0kế riêng để nâng\u00A0tầm các\u00A0thương\u00A0hiệu của\u00A0bạn.',
        heroP2:
          "Bằng việc tinh\u00A0gọn và đảm\u00A0nhận trọn\u00A0vẹn từng giai\u00A0đoạn của chiến\u00A0dịch – từ lập kế\u00A0hoạch chiến\u00A0lược, sản\u00A0xuất chất\u00A0lượng cinema đến thực\u00A0thi đa\u00A0kênh – NORE\u00A0MEDIA loại\u00A0bỏ triệt\u00A0để rủi\u00A0ro đứt\u00A0gãy vận\u00A0hành vốn\u00A0có khi làm\u00A0việc với nhiều cá\u00A0nhân tự\u00A0do hoặc các agency kiểu\u00A0cũ. Chúng tôi chuyển\u00A0hóa sức\u00A0mạnh sáng\u00A0tạo thành bộ\u00A0máy tạo\u00A0đà tăng\u00A0trưởng doanh\u00A0thu bền\u00A0vững.",
        visionTitle: "VISION",
        visionDesc:
          "Khao khát lớn\u00A0nhất của chúng tôi là trở thành Creative\u00A0House hàng\u00A0đầu tại Việt\u00A0Nam – nơi định\u00A0hình vị\u00A0thế bằng những dấu\u00A0ấn thị\u00A0giác độc\u00A0bản và hệ\u00A0thống tăng\u00A0trưởng đo\u00A0lường\u00A0được cho các\u00A0thương\u00A0hiệu tầm\u00A0trung và\u00A0lớn.",
        missionTitle: "MISSION",
        missionDesc:
          "Để hiện\u00A0thực\u00A0hóa điều\u00A0đó, chúng tôi cam\u00A0kết đồng\u00A0hành cùng các\u00A0thương\u00A0hiệu bằng sản\u00A0xuất hình\u00A0ảnh thương\u00A0mại chuẩn thẩm\u00A0mỹ\u00A0cao kết\u00A0hợp hệ\u00A0thống Marketing bài\u00A0bản – biến từng sản\u00A0phẩm sáng\u00A0tạo thành động\u00A0cơ tăng\u00A0trưởng doanh\u00A0thu.",
      },
      services: {
        eyebrow: "Dịch vụ của chúng tôi",
        title: "GIẢI PHÁP DỊCH VỤ",

        cta: "TƯ VẤN DỊCH VỤ",

        packages: {
          marketing: {
            name: "MARKETING & BRANDING",
            intro: "Xây\u00A0dựng từ chiến\u00A0lược đến vận\u00A0hành và\u00A0phát\u00A0triển",

            features: [
              "Nghiên\u00A0cứu & định\u00A0hướng thương\u00A0hiệu",
              "Xây\u00A0dựng chiến\u00A0lược Marketing &\u00A0Branding",
              "Xây\u00A0dựng hệ\u00A0thống Content &\u00A0Social\u00A0Media",
              "Xây\u00A0dựng và phát\u00A0triển các kênh truyền\u00A0thông",
              "Triển\u00A0khai Campaign &\u00A0Digital\u00A0Marketing",
              "Theo\u00A0dõi, đo\u00A0lường và tối\u00A0ưu hiệu\u00A0quả",
            ],
          },

          production: {
            name: "PHOTO & VIDEO PRODUCTION",
            intro: "Sản\u00A0xuất hình\u00A0ảnh và nội\u00A0dung thương\u00A0hiệu",

            features: [
              "Concept & Creative\u00A0Direction",
              "Chụp\u00A0ảnh sản\u00A0phẩm, thương\u00A0hiệu,\u00A0lifestyle",
              "Quay\u00A0dựng TVC / Brand\u00A0Film",
              "Quay\u00A0dựng Event /\u00A0Recap",
              "Sản\u00A0xuất Short-form\u00A0Video",
              "Hậu kỳ, Retouch &\u00A0Motion",
            ],
          },

          event: {
            name: "EVENT MANAGEMENT",
            intro: "Tổ\u00A0chức và triển\u00A0khai sự\u00A0kiện",

            features: [
              "Event Concept &\u00A0Planning",
              "Kịch bản &\u00A0Production",
              "Booking nhân\u00A0sự, đối\u00A0tác & nhà cung\u00A0cấp",
              "Setup sân khấu, âm thanh, ánh sáng,\u00A0decor",
              "Điều\u00A0phối & vận\u00A0hành sự\u00A0kiện",
              "Quản lý toàn bộ quá trình trước – trong – sau\u00A0Event",
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
            "Khám\u00A0phá các bộ sưu\u00A0tập nhiếp\u00A0ảnh thương\u00A0mại, thương\u00A0hiệu và nghệ\u00A0thuật của\u00A0NORE\u00A0MEDIA",
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
            desc: "Nhiếp\u00A0ảnh sản\u00A0phẩm thương\u00A0mại, bao\u00A0bì cao\u00A0cấp tĩnh\u00A0vật và nghệ\u00A0thuật ẩm\u00A0thực\u00A0F&B.",
          },
          brand: {
            title: "Brand (Thương hiệu)",
            desc: "Nhiếp\u00A0ảnh kiến\u00A0trúc không\u00A0gian khách\u00A0sạn, resort 5\u00A0sao và sự\u00A0kiện kích\u00A0hoạt thương\u00A0hiệu.",
          },
          personal: {
            title: "Cá nhân (Chân dung & Lookbook)",
            desc: "Nhiếp\u00A0ảnh chân\u00A0dung nghệ\u00A0thuật cổ\u00A0phong di\u00A0sản, dạ\u00A0hội Haute\u00A0Couture và lookbook\u00A0Y2K.",
          },
        },
      },
      video: {
        eyebrow: "Video",
        title: "Video Production",
        hub: {
          subtitle:
            "Chọn danh mục để khám phá các dự án video được thiết kế riêng của\u00A0chúng\u00A0tôi",
          explore: "Khám phá dự án",
          backToCategories: "← Tất cả danh mục",
          projectsCount_one: "{{count}} dự án",
          projectsCount_other: "{{count}} dự án",
          videosCount_one: "{{count}} video",
          videosCount_other: "{{count}} video",
        },
        categories: {
          tvc: {
            title: "TVC Doanh\u00A0Nghiệp",
            desc: "Các dự\u00A0án quảng\u00A0cáo, giới\u00A0thiệu doanh\u00A0nghiệp tiêu\u00A0biểu",
          },
          short: {
            title: "Short-video Content",
            desc: "Nội\u00A0dung ngắn tối\u00A0ưu cho TikTok, Reels,\u00A0Shorts",
          },
          recap: {
            title: "Recap Event",
            desc: "Ghi\u00A0lại những khoảnh\u00A0khắc đáng\u00A0nhớ của các\u00A0sự\u00A0kiện",
          },
        },
        serviceCards: {
          card1Title: "Video ngắn\u00A0viral",
          card1Desc:
            "Thiết\u00A0kế nội\u00A0dung ngắn, sáng\u00A0tạo và tối\u00A0ưu cho Facebook, TikTok,\u00A0Instagram.",
          card2Title: "Video sự\u00A0kiện",
          card2Desc:
            "Ghi\u00A0lại toàn\u00A0bộ trải\u00A0nghiệm và cảm\u00A0xúc của mỗi sự\u00A0kiện một cách chân\u00A0thực.",
          card3Title: "Video quảng\u00A0cáo",
          card3Desc:
            "Biến sản\u00A0phẩm và dịch\u00A0vụ thành câu\u00A0chuyện thu\u00A0hút khách\u00A0hàng.",
        },
      },
      contact: {
        heroEyebrow: "Liên hệ",
        heroTitle: "Gửi thông tin hoặc liên hệ trực tiếp với\u00A0NORE",
        heroDesc:
          "Chúng tôi sẵn\u00A0sàng tư\u00A0vấn dịch\u00A0vụ hình\u00A0ảnh, video và truyền\u00A0thông theo nhu\u00A0cầu của\u00A0bạn.",
        formEyebrow: "Gửi thông tin",
        formTitle: "Chúng tôi sẽ phản\u00A0hồi nhanh\u00A0nhất có\u00A0thể",
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
        infoTitle: "Liên hệ trực\u00A0tiếp",
        address: "Địa chỉ",
        addressVal: "TP. Hồ Chí Minh, Việt\u00A0Nam",
        hotline: "Hotline",
        emailLabel: "Email",
        errorMissing: "Thiếu cấu hình máy chủ",
        errorFail: "Không thể gửi thông tin. Vui lòng thử\u00A0lại.",
        errorConnect: "Không thể kết nối đến máy chủ. Vui lòng thử lại\u00A0sau.",
        errorRateLimit:
          "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 15\u00A0phút.",
        errorDelivery:
          "Chưa thể hoàn tất gửi thông tin đến {{destinations}} sau nhiều lần\u00A0thử. Vui lòng thử\u00A0lại\u00A0sau.",
        successWarn:
          "Tuy nhiên, email xác nhận chưa gửi được; vui lòng kiểm tra hộp\u00A0thư\u00A0sau.",
        success:
          "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có\u00A0thể.",
      },
      notFound: {
        eyebrow: "404",
        title: "Không tìm thấy\u00A0trang",
        backHome: "Quay về Trang\u00A0Chủ",
      },
    },
  },
  en: {
    translation: {
      site: {
        title: "NORE MEDIA",
        tagline: "Navigate - Optimize - Result - Empower",
        copyright: "© 2026 NORE\u00A0MEDIA. All rights\u00A0reserved.",
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
          'NORE MEDIA is a premier Creative House, pioneering the synergy between premium commercial visual production and systematic marketing frameworks. We do not produce generic content - we craft distinct "visual signatures" uniquely tailored to elevate your\u00A0brand.',
        contactNow: "Contact Us",
        viewServices: "View Services",
        aboutEyebrow: "About Us",
        aboutHeading: "Making an Impression Through Imagery and\u00A0Storytelling",
        aboutDesc:
          "With rich experience in digital media and content production, NORE MEDIA always places authenticity, professionalism, and creativity at the\u00A0forefront.",
        learnMore: "Learn More",
        servicesEyebrow: "Services",
        servicesHeading: "Comprehensive Media\u00A0Solutions",
        service1Title: "Event Videography",
        service1Desc:
          "Capturing unforgettable moments with distinct professionalism and\u00A0flair.",
        service2Title: "Brand Photography",
        service2Desc:
          "Sharp, vibrant imagery reflecting genuine corporate identity and\u00A0products.",
        service3Title: "Commercial Video Editing",
        service3Desc:
          "Creating engaging, high-retention short-form content optimized for digital\u00A0platforms.",
        galleryEyebrow: "Featured Works",
        galleryHeading: "Recent Works Showcase",
        gallerySubtitle:
          "Curated commercial product, brand space, and artistic portrait photography from NORE\u00A0MEDIA.",
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
          "We Create Content That Empowers Businesses to Break\u00A0Through",
        heroP1:
          'NORE MEDIA is a premier Creative House, pioneering the synergy between premium commercial visual production and systematic marketing frameworks. We do not produce generic content - we craft distinct "visual signatures" uniquely tailored to elevate your\u00A0brand.',
        heroP2:
          "By streamlining and overseeing every campaign phase - from strategic planning and cinema-grade production to multi-channel execution - NORE MEDIA completely eliminates operational bottlenecks common with fragmented freelancers or legacy agencies. We transform creative power into a sustainable revenue-driving\u00A0engine.",
        visionTitle: "VISION",
        visionDesc:
          "Our highest ambition is to become Vietnam's leading Creative House - defining prestige through bespoke visual signatures and quantifiable growth frameworks for medium\u2011to\u2011enterprise\u00A0brands.",
        missionTitle: "MISSION",
        missionDesc:
          "To realize this vision, we partner with brands through aesthetic commercial imagery combined with rigorous marketing systems - turning every creative output into a direct engine for sustainable revenue\u00A0growth.",
      },
      services: {
        eyebrow: "Our Services",
        title: "OUR SERVICES",

        cta: "GET CONSULTATION",

        packages: {
          marketing: {
            name: "MARKETING & BRANDING",
            intro: "From strategy to execution and sustainable\u00A0growth",

            features: [
              "Brand Research &\u00A0Positioning",
              "Marketing & Branding Strategy\u00A0Development",
              "Content & Social Media System\u00A0Development",
              "Media Channel Development &\u00A0Management",
              "Campaign & Digital Marketing\u00A0Execution",
              "Performance Tracking, Measurement &\u00A0Optimization",
            ],
          },

          production: {
            name: "PHOTO & VIDEO PRODUCTION",
            intro: "Visual production and branded content\u00A0creation",

            features: [
              "Concept & Creative\u00A0Direction",
              "Product, Brand & Lifestyle\u00A0Photography",
              "TVC & Brand Film\u00A0Production",
              "Event Filming & Recap\u00A0Videos",
              "Short-form Video\u00A0Production",
              "Post-production, Retouching & Motion\u00A0Graphics",
            ],
          },

          event: {
            name: "EVENT MANAGEMENT",
            intro: "End-to-end event planning and\u00A0execution",

            features: [
              "Event Concept &\u00A0Planning",
              "Event Scripting &\u00A0Production",
              "Talent, Partner & Vendor\u00A0Booking",
              "Stage, Sound, Lighting & Décor\u00A0Setup",
              "Event Coordination &\u00A0Operations",
              "Pre\u2011event, On\u2011site & Post\u2011event\u00A0Management",
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
            "Explore our curated commercial product, brand spaces, and fine art photography\u00A0collections",
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
            "Select a category to explore our featured bespoke video\u00A0projects",
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
            desc: "Featured corporate brand films and high-impact commercial\u00A0advertisements",
          },
          short: {
            title: "Short-video Content",
            desc: "Short-form visual storytelling optimized for TikTok, Reels, and\u00A0Shorts",
          },
          recap: {
            title: "Event Recap",
            desc: "Capturing the vibrant energy and memorable highlights of premium\u00A0events",
          },
        },
        serviceCards: {
          card1Title: "Viral Short Videos",
          card1Desc:
            "Creative short-form narratives optimized for maximum engagement on Facebook, TikTok, and\u00A0Instagram.",
          card2Title: "Event Videos",
          card2Desc:
            "Capturing authentic emotions, atmosphere, and full event experiences with high\u00A0fidelity.",
          card3Title: "Commercial Videos",
          card3Desc:
            "Transforming products and services into compelling stories that captivate your\u00A0audience.",
        },
      },
      contact: {
        heroEyebrow: "Contact",
        heroTitle: "Send Us a Message or Reach Out Directly to\u00A0NORE",
        heroDesc:
          "We are ready to consult on tailored image, video, and integrated media services designed for your\u00A0goals.",
        formEyebrow: "Send Information",
        formTitle: "We Will Respond as Promptly as\u00A0Possible",
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
        errorFail: "Could not send information. Please try\u00A0again.",
        errorConnect: "Could not connect to the server. Please try\u00A0later.",
        errorRateLimit: "Too many requests. Please try again after 15\u00A0minutes.",
        errorDelivery:
          "Could not complete delivery to {{destinations}} after multiple attempts. Please try again\u00A0later.",
        successWarn:
          "However, the confirmation email could not be sent; please check your inbox\u00A0later.",
        success:
          "Thank you for reaching out! We will get in touch with you as soon as\u00A0possible.",
      },
      notFound: {
        eyebrow: "404",
        title: "Page Not\u00A0Found",
        backHome: "Return to\u00A0Homepage",
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
