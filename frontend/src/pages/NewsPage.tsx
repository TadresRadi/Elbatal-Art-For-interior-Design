import { useApp } from '../lib/context';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Calendar, ArrowRight } from 'lucide-react';
import { ContactPage } from './ContactPage'
const blogPosts = [
  {
    id: 1,
    title: {
      ar: 'أحدث اتجاهات التصميم الداخلي لعام 2025',
      en: 'Latest Interior Design Trends for 2025',
    },
    excerpt: {
      ar: 'اكتشف أحدث صيحات التصميم الداخلي التي ستهيمن على عام 2025، من الألوان العصرية إلى المواد المستدامة',
      en: 'Discover the latest interior design trends that will dominate 2025, from modern colors to sustainable materials',
    },
    image:
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800',
    date: '2025-10-01',
    category: { ar: 'تصميم', en: 'Design' },
  },
  {
    id: 2,
    title: {
      ar: 'كيف تختار الألوان المناسبة لمنزلك',
      en: 'How to Choose the Right Colors for Your Home',
    },
    excerpt: {
      ar: 'دليل شامل لاختيار الألوان المثالية التي تعكس شخصيتك وتخلق أجواء مريحة في منزلك',
      en: 'A comprehensive guide to choosing the perfect colors that reflect your personality and create a comfortable atmosphere in your home',
    },
    image:
      'https://images.unsplash.com/photo-1615873968403-89e068629265?w=800',
    date: '2025-09-28',
    category: { ar: 'نصائح', en: 'Tips' },
  },
  {
    id: 3,
    title: {
      ar: 'الإضاءة الذكية: مستقبل المنازل العصرية',
      en: 'Smart Lighting: The Future of Modern Homes',
    },
    excerpt: {
      ar: 'تعرف على كيفية تحويل منزلك إلى منزل ذكي من خلال أنظمة الإضاءة الحديثة',
      en: 'Learn how to transform your home into a smart home through modern lighting systems',
    },
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    date: '2025-09-20',
    category: { ar: 'تقنية', en: 'Technology' },
  },
  {
    id: 4,
    title: {
      ar: 'مواد البناء المستدامة والصديقة للبيئة',
      en: 'Sustainable and Eco-Friendly Building Materials',
    },
    excerpt: {
      ar: 'أهمية استخدام المواد الصديقة للبيئة في التشطيبات وكيفية اختيارها',
      en: 'The importance of using eco-friendly materials in finishing and how to choose them',
    },
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    date: '2025-09-15',
    category: { ar: 'استدامة', en: 'Sustainability' },
  },
  {
    id: 5,
    title: {
      ar: 'تصميم المطابخ العصرية: نصائح وأفكار',
      en: 'Modern Kitchen Design: Tips and Ideas',
    },
    excerpt: {
      ar: 'أفكار مبتكرة لتصميم مطبخ عصري يجمع بين الوظيفية والجمال',
      en: 'Innovative ideas for designing a modern kitchen that combines functionality and beauty',
    },
    image:
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
    date: '2025-09-10',
    category: { ar: 'تصميم', en: 'Design' },
  },
  {
    id: 6,
    title: {
      ar: 'الرخام في التشطيبات الفاخرة',
      en: 'Marble in Luxury Finishing',
    },
    excerpt: {
      ar: 'كيف يضيف الرخام لمسة من الفخامة والأناقة إلى منزلك',
      en: 'How marble adds a touch of luxury and elegance to your home',
    },
    image:
      'https://images.unsplash.com/photo-1658760046471-896cbc719c9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiYXRocm9vbSUyMG1hcmJsZXxlbnwxfHx8fDE3NTk5NzQyNjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    date: '2025-09-05',
    category: { ar: 'مواد', en: 'Materials' },
  },
  {
    id: 7,
    title: {
      ar: 'تحسين المساحات الصغيرة: حلول ذكية',
      en: 'Optimizing Small Spaces: Smart Solutions',
    },
    excerpt: {
      ar: 'نصائح عملية لاستغلال المساحات الصغيرة وجعلها تبدو أكبر وأكثر راحة',
      en: 'Practical tips for utilizing small spaces and making them look larger and more comfortable',
    },
    image:
      'https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=800',
    date: '2025-09-01',
    category: { ar: 'نصائح', en: 'Tips' },
  },
  {
      id: 8,
    title: {
      ar: 'الأرضيات الخشبية مقابل السيراميك',
      en: 'Wooden Floors vs Ceramic',
    },
    excerpt: {
      ar: 'مقارنة شاملة بين الأرضيات الخشبية والسيراميك لمساعدتك في اتخاذ القرار الصحيح',
      en: 'A comprehensive comparison between wooden and ceramic floors to help you make the right decision',
    },
    image:
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800',
    date: '2025-08-28',
    category: { ar: 'مواد', en: 'Materials' },
  },
  {
    id: 9,
    title: {
      ar: 'تصميم غرف النوم للحصول على نوم أفضل',
      en: 'Bedroom Design for Better Sleep',
    },
    excerpt: {
      ar: 'كيف يؤثر تصميم غرفة النوم على جودة نومك ونصائح لتحسينها',
      en: 'How bedroom design affects your sleep quality and tips to improve it',
    },
    image:
      'https://images.unsplash.com/photo-1680503146476-abb8c752e1f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWRyb29tJTIwZGVzaWdufGVufDF8fHx8MTc2MDAwMzg5NXww&ixlib=rb-4.1.0&q=80&w=1080',
    date: '2025-08-25',
    category: { ar: 'تصميم', en: 'Design' },
  },
];

