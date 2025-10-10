import { useApp } from '../lib/context';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { useState } from 'react';

export function ContactPage() {
  const { t } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', 'Your message has been sent successfully! We will contact you soon.'));
    setFormData({ name: '', phone: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl mb-4">{t('تواصل معنا', 'Contact Us')}</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            {t(
              'نحن هنا للإجابة على جميع استفساراتك ومساعدتك في تحقيق أحلامك',
              'We are here to answer all your questions and help you achieve your dreams'
            )}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-white dark:bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <div className="space-y-6">
              <Card className="bg-white dark:bg-gray-800 luxury-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg gold-gradient flex items-center justify-center mb-4">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2 text-[#1A1A1A] dark:text-white">
                    {t('الهاتف', 'Phone')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    +20 123 456 7890
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    +20 100 123 4567
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 luxury-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg gold-gradient flex items-center justify-center mb-4">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2 text-[#1A1A1A] dark:text-white">
                    {t('البريد الإلكتروني', 'Email')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    info@elbatalart.com
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    support@elbatalart.com
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 luxury-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg gold-gradient flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2 text-[#1A1A1A] dark:text-white">
                    {t('العنوان', 'Address')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {t(
                      '123 شارع التحرير، القاهرة، مصر',
                      '123 Tahrir Street, Cairo, Egypt'
                    )}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 luxury-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg gold-gradient flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2 text-[#1A1A1A] dark:text-white">
                    {t('ساعات العمل', 'Working Hours')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                    {t('السبت - الخميس', 'Saturday - Thursday')}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {t('9:00 صباحاً - 6:00 مساءً', '9:00 AM - 6:00 PM')}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-white dark:bg-gray-800 luxury-shadow">
                <CardContent className="p-8">
                  <h2 className="text-2xl md:text-3xl mb-6 text-[#1A1A1A] dark:text-white">
                    {t('أرسل لنا رسالة', 'Send Us a Message')}
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block mb-2 text-gray-700 dark:text-gray-300">
                        {t('الاسم', 'Name')}
                      </label>
                      <Input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder={t('أدخل اسمك', 'Enter your name')}
                        className="w-full"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block mb-2 text-gray-700 dark:text-gray-300">
                          {t('رقم الهاتف', 'Phone Number')}
                        </label>
                        <Input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder={t('أدخل رقم هاتفك', 'Enter your phone number')}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-gray-700 dark:text-gray-300">
                          {t('البريد الإلكتروني', 'Email')}
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder={t(
                            'أدخل بريدك الإلكتروني (اختياري)',
                            'Enter your email (optional)'
                          )}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-gray-700 dark:text-gray-300">
                        {t('الرسالة', 'Message')}
                      </label>
                      <Textarea
                        required
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        placeholder={t('اكتب رسالتك هنا...', 'Write your message here...')}
                        className="w-full min-h-[150px]"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="bg-[#D4AF37] hover:bg-[#B8941F] text-white w-full"
                    >
                      <Send className="mr-2 h-5 w-5 rtl:ml-2" />
                      {t('إرسال الرسالة', 'Send Message')}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl mb-8 text-center text-[#1A1A1A] dark:text-white">
            {t('موقعنا', 'Our Location')}
          </h2>
          <div className="rounded-lg overflow-hidden luxury-shadow h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.6094234089456!2d31.235712!3d30.044419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583fa60b21beeb%3A0x79dfb296e8423bba!2sCairo%2C%20Egypt!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
