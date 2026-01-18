import { useApp } from '../lib/context';
import { Card, CardContent } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Target, Eye, Award, Users } from 'lucide-react';

const teamMembers = [
  {
    name: { ar: 'م. أحمد البطل', en: 'Eng. Ahmed Elbatal' },
    role: { ar: 'المدير التنفيذي', en: 'CEO' },
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
  },
  {
    name: { ar: 'م. سارة محمد', en: 'Eng. Sara Mohamed' },
    role: { ar: 'مديرة التصميم الداخلي', en: 'Interior Design Manager' },
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
  },
  {
    name: { ar: 'م. محمود حسن', en: 'Eng. Mahmoud Hassan' },
    role: { ar: 'مدير المشاريع', en: 'Projects Manager' },
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
  },
  {
    name: { ar: 'أ. فاطمة علي', en: 'Ms. Fatma Ali' },
    role: { ar: 'مديرة العلاقات العامة', en: 'Public Relations Manager' },
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
  },
  {
    name: { ar: 'م. خالد أحمد', en: 'Eng. Khaled Ahmed' },
    role: { ar: 'مدير الأعمال الكهربائية', en: 'Electrical Works Manager' },
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
  },
  {
    name: { ar: 'م. نورا سعيد', en: 'Eng. Nora Said' },
    role: { ar: 'مهندسة معمارية', en: 'Architect' },
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400',
  },
];

export function AboutPage() {
  const { t, language } = useApp();

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl mb-4">{t('من نحن', 'About Us')}</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            {t(
              'تعرف على قصتنا وفريق العمل المحترف الذي يحول أحلامك إلى واقع',
              'Learn about our story and the professional team that turns your dreams into reality'
            )}
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl mb-6 text-[#1A1A1A] dark:text-white">
                {t('قصة شركة البطل للفنون', 'The Story of Elbatal Art Company')}
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  {t(
                    'تأسست شركة البطل للفنون عام 2010 بهدف تقديم خدمات تشطيبات داخلية وتصميم فاخرة تلبي أعلى معايير الجودة والاحترافية. على مدار أكثر من 15 عامًا، نجحنا في تنفيذ أكثر من 500 مشروع سكني وتجاري، وكسبنا ثقة مئات العملاء في مصر والمنطقة العربية.',
                    'Elbatal Art Company was founded in 2010 with the aim of providing luxury interior finishing and design services that meet the highest standards of quality and professionalism. Over more than 15 years, we have successfully completed over 500 residential and commercial projects and earned the trust of hundreds of clients in Egypt and the Arab region.'
                  )}
                </p>
                <p>
                  {t(
                    'نفخر بفريق عمل متخصص من المهندسين والمصممين والفنيين ذوي الخبرة الواسعة في مجال التشطيبات والديكور. نحن نؤمن بأن كل مشروع هو فرصة لخلق تحفة فنية فريدة تعكس شخصية العميل وتلبي احتياجاته.',
                    'We pride ourselves on a specialized team of engineers, designers, and technicians with extensive experience in the field of finishing and decoration. We believe that every project is an opportunity to create a unique masterpiece that reflects the client\'s personality and meets their needs.'
                  )}
                </p>
                <p>
                  {t(
                    'نستخدم أحدث التقنيات وأفضل المواد لضمان تقديم نتائج استثنائية تدوم لسنوات. التزامنا بالجودة والمواعيد وخدمة العملاء جعلنا الاختيار الأول للكثيرين.',
                    'We use the latest technologies and the best materials to ensure delivering exceptional results that last for years. Our commitment to quality, deadlines, and customer service has made us the first choice for many.'
                  )}
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400"
                  alt="Office"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1690489965043-ec15758cce71?w=400"
                  alt="Interior"
                  className="w-full h-64 object-cover rounded-lg mt-8"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 gold-gradient rounded-lg opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white dark:bg-gray-800 luxury-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-4 text-[#1A1A1A] dark:text-white">
                  {t('رسالتنا', 'Our Mission')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t(
                    'تقديم خدمات تشطيبات وتصميم داخلي متميزة تحول المساحات إلى أماكن استثنائية تعكس الفخامة والراحة.',
                    'Providing exceptional finishing and interior design services that transform spaces into extraordinary places reflecting luxury and comfort.'
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 luxury-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-4 text-[#1A1A1A] dark:text-white">
                  {t('رؤيتنا', 'Our Vision')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t(
                    'أن نكون الشركة الرائدة في مجال التشطيبات الفاخرة على مستوى المنطقة العربية، ونحدد معايير جديدة للتميز.',
                    'To be the leading company in luxury finishing in the Arab region, setting new standards of excellence.'
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 luxury-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-4 text-[#1A1A1A] dark:text-white">
                  {t('قيمنا', 'Our Values')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t(
                    'الجودة، الاحترافية، الالتزام بالمواعيد، الابتكار، ورضا العملاء هي أساس عملنا.',
                    'Quality, professionalism, commitment to deadlines, innovation, and customer satisfaction are the foundation of our work.'
                  )}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Members */}
      {/* <section className="py-20 bg-white dark:bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl mb-4 text-[#1A1A1A] dark:text-white">
              {t('فريق العمل', 'Our Team')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t(
                'تعرف على الفريق المحترف الذي يعمل على تحقيق أحلامك',
                'Meet the professional team working to make your dreams come true'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="overflow-hidden bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow"
              >
                <div className="relative h-64">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name[language]}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="mb-1">{member.name[language]}</h3>
                    <p className="text-sm text-white/80">{member.role[language]}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* Why Choose Us */}
      <section className="py-20 bg-[#1A1A1A] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">
              {t('لماذا تختار شركة البطل؟', 'Why Choose Elbatal?')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="text-5xl text-[#D4AF37] mb-4">500+</div>
              <h4 className="mb-2">{t('مشروع مكتمل', 'Completed Projects')}</h4>
              <p className="text-white/70 text-sm">
                {t('نفذنا مئات المشاريع بنجاح', 'Successfully completed hundreds of projects')}
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-5xl text-[#D4AF37] mb-4">15+</div>
              <h4 className="mb-2">{t('سنة خبرة', 'Years of Experience')}</h4>
              <p className="text-white/70 text-sm">
                {t('خبرة واسعة في المجال', 'Extensive experience in the field')}
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl text-[#D4AF37] mb-4">50+</div>
              <h4 className="mb-2">{t('موظف محترف', 'Professional Employees')}</h4>
              <p className="text-white/70 text-sm">
                {t('فريق متخصص وكفء', 'Specialized and competent team')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
