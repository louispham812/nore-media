import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Nơi chứa nội dung bản dịch (bạn có thể tách ra file JSON sau này nếu dài)
const resources = {
  vi: {
    translation: {
      nav: {
        home: 'Trang Chủ',
        about: 'Về Chúng Tôi',
        services: 'Dịch Vụ',
        gallery: 'Hình Ảnh',
        video: 'Video',
        contact: 'Liên Hệ'
      }
    }
  },
  en: {
    translation: {
      nav: {
        home: 'Home',
        about: 'About Us',
        services: 'Services',
        gallery: 'Gallery',
        video: 'Video',
        contact: 'Contact'
      }
    }
  }
};

i18n
  .use(LanguageDetector) // Tự động phát hiện ngôn ngữ trình duyệt
  .use(initReactI18next) // Kết nối với React
  .init({
    resources,
    fallbackLng: 'vi', // Ngôn ngữ mặc định
    debug: false,
    interpolation: {
      escapeValue: false // React đã tự động chống XSS
    }
  });

export default i18n;