export function NewsPage() {
  const { t, language } = useApp();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (language === 'ar') {
      return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl mb-4">{t('آخر الأخبار', "What's New")}</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            {t(
              'تابع أحدث الاتجاهات والأخبار في عالم التصميم الداخلي والتشطيبات',
              'Follow the latest trends and news in the world of interior design and finishing'
            )}
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12 bg-white dark:bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden luxury-shadow bg-white dark:bg-gray-800">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="relative h-96 lg:h-auto">
                <ImageWithFallback
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title[language]}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-[#D4AF37] text-white px-4 py-2 rounded-lg text-sm">
                    {t('مميز', 'Featured')}
                  </span>
                </div>
              </div>

              <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm text-[#D4AF37]">
                    {blogPosts[0].category[language]}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(blogPosts[0].date)}</span>
                  </div>
                </div>

                <h2 className="text-3xl md:text-4xl mb-4 text-[#1A1A1A] dark:text-white">
                  {blogPosts[0].title[language]}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                  {blogPosts[0].excerpt[language]}
                </p>

                <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-white self-start" asChild>
                  <a href="/ContactPage#contact">
                    {t('تواصل معانا', 'Contact Us')}
                    <ArrowRight className="mr-2 h-4 w-2 rtl:rotate-180" />
                  </a>
                </Button>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(1).map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden cursor-pointer hover:shadow-xl transition-shadow bg-white dark:bg-gray-800"
              >
                <div className="relative h-56">
                  <ImageWithFallback
                    src={post.image}
                    alt={post.title[language]}
                    className="w-full h-full object-cover transition-transform hover:scale-110"
                  />
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-xs text-[#D4AF37]">
                      {post.category[language]}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                  </div>

                  <h3 className="mb-3 text-[#1A1A1A] dark:text-white line-clamp-2">
                    {post.title[language]}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                    {post.excerpt[language]}
                  </p>

                  <Button
                    variant="ghost"
                    className="text-[#D4AF37] hover:text-[#B8941F]"
                  >
<a href="/ContactPage#contact">
                    {t('تواصل معانا', 'Contact Us')}
                  </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-[#1A1A1A] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl mb-4">
            {t('اشترك في نشرتنا الإخبارية', 'Subscribe to Our Newsletter')}
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            {t(
              'احصل على آخر الأخبار والنصائح مباشرة في بريدك الإلكتروني',
              'Get the latest news and tips directly in your email'
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder={t('البريد الإلكتروني', 'Email Address')}
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#D4AF37]"
            />
            <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-white">
              <a href="/ContactPage#contact">
                    {t('تواصل معانا', 'Contact Us')}
                  </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
