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
      },
      contact: {
        heroEyebrow: 'Liên hệ',
        heroTitle: 'Gửi thông tin hoặc liên hệ trực tiếp với NORE',
        heroDesc: 'Chúng tôi sẵn sàng tư vấn dịch vụ hình ảnh, video và truyền thông theo nhu cầu của bạn.',
        formEyebrow: 'Gửi thông tin',
        formTitle: 'Chúng tôi sẽ phản hồi nhanh nhất có thể',
        name: 'Họ và tên',
        namePlaceholder: 'Nhập họ tên của bạn',
        phone: 'Số điện thoại',
        phonePlaceholder: 'Nhập số điện thoại',
        email: 'Email',
        emailPlaceholder: 'Nhập email',
        message: 'Tin nhắn',
        messagePlaceholder: 'Nói cho chúng tôi biết nhu cầu của bạn',
        honeypot: 'Để trống trường này',
        submitting: 'Đang gửi...',
        submit: 'Gửi thông tin',
        infoEyebrow: 'Thông tin',
        infoTitle: 'Liên hệ trực tiếp',
        address: 'Địa chỉ',
        addressVal: 'TP. Hồ Chí Minh, Việt Nam',
        hotline: 'Hotline',
        errorMissing: 'Thiếu cấu hình máy chủ',
        errorFail: 'Không thể gửi thông tin. Vui lòng thử lại.',
        errorConnect: 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.',
        successWarn: 'Tuy nhiên, email xác nhận chưa gửi được; vui lòng kiểm tra hộp thư sau.'
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
      },
      contact: {
        heroEyebrow: 'Contact',
        heroTitle: 'Send info or contact NORE directly',
        heroDesc: 'We are ready to consult on image, video, and media services tailored to your needs.',
        formEyebrow: 'Send info',
        formTitle: 'We will respond as quickly as possible',
        name: 'Full Name',
        namePlaceholder: 'Enter your full name',
        phone: 'Phone Number',
        phonePlaceholder: 'Enter your phone number',
        email: 'Email',
        emailPlaceholder: 'Enter your email',
        message: 'Message',
        messagePlaceholder: 'Tell us about your needs',
        honeypot: 'Leave this field empty',
        submitting: 'Sending...',
        submit: 'Send message',
        infoEyebrow: 'Information',
        infoTitle: 'Direct Contact',
        address: 'Address',
        addressVal: 'Ho Chi Minh City, Vietnam',
        hotline: 'Hotline',
        errorMissing: 'Missing server configuration',
        errorFail: 'Could not send information. Please try again.',
        errorConnect: 'Could not connect to the server. Please try later.',
        successWarn: 'However, the confirmation email could not be sent; please check your inbox later.'
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
