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
      name: t('أحمد محمد', 'Ahmed Mohamed'),
      role: t('صاحب فيلا', 'Villa Owner'),
      text: t(
        'خدمة ممتازة واحترافية عالية. تم تشطيب فيلتي بشكل رائع يفوق التوقعات.',
        'Excellent service and high professionalism. My villa was finished beautifully beyond expectations.'
      ),
      rating: 5,
    },
    {
      name: t('سارة أحمد', 'Sara Ahmed'),
      role: t('صاحبة شقة', 'Apartment Owner'),
      text: t(
        'فريق محترف وملتزم بالمواعيد. النتيجة النهائية كانت رائعة جداً.',
        'Professional team and committed to deadlines. The final result was absolutely wonderful.'
      ),
      rating: 5,
    },
    {
      name: t('محمود حسن', 'Mahmoud Hassan'),
      role: t('صاحب مكتب', 'Office Owner'),
      text: t(
        'أفضل شركة تشطيبات تعاملت معها. اهتمام بالتفاصيل وجودة عالية.',
        'The best finishing company I have dealt with. Attention to detail and high quality.'
      ),
      rating: 5,
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
              alt="Luxury Interior"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}

        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl text-white mb-6">
              {t('شركة البطل للفنون', 'Elbatal Art Company')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              {t(
                'نحول أحلامك إلى واقع من خلال تشطيبات فاخرة وتصميم داخلي راقي',
                'We turn your dreams into reality through luxury finishes and elegant interior design'
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[#D4AF37] hover:bg-[#B8941F] text-white"
                onClick={() => (window.location.hash = '#contact')}
              >
                {t('تواصل معنا', 'Contact Us')}
                <ArrowRight className="mr-2 h-5 w-5 rtl:rotate-180" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20"
                onClick={() => (window.location.hash = '#works')}
              >
                {t('شاهد أعمالنا', 'View Our Work')}
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

      {/* Company Introduction */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl mb-6 text-[#1A1A1A] dark:text-white">
              {t('مرحباً بكم في عالم الفخامة', 'Welcome to the World of Luxury')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              {t(
                'شركة البطل للفنون هي شركة رائدة في مجال التشطيبات الداخلية والتصميم. نحن نقدم خدمات متكاملة تشمل تشطيب الشقق والفلل والمكاتب، التصميم الداخلي، الديكور، والأعمال الكهربائية والسباكة. نفخر بتقديم أعلى معايير الجودة والاحترافية لعملائنا الكرام.',
                'Elbatal Art Company is a leading company in interior finishing and design. We provide integrated services including apartment, villa, and office finishing, interior design, decoration, electrical and plumbing works. We pride ourselves on providing the highest standards of quality and professionalism to our valued clients.'
              )}
            </p>
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-4xl text-[#D4AF37] mb-2">500+</div>
                <div className="text-gray-600 dark:text-gray-400">
                  {t('مشروع مكتمل', 'Completed Projects')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl text-[#D4AF37] mb-2">15+</div>
                <div className="text-gray-600 dark:text-gray-400">
                  {t('سنوات خبرة', 'Years of Experience')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl text-[#D4AF37] mb-2">450+</div>
                <div className="text-gray-600 dark:text-gray-400">
                  {t('عميل راض', 'Satisfied Clients')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-[#1A1A1A] dark:text-white">
              {t('خدماتنا المميزة', 'Our Featured Services')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t(
                'نقدم مجموعة شاملة من الخدمات لتلبية جميع احتياجاتك',
                'We offer a comprehensive range of services to meet all your needs'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card
                  key={index}
                  className="luxury-shadow hover:shadow-xl transition-shadow cursor-pointer bg-white dark:bg-gray-800"
                >
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-lg gold-gradient flex items-center justify-center mb-4">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="mb-3 text-[#1A1A1A] dark:text-white">{service.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-[#1A1A1A] dark:text-white">
              {t('نماذج من أعمالنا', 'Portfolio Preview')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t(
                'اطلع على مجموعة من مشاريعنا الناجحة',
                'View a selection of our successful projects'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioImages.map((image, index) => (
              <div
                key={index}
                className="relative h-80 rounded-lg overflow-hidden cursor-pointer group"
              >
                <ImageWithFallback
                  src={image}
                  alt={`Project ${index + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <div>
                    <h4 className="text-white mb-1">
                      {t('مشروع فيلا فاخرة', 'Luxury Villa Project')}
                    </h4>
                    <p className="text-white/80 text-sm">{t('القاهرة', 'Cairo')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-[#D4AF37] hover:bg-[#B8941F] text-white"
              onClick={() => (window.location.hash = '#works')}
            >
              {t('عرض جميع الأعمال', 'View All Works')}
              <ArrowRight className="mr-2 h-5 w-5 rtl:rotate-180" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-[#1A1A1A] dark:text-white">
              {t('آراء عملائنا', 'Client Testimonials')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('اقرأ ما يقوله عملاؤنا عن تجربتهم معنا', 'Read what our clients say about their experience with us')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-[#D4AF37] text-[#D4AF37]" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <h4 className="text-[#1A1A1A] dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-[#1A1A1A] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl mb-6">
            {t('هل أنت مستعد لبدء مشروعك؟', 'Ready to Start Your Project?')}
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            {t(
              'تواصل معنا اليوم واحصل على استشارة مجانية لمشروعك',
              'Contact us today and get a free consultation for your project'
            )}
          </p>
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
              className="border-white text-white hover:bg-white hover:text-[#1A1A1A]"
              onClick={() => (window.location.hash = '#services')}
            >
              {t('اعرف المزيد عن خدماتنا', 'Learn More About Our Services')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
