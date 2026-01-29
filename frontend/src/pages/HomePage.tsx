import { useApp } from '../lib/context';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import {
  Home,
  Brush,
  Zap,
  Droplet,
  Sparkles,
  ArrowRight,
  Star,
  CheckCircle,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { AnimatedSection, AnimatedContainer, AnimatedHeading, AnimatedText, AnimatedCard } from '../components/ui/animations';

const heroImages = [
  'https://images.unsplash.com/photo-1690489965043-ec15758cce71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBpbnRlcmlvciUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzU5OTk2NzcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1668365011614-9c4a49a0e89d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB2aWxsYSUyMGludGVyaW9yfGVufDF8fHx8MTc1OTk0NTkxM3ww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1680503146476-abb8c752e1f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWRyb29tJTIwZGVzaWdufGVufDF8fHx8MTc2MDAwMzg5NXww&ixlib=rb-4.1.0&q=80&w=1080',
];

const portfolioImages = [
  'https://images.unsplash.com/photo-1690489965043-ec15758cce71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBpbnRlcmlvciUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzU5OTk2NzcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1680503146476-abb8c752e1f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWRyb29tJTIwZGVzaWdufGVufDF8fHx8MTc2MDAwMzg5NXww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk5ODI0NTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1758548157243-f4ef3e614684?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwa2l0Y2hlbiUyMGRlc2lnbnxlbnwxfHx8fDE3NTk5NDMyMjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1658760046471-896cbc719c9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiYXRocm9vbSUyMG1hcmJsZXxlbnwxfHx8fDE3NTk5NzQyNjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1668365011614-9c4a49a0e89d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB2aWxsYSUyMGludGVyaW9yfGVufDF8fHx8MTc1OTk0NTkxM3ww&ixlib=rb-4.1.0&q=80&w=1080',
];

export function HomePage() {
  const { t } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const services = [
    {
      icon: Home,
      title: t('تشطيبات كاملة', 'Complete Finishing'),
      description: t(
        'تشطيب شامل للشقق والفلل والمكاتب بأعلى معايير الجودة',
        'Complete finishing for apartments, villas, and offices with the highest quality standards'
      ),
    },
    {
      icon: Brush,
      title: t('التصميم الداخلي', 'Interior Design'),
      description: t(
        'تصميمات داخلية عصرية وفخمة تناسب ذوقك الراقي',
        'Modern and luxurious interior designs that suit your refined taste'
      ),
    },
    {
      icon: Zap,
      title: t('الأعمال الكهربائية', 'Electrical Works'),
      description: t(
        'تركيب وصيانة الأنظمة الكهربائية بأحدث التقنيات',
        'Installation and maintenance of electrical systems with the latest technologies'
      ),
    },
    {
      icon: Droplet,
      title: t('السباكة والصرف', 'Plumbing'),
      description: t(
        'أعمال السباكة والصرف الصحي بكفاءة عالية',
        'Plumbing and sanitation works with high efficiency'
      ),
    },
    {
      icon: Sparkles,
      title: t('الديكور والتجهيز', 'Decoration'),
      description: t(
        'ديكورات فاخرة وتجهيزات عصرية لجميع المساحات',
        'Luxury decorations and modern furnishings for all spaces'
      ),
    },
  ];

  const testimonials = [
    {
      name: t('الأستاذ / عاطف وليام', 'Mr / Atef Waillaim'),
      role: t('صاحب شقة', 'Apartment Owner'),
      text: t(
        'خدمة ممتازة واحترافية عالية. تم تشطيب شقتي بشكل رائع يفوق التوقعات.',
        'Excellent service and high professionalism. My apartment was finished beautifully beyond expectations.'
      ),
    },
    {
      name: t('الدكتورة / دوماتيلا رشدي', 'Dr / Domatella Roshdy'),
      role: t('مركز طبي', 'Medical Center'),
      text: t(
        'فريق محترف وملتزم بالمواعيد. النتيجة النهائية كانت رائعة جداً.',
        'Professional team and committed to deadlines. The final result was absolutely wonderful.'
      ),
    },
    {
      name: t('الأستاذ / باسم', 'Mr / Bassem'),
      role: t('صاحب متجر شوكولاتة', 'Chocolate Shop Owner'),
      text: t(
        'أفضل شركة تشطيبات تعاملت معها. اهتمام بالتفاصيل وجودة عالية.',
        'The best finishing company I have dealt with. Attention to detail and high quality.'
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Slideshow */}
      <section className="relative h-screen">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <ImageWithFallback
              src={image}
              alt="Hero background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="container mx-auto px-4 text-center">
            <AnimatedHeading className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t('شركة البطل ارت', 'Elbatal Art Company')}
            </AnimatedHeading>
            <AnimatedText className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              {t(
                'للتشطيبات الفاخرة والتصميم الداخلي بأعلى معايير الجودة',
                'For luxury finishing and interior design with the highest quality standards'
              )}
            </AnimatedText>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[#D4AF37] hover:bg-[#B8941F] text-white"
                onClick={() => (window.location.hash = '#contact')}
              >
                {t('تواصل معنا', 'Contact Us')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#1A1A1A]"
                onClick={() => (window.location.hash = '#services')}
              >
                {t('خدماتنا', 'Our Services')}
              </Button>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-[#D4AF37] w-8' : 'bg-white/50'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Services Overview */}
      <AnimatedSection className="py-20 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <AnimatedHeading className="text-3xl md:text-4xl font-bold text-[#1A1A1A] dark:text-white mb-4">
              {t('خدماتنا الرئيسية', 'Our Main Services')}
            </AnimatedHeading>
            <AnimatedText className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              {t(
                'نقدم مجموعة شاملة من خدمات التشطيبات والتصميم الداخلي',
                'We offer a comprehensive range of finishing and interior design services'
              )}
            </AnimatedText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <AnimatedCard key={index} className="text-center p-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1A1A1A] dark:text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {service.description}
                  </p>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      {/* Portfolio */}
      <AnimatedSection className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <AnimatedHeading className="text-3xl md:text-4xl font-bold text-[#1A1A1A] dark:text-white mb-4">
              {t('أعمالنا السابقة', 'Our Previous Work')}
            </AnimatedHeading>
            <AnimatedText className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              {t(
                'بعض من مشاريعنا التي نفذناها بفخر وجودة عالية',
                'Some of our projects executed with luxury and high quality'
              )}
            </AnimatedText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioImages.map((image, index) => (
              <AnimatedCard key={index} className="overflow-hidden rounded-lg">
                <ImageWithFallback
                  src={image}
                  alt={`Portfolio ${index + 1}`}
                  className="w-full h-64 object-cover"
                />
              </AnimatedCard>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Testimonials */}
      <AnimatedSection className="py-20 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <AnimatedHeading className="text-3xl md:text-4xl font-bold text-[#1A1A1A] dark:text-white mb-4">
              {t('ماذا يقول عملاؤنا', 'What Our Clients Say')}
            </AnimatedHeading>
            <AnimatedText className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              {t(
                'آراء عملاؤنا الذين اختاروا الجودة والاحترافية',
                'Reviews from our clients who chose quality and professionalism'
              )}
            </AnimatedText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <AnimatedCard key={index} className="p-6">
                <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <h4 className="text-[#1A1A1A] dark:text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Call to Action */}
      <AnimatedSection className="py-20 bg-[#1A1A1A] text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedHeading className="text-3xl md:text-4xl mb-6">
            {t('هل أنت مستعد لبدء مشروعك؟', 'Ready to Start Your Project?')}
          </AnimatedHeading>
          <AnimatedText className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            {t(
              'تواصل معنا اليوم واحصل على استشارة مجانية لمشروعك',
              'Contact us today and get a free consultation for your project'
            )}
          </AnimatedText>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#D4AF37] hover:bg-[#B8941F] text-white"
              onClick={() => (window.location.hash = '#contact')}
            >
              {t('تواصل معنا الآن', 'Contact Us Now')}
              <ArrowRight className="mr-2 h-5 w-5 rtl:rotate-180" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-300 hover:text-[#1A1A1A]"
              onClick={() => (window.location.hash = '#services')}
            >
              {t('اعرف المزيد عن خدماتنا', 'Learn More About Our Services')}
            </Button>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
