import { useApp } from '../lib/context';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { Badge } from '../components/ui/badge';
import api from '../lib/api';

export function WorksPage() {
  const { t, language } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [beforeAfterSlider, setBeforeAfterSlider] = useState(50);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: 'all', label: { ar: 'الكل', en: 'All' } },
    { value: 'apartment', label: { ar: 'شقق', en: 'Apartments' } },
    { value: 'villa', label: { ar: 'فلل', en: 'Villas' } },
    { value: 'office', label: { ar: 'مكاتب', en: 'Offices' } },
  ];

  useEffect(() => {
    const loadWorkItems = async () => {
      try {
        const res = await api.get('work-items/');
        const transformedData = res.data.map((item: any) => ({
          id: item.id,
          title: { 
            ar: item.title_ar, 
            en: item.title_en 
          },
          category: item.category,
          image: item.image ? (item.image.startsWith('http') ? item.image : `http://127.0.0.1:8000${item.image}`) : (item.after_image ? (item.after_image.startsWith('http') ? item.after_image : `http://127.0.0.1:8000${item.after_image}`) : ''),
          beforeImage: item.before_image ? (item.before_image.startsWith('http') ? item.before_image : `http://127.0.0.1:8000${item.before_image}`) : undefined,
          afterImage: item.after_image ? (item.after_image.startsWith('http') ? item.after_image : `http://127.0.0.1:8000${item.after_image}`) : undefined,
        }));
        setProjects(transformedData);
      } catch (err) {
        console.error('Error loading work items:', err);
        // Fallback to hardcoded data if API fails
        setProjects([
          {
            id: 1,
            title: { ar: 'فيلا فاخرة - التجمع الخامس', en: 'Luxury Villa - Fifth Settlement' },
            category: 'villa',
            image: 'https://images.unsplash.com/photo-1668365011614-9c4a49a0e89d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB2aWxsYSUyMGludGVyaW9yfGVufDF8fHx8MTc1OTk0NTkxM3ww&ixlib=rb-4.1.0&q=80&w=1080',
            beforeImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800',
            afterImage: 'https://images.unsplash.com/photo-1668365011614-9c4a49a0e89d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB2aWxsYSUyMGludGVyaW9yfGVufDF8fHx8MTc1OTk0NTkxM3ww&ixlib=rb-4.1.0&q=80&w=1080',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadWorkItems();
  }, []);

  const filteredProjects =
    selectedCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  const selectedProjectData = projects.find((p) => p.id === selectedProject);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl mb-4">
            {t('معرض أعمالنا', 'Our Works Gallery')}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            {t(
              'استكشف مجموعة من أفضل مشاريعنا المنجزة بأعلى معايير الجودة والفخامة',
              'Explore a collection of our finest completed projects with the highest standards of quality and luxury'
            )}
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? 'default' : 'outline'}
                className={
                  selectedCategory === category.value
                    ? 'bg-[#D4AF37] hover:bg-[#B8941F] text-white'
                    : ''
                }
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label[language]}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto"></div>
              <p className="mt-4 text-gray-600">{t('جاري التحميل...', 'Loading...')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="overflow-hidden cursor-pointer hover:shadow-xl transition-shadow bg-white dark:bg-gray-800"
                  onClick={() => setSelectedProject(project.id)}
                >
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title[language]}
                      className="w-full h-full object-cover transition-transform hover:scale-110"
                    />
                    <Badge className="absolute top-4 left-4 bg-[#D4AF37] text-white">
                      {project.category === 'villa'
                        ? t('فيلا', 'Villa')
                        : project.category === 'apartment'
                        ? t('شقة', 'Apartment')
                        : t('مكتب', 'Office')}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-[#1A1A1A] dark:text-white">
                      {project.title[language]}
                    </h3>
                    {project.beforeImage && project.afterImage && (
                      <p className="text-sm text-[#D4AF37] mt-2">
                        {t('شاهد قبل وبعد', 'View Before & After')}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('لا توجد مشاريع في هذه الفئة', 'No projects in this category')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Before/After Modal */}
      {selectedProject && selectedProjectData?.beforeImage && selectedProjectData?.afterImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl text-[#1A1A1A] dark:text-white">
                {selectedProjectData.title[language]}
              </h3>
              <Button variant="ghost" onClick={() => setSelectedProject(null)}>
                ✕
              </Button>
            </div>

            {/* Before/After Slider */}
            <div className="relative h-96 overflow-hidden rounded-lg">
              <div className="absolute inset-0">
                <ImageWithFallback
                  src={selectedProjectData.beforeImage}
                  alt="Before"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded">
                  {t('قبل', 'Before')}
                </div>
              </div>
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - beforeAfterSlider}% 0 0)` }}
              >
                <ImageWithFallback
                  src={selectedProjectData.afterImage}
                  alt="After"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded">
                  {t('بعد', 'After')}
                </div>
              </div>
              <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
                style={{ left: `${beforeAfterSlider}%` }}
              >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                  ⟷
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={beforeAfterSlider}
                onChange={(e) => setBeforeAfterSlider(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
              />
            </div>

            <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
              {t('اسحب المؤشر لمقارنة قبل وبعد', 'Drag the slider to compare before and after')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
