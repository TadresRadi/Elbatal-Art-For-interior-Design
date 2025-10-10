import { useApp } from '../lib/context';
import { Card, CardContent } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import {
  Home,
  Building2,
  Briefcase,
  Brush,
  Zap,
  Droplet,
  Sparkles,
  Hammer,
  PaintBucket,
  Lightbulb,
  Wrench,
  Sofa,
} from 'lucide-react';

export function ServicesPage() {
  const { t, language } = useApp();

  const services = [
    {
      icon: Home,
      title: { ar: 'تشطيب شقق', en: 'Apartment Finishing' },
      description: {
        ar: 'تشطيب كامل للشقق يشمل جميع الأعمال من الأرضيات إلى الأسقف',
        en: 'Complete apartment finishing including all works from floors to ceilings',
      },
      image:
        'https://images.unsplash.com/photo-1690489965043-ec15758cce71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBpbnRlcmlvciUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzU5OTk2NzcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      features: [
        { ar: 'تركيب الأرضيات (سيراميك، باركيه، رخام)', en: 'Floor installation (ceramic, parquet, marble)' },
        { ar: 'أعمال الدهانات والديكورات', en: 'Painting and decoration works' },
        { ar: 'تركيب الأبواب والنوافذ', en: 'Door and window installation' },
        { ar: 'الأعمال الكهربائية والسباكة', en: 'Electrical and plumbing works' },
      ],
    },
    {
      icon: Building2,
      title: { ar: 'تشطيب فلل', en: 'Villa Finishing' },
      description: {
        ar: 'تشطيب فاخر للفلل بأعلى معايير الجودة والفخامة',
        en: 'Luxury villa finishing with the highest standards of quality and luxury',
      },
      image:
        'https://images.unsplash.com/photo-1668365011614-9c4a49a0e89d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB2aWxsYSUyMGludGVyaW9yfGVufDF8fHx8MTc1OTk0NTkxM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      features: [
        { ar: 'تصميم وتنفيذ حمامات السباحة', en: 'Swimming pool design and construction' },
        { ar: 'تصميم الحدائق والمساحات الخارجية', en: 'Garden and outdoor space design' },
        { ar: 'أنظمة الإضاءة الذكية', en: 'Smart lighting systems' },
        { ar: 'أعمال الواجهات الخارجية', en: 'External facade works' },
      ],
    },
    {
      icon: Briefcase,
      title: { ar: 'تشطيب مكاتب', en: 'Office Finishing' },
      description: {
        ar: 'تشطيب احترافي للمكاتب والمساحات التجارية',
        en: 'Professional finishing for offices and commercial spaces',
      },
      image:
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk5ODI0NTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      features: [
        { ar: 'تصميم مساحات العمل المفتوحة', en: 'Open workspace design' },
        { ar: 'غرف الاجتماعات والمؤتمرات', en: 'Meeting and conference rooms' },
        { ar: 'أنظمة الصوت والإضاءة', en: 'Sound and lighting systems' },
        { ar: 'تركيب الأرضيات الخشبية', en: 'Wooden floor installation' },
      ],
    },
    {
      icon: Brush,
      title: { ar: 'التصميم الداخلي', en: 'Interior Design' },
      description: {
        ar: 'تصميمات داخلية عصرية وفخمة تناسب ذوقك',
        en: 'Modern and luxurious interior designs that suit your taste',
      },
      image:
        'https://images.unsplash.com/photo-1680503146476-abb8c752e1f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWRyb29tJTIwZGVzaWdufGVufDF8fHx8MTc2MDAwMzg5NXww&ixlib=rb-4.1.0&q=80&w=1080',
      features: [
        { ar: 'تصميم ثلاثي الأبعاد 3D', en: '3D design visualization' },
        { ar: 'اختيار الألوان والمواد', en: 'Color and material selection' },
        { ar: 'تصميم الأثاث المخصص', en: 'Custom furniture design' },
        { ar: 'استشارات التصميم', en: 'Design consultations' },
      ],
    },
    {
      icon: Zap,
      title: { ar: 'الأعمال الكهربائية', en: 'Electrical Works' },
      description: {
        ar: 'تركيب وصيانة جميع الأنظمة الكهربائية',
        en: 'Installation and maintenance of all electrical systems',
      },
      image:
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800',
      features: [
        { ar: 'تركيب الإضاءة الحديثة', en: 'Modern lighting installation' },
        { ar: 'أنظمة الأمان والمراقبة', en: 'Security and surveillance systems' },
        { ar: 'التكييف المركزي', en: 'Central air conditioning' },
        { ar: 'أنظمة المنزل الذكي', en: 'Smart home systems' },
      ],
    },
    {
      icon: Droplet,
      title: { ar: 'أعمال السباكة', en: 'Plumbing Works' },
      description: {
        ar: 'أعمال السباكة والصرف الصحي بكفاءة عالية',
        en: 'Plumbing and sanitation works with high efficiency',
      },
      image:
        'https://images.unsplash.com/photo-1658760046471-896cbc719c9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiYXRocm9vbSUyMG1hcmJsZXxlbnwxfHx8fDE3NTk5NzQyNjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      features: [
        { ar: 'تركيب الأدوات الصحية الفاخرة', en: 'Luxury sanitary ware installation' },
        { ar: 'أنظمة تسخين المياه', en: 'Water heating systems' },
        { ar: 'أعمال العزل المائي', en: 'Waterproofing works' },
        { ar: 'صيانة دورية', en: 'Periodic maintenance' },
      ],
    },
    {
      icon: Sparkles,
      title: { ar: 'الديكور والتجهيز', en: 'Decoration & Furnishing' },
      description: {
        ar: 'ديكورات فاخرة وتجهيزات عصرية',
        en: 'Luxury decorations and modern furnishings',
      },
      image:
        'https://images.unsplash.com/photo-1758548157243-f4ef3e614684?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwa2l0Y2hlbiUyMGRlc2lnbnxlbnwxfHx8fDE3NTk5NDMyMjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      features: [
        { ar: 'الستائر والمفروشات', en: 'Curtains and upholstery' },
        { ar: 'الإكسسوارات والتحف', en: 'Accessories and artifacts' },
        { ar: 'اللوحات والديكورات الجدارية', en: 'Paintings and wall decorations' },
        { ar: 'الإضاءة الديكورية', en: 'Decorative lighting' },
      ],
    },
    {
      icon: PaintBucket,
      title: { ar: 'أعمال الدهانات', en: 'Painting Works' },
      description: {
        ar: 'دهانات احترافية بأفضل المواد',
        en: 'Professional painting with the best materials',
      },
      image:
        'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800',
      features: [
        { ar: 'دهانات داخلية وخارجية', en: 'Interior and exterior painting' },
        { ar: 'ديكورات جبسية', en: 'Gypsum decorations' },
        { ar: 'ورق الجدران الفاخر', en: 'Luxury wallpaper' },
        { ar: 'تشطيبات خاصة', en: 'Special finishes' },
      ],
    },
    {
      icon: Hammer,
      title: { ar: 'أعمال النجارة', en: 'Carpentry Works' },
      description: {
        ar: 'تصنيع وتركيب الأثاث الخشبي المخصص',
        en: 'Manufacturing and installation of custom wooden furniture',
      },
      image:
        'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
      features: [
        { ar: 'المطابخ الخشبية', en: 'Wooden kitchens' },
        { ar: 'الدواليب والخزائن', en: 'Wardrobes and cabinets' },
        { ar: 'الأبواب والشبابيك', en: 'Doors and windows' },
        { ar: 'الأثاث المخصص', en: 'Custom furniture' },
      ],
    },
    {
      icon: Sofa,
      title: { ar: 'الأثاث والمفروشات', en: 'Furniture & Upholstery' },
      description: {
        ar: 'توريد وتركيب الأثاث الفاخر',
        en: 'Supply and installation of luxury furniture',
      },
      image:
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      features: [
        { ar: 'أثاث غرف النوم', en: 'Bedroom furniture' },
        { ar: 'أثاث غرف المعيشة', en: 'Living room furniture' },
        { ar: 'أثاث المكاتب', en: 'Office furniture' },
        { ar: 'التنجيد والترميم', en: 'Upholstery and restoration' },
      ],
    },
    {
      icon: Lightbulb,
      title: { ar: 'الأنظمة الذكية', en: 'Smart Systems' },
      description: {
        ar: 'تركيب أنظمة المنزل والمكتب الذكي',
        en: 'Installation of smart home and office systems',
      },
      image:
        'https://images.unsplash.com/photo-1558002038-1055907df827?w=800',
      features: [
        { ar: 'التحكم الذكي بالإضاءة', en: 'Smart lighting control' },
        { ar: 'أنظمة الأمان الذكية', en: 'Smart security systems' },
        { ar: 'التحكم في التكييف', en: 'Air conditioning control' },
        { ar: 'أنظمة الصوت المنزلي', en: 'Home audio systems' },
      ],
    },
    {
      icon: Wrench,
      title: { ar: 'الصيانة الشاملة', en: 'Comprehensive Maintenance' },
      description: {
        ar: 'خدمات الصيانة الدورية والطارئة',
        en: 'Periodic and emergency maintenance services',
      },
      image:
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
      features: [
        { ar: 'صيانة دورية شاملة', en: 'Comprehensive periodic maintenance' },
        { ar: 'خدمة الطوارئ 24/7', en: '24/7 emergency service' },
        { ar: 'إصلاح وترميم', en: 'Repair and restoration' },
        { ar: 'عقود صيانة سنوية', en: 'Annual maintenance contracts' },
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl mb-4">{t('خدماتنا', 'Our Services')}</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            {t(
              'نقدم مجموعة شاملة من خدمات التشطيبات والتصميم الداخلي بأعلى معايير الجودة',
              'We offer a comprehensive range of finishing and interior design services with the highest quality standards'
            )}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 bg-white dark:bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isEven = index % 2 === 0;
              
              return (
                <Card
                  key={index}
                  className="overflow-hidden luxury-shadow bg-white dark:bg-gray-800"
                >
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-0 ${
                      isEven ? '' : 'lg:flex-row-reverse'
                    }`}
                  >
                    <div className={`relative h-64 lg:h-auto ${isEven ? 'order-1' : 'order-2'}`}>
                      <ImageWithFallback
                        src={service.image}
                        alt={service.title[language]}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <CardContent className={`p-8 lg:p-12 ${isEven ? 'order-2' : 'order-1'}`}>
                      <div className="w-16 h-16 rounded-lg gold-gradient flex items-center justify-center mb-6">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-2xl md:text-3xl mb-4 text-[#1A1A1A] dark:text-white">
                        {service.title[language]}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                        {service.description[language]}
                      </p>

                      <div className="space-y-3">
                        <h4 className="text-[#D4AF37] mb-3">
                          {t('تشمل الخدمة:', 'Service includes:')}
                        </h4>
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2"></div>
                            <span className="text-gray-600 dark:text-gray-300">
                              {feature[language]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl mb-6 text-[#1A1A1A] dark:text-white">
            {t('هل تحتاج لاستشارة مجانية؟', 'Need a Free Consultation?')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            {t(
              'تواصل معنا الآن واحصل على استشارة مجانية لمشروعك',
              'Contact us now and get a free consultation for your project'
            )}
          </p>
          <button
            className="bg-[#D4AF37] hover:bg-[#B8941F] text-white px-8 py-3 rounded-lg transition-colors"
            onClick={() => (window.location.hash = '#contact')}
          >
            {t('تواصل معنا', 'Contact Us')}
          </button>
        </div>
      </section>
    </div>
  );
}
