import { useApp } from '../lib/context';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import {
  Palette,
  Sparkles,
  Wand2,
  Brain,
  Lightbulb,
  ArrowRight,
  Star,
  CheckCircle,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { AnimatedSection, AnimatedContainer, AnimatedHeading, AnimatedText, AnimatedCard } from '../components/ui/animations';

const aiDesignImages = [
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGludGVyaW9yJTIwZGVzaWduJTIwZ2VuZXJhdG9yfGVufDF8fHx8MTc2MDAwNzU4MHww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGRlc2lnbiUyMHRvb2xzJTIwM0QlMjBtb2RlbGluZ3xlbnwxfHx8fDE3NjAwMDc1ODF8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1558655146-d09347e92766?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGludGVyaW9yJTIwZGVzaWduJTIwc29mdHdhcmV8ZW58MXx8fHwxNzYwMDA3NTgxfDA&ixlib=rb-4.1.0&q=80&w=1080',
];

export function CreateYourOwnDesignWithAIPage() {
  const { t } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % aiDesignImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const aiFeatures = [
    {
      icon: Brain,
      title: t('ذكاء اصطناعي متقدم', 'Advanced AI'),
      description: t(
        'تقنية ذكاء اصطناعي متطورة لتحويل أفكارك إلى تصاميم حقيقية',
        'Advanced AI technology to transform your ideas into real designs'
      ),
    },
    {
      icon: Palette,
      title: t('تصميم مخصص', 'Custom Design'),
      description: t(
        'تصاميم فريدة ومخصصة تناسب ذوقك واحتياجاتك تماماً',
        'Unique and customized designs that perfectly match your taste and needs'
      ),
    },
    {
      icon: Wand2,
      title: t('نتائج فورية', 'Instant Results'),
      description: t(
        'احصل على تصاميم احترافية في ثوانٍ معدودة بدلاً من الأسابيع',
        'Get professional designs in seconds instead of weeks'
      ),
    },
    {
      icon: Sparkles,
      title: t('جودة عالية', 'High Quality'),
      description: t(
        'تصاميم عالية الجودة جاهزة للتطبيق المباشر',
        'High-quality designs ready for direct implementation'
      ),
    },
  ];

  const designSteps = [
    {
      step: '1',
      title: t('اختر النمط', 'Choose Style'),
      description: t(
        'اختر من بين مئات الأنماط والتصاميم المتاحة',
        'Choose from hundreds of available styles and designs'
      ),
    },
    {
      step: '2',
      title: t('أدخل تفاصيلك', 'Enter Your Details'),
      description: t(
        'صف رؤيتك ومتطلباتك بالتفصيل',
        'Describe your vision and requirements in detail'
      ),
    },
    {
      step: '3',
      title: t('ولد التصميم', 'Generate Design'),
      description: t(
        'شاهد الذكاء الاصطناعي يحول أفكارك إلى واقع',
        'Watch AI transform your ideas into reality'
      ),
    },
    {
      step: '4',
      title: t('خصص وحرر', 'Customize & Edit'),
      description: t(
        'عدّل التصميم حسب رغبتك واحصل على النتيجة المثالية',
        'Modify the design as you wish and get the perfect result'
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with AI Slideshow */}
      <section className="relative h-screen">
        {aiDesignImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <ImageWithFallback
              src={image}
              alt="AI Design background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="container mx-auto px-4 text-center">
            <AnimatedHeading className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t('اصنع تصميمك الخاص بالذكاء الاصطناعي', 'Create Your Own Design With AI')}
            </AnimatedHeading>
            <AnimatedText className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              {t(
                'حول أفكارك إلى واقع باستخدام أحدث تقنيات الذكاء الاصطناعي',
                'Transform your ideas into reality using the latest AI technology'
              )}
            </AnimatedText>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[#D4AF37] hover:bg-[#B8941F] text-white"
                onClick={() => (window.location.hash = '#ai-designer')}
              >
                {t('ابدأ التصميم الآن', 'Start Designing Now')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#1A1A1A]"
                onClick={() => (window.location.hash = '#features')}
              >
                {t('اكتشف المميزات', 'Discover Features')}
              </Button>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          {aiDesignImages.map((_, index) => (
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

      {/* AI Features */}
      <AnimatedSection className="py-20 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <AnimatedHeading className="text-3xl md:text-4xl font-bold text-[#1A1A1A] dark:text-white mb-4">
              {t('مميزات التصميم بالذكاء الاصطناعي', 'AI Design Features')}
            </AnimatedHeading>
            <AnimatedText className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              {t(
                'أحدث التقنيات والأساليب المبتكرة في عالم التصميم',
                'Latest technologies and innovative methods in the design world'
              )}
            </AnimatedText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aiFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <AnimatedCard key={index} className="text-center p-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1A1A1A] dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      {/* Design Steps */}
      <AnimatedSection className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <AnimatedHeading className="text-3xl md:text-4xl font-bold text-[#1A1A1A] dark:text-white mb-4">
              {t('كيف يعمل؟', 'How It Works?')}
            </AnimatedHeading>
            <AnimatedText className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              {t(
                'أربع خطوات بسيطة لتحويل فكرتك إلى تصميم احترافي',
                'Four simple steps to transform your idea into a professional design'
              )}
            </AnimatedText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {designSteps.map((step, index) => (
              <AnimatedCard key={index} className="text-center p-6">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#D4AF37] flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-[#1A1A1A] dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* AI Designer Section */}
      <AnimatedSection className="py-20 bg-white dark:bg-black" id="ai-designer">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <AnimatedHeading className="text-3xl md:text-4xl font-bold text-[#1A1A1A] dark:text-white mb-4">
              {t('جرب مصمم الذكاء الاصطناعي', 'Try the AI Designer')}
            </AnimatedHeading>
            <AnimatedText className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              {t(
                'ابدأ رحلتك في عالم التصميم بالذكاء الاصطناعي اليوم',
                'Start your journey in AI-powered design today'
              )}
            </AnimatedText>
          </div>

          <div className="max-w-4xl mx-auto">
            <AnimatedCard className="p-8">
              <div className="text-center">
                <Lightbulb className="h-16 w-16 text-[#D4AF37] mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-[#1A1A1A] dark:text-white mb-4">
                  {t('قريباً', 'Coming Soon')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  {t(
                    'نعمل حالياً على تطوير أفضل مصمم بالذكاء الاصطناعي للتصميم الداخلي. كن أول من يجربه!',
                    'We are currently developing the best AI-powered interior designer. Be the first to try it!'
                  )}
                </p>
                <Button
                  size="lg"
                  className="bg-[#D4AF37] hover:bg-[#B8941F] text-white"
                  onClick={() => (window.location.hash = '#contact')}
                >
                  {t('احصل على إشعار عند الإطلاق', 'Get Notified on Launch')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </AnimatedSection>

      {/* Call to Action */}
      <AnimatedSection className="py-20 bg-[#1A1A1A] text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedHeading className="text-3xl md:text-4xl mb-6">
            {t('هل أنت مستعد لتجربة مستقبل التصميم؟', 'Ready to Experience the Future of Design?')}
          </AnimatedHeading>
          <AnimatedText className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            {t(
              'انضم إلى الثورة في عالم التصميم الداخلي بالذكاء الاصطناعي',
              'Join the revolution in interior design with artificial intelligence'
            )}
          </AnimatedText>
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
              className="border-gray-300 hover:text-[#1A1A1A]"
              onClick={() => (window.location.hash = '#services')}
            >
              {t('اكتشف خدماتنا', 'Discover Our Services')}
            </Button>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
