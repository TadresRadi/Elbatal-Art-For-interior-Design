import { useApp } from '../lib/context';
import { Facebook, Instagram, Twitter, Linkedin, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  const { t } = useApp();

  const socialLinks = [
    { icon: Facebook, href: '#' },
    { icon: Instagram, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Linkedin, href: '#' },
  ];

  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
              <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center">
                <span className="text-white">EA</span>
              </div>
              <h3 className="text-[#D4AF37]">
                {t('شركة البطل للفنون', 'Elbatal Art Company')}
              </h3>
            </div>
            <p className="text-gray-400 text-sm">
              {t(
                'نقدم أفضل خدمات التشطيبات الداخلية والديكور للشقق والفلل والمكاتب بأعلى معايير الجودة والفخامة.',
                'We provide the best interior finishing and decoration services for apartments, villas, and offices with the highest standards of quality and luxury.'
              )}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-[#D4AF37]">{t('روابط سريعة', 'Quick Links')}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  {t('الرئيسية', 'Home')}
                </a>
              </li>
              <li>
                <a href="#works" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  {t('أعمالنا', 'Our Works')}
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  {t('من نحن', 'About Us')}
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  {t('خدماتنا', 'Services')}
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 text-[#D4AF37]">{t('خدماتنا', 'Our Services')}</h4>
            <ul className="space-y-2">
              <li className="text-gray-400 text-sm">{t('تشطيب شقق', 'Apartment Finishing')}</li>
              <li className="text-gray-400 text-sm">{t('تشطيب فلل', 'Villa Finishing')}</li>
              <li className="text-gray-400 text-sm">{t('تشطيب مكاتب', 'Office Finishing')}</li>
              <li className="text-gray-400 text-sm">{t('التصميم الداخلي', 'Interior Design')}</li>
              <li className="text-gray-400 text-sm">{t('الديكور', 'Decoration')}</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4 text-[#D4AF37]">{t('تواصل معنا', 'Contact Us')}</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 rtl:space-x-reverse text-gray-400 text-sm">
                <Phone className="h-4 w-4 text-[#D4AF37]" />
                <span>+20 123 456 7890</span>
              </li>
              <li className="flex items-center space-x-3 rtl:space-x-reverse text-gray-400 text-sm">
                <Mail className="h-4 w-4 text-[#D4AF37]" />
                <span>info@elbatalart.com</span>
              </li>
              <li className="flex items-start space-x-3 rtl:space-x-reverse text-gray-400 text-sm">
                <MapPin className="h-4 w-4 text-[#D4AF37] mt-1" />
                <span>{t('القاهرة، مصر', 'Cairo, Egypt')}</span>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex items-center space-x-3 rtl:space-x-reverse mt-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="w-8 h-8 rounded-full bg-gray-800 hover:bg-[#D4AF37] flex items-center justify-center transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            {t(
              '© 2025 شركة البطل للفنون. جميع الحقوق محفوظة.',
              '© 2025 Elbatal Art Company. All rights reserved.'
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
