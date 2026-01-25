import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface WorkItem {
  id?: number;
  title_ar: string;
  title_en: string;
  category: string;
  image?: string;
  before_image?: string;
  after_image?: string;
}

interface CreateWorkItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: WorkItem | null;
  onSave: (item: WorkItem, files?: { image?: File; before_image?: File; after_image?: File }) => void;
  t: (ar: string, en: string) => string;
  language: 'ar' | 'en';
}

export function CreateWorkItemModal({ isOpen, onClose, item, onSave, t, language }: CreateWorkItemModalProps) {
  const [formData, setFormData] = useState<WorkItem>({
    title_ar: '',
    title_en: '',
    category: 'apartment',
    image: '',
    before_image: '',
    after_image: '',
  });

  const [beforeImageFile, setBeforeImageFile] = useState<File | null>(null);
  const [afterImageFile, setAfterImageFile] = useState<File | null>(null);
  const [beforeImagePreview, setBeforeImagePreview] = useState<string>('');
  const [afterImagePreview, setAfterImagePreview] = useState<string>('');

  useEffect(() => {
    if (item) {
      setFormData(item);
      setBeforeImagePreview(item.before_image ? (item.before_image.startsWith('http') ? item.before_image : `http://127.0.0.1:8000${item.before_image}`) : '');
      setAfterImagePreview(item.after_image ? (item.after_image.startsWith('http') ? item.after_image : `http://127.0.0.1:8000${item.after_image}`) : '');
    } else {
      setFormData({
        title_ar: '',
        title_en: '',
        category: 'apartment',
        image: '',
        before_image: '',
        after_image: '',
      });
      setBeforeImagePreview('');
      setAfterImagePreview('');
      setBeforeImageFile(null);
      setAfterImageFile(null);
    }
  }, [item, isOpen]);

  const handleImageChange = (file: File | null, type: 'before_image' | 'after_image') => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        switch (type) {
          case 'before_image':
            setBeforeImageFile(file);
            setBeforeImagePreview(result);
            break;
          case 'after_image':
            setAfterImageFile(file);
            setAfterImagePreview(result);
            break;
        }
      };
      reader.readAsDataURL(file);
    } else {
      switch (type) {
        case 'before_image':
          setBeforeImageFile(null);
          setBeforeImagePreview('');
          break;
        case 'after_image':
          setAfterImageFile(null);
          setAfterImagePreview('');
          break;
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title_ar.trim() || !formData.title_en.trim()) {
      alert(t('يرجى ملء جميع الحقول المطلوبة', 'Please fill all required fields'));
      return;
    }

    const files: { before_image?: File; after_image?: File } = {};
    if (beforeImageFile) files.before_image = beforeImageFile;
    if (afterImageFile) files.after_image = afterImageFile;

    onSave(formData, Object.keys(files).length > 0 ? files : undefined);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {item ? t('تعديل عنصر العمل', 'Edit Work Item') : t('إضافة عنصر عمل جديد', 'Add New Work Item')}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title_ar">{t('العنوان بالعربية', 'Title (Arabic)')} *</Label>
                <Input
                  id="title_ar"
                  value={formData.title_ar}
                  onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="title_en">{t('العنوان بالإنجليزية', 'Title (English)')} *</Label>
                <Input
                  id="title_en"
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category">{t('الفئة', 'Category')}</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">{t('شقة', 'Apartment')}</SelectItem>
                  <SelectItem value="villa">{t('فيلا', 'Villa')}</SelectItem>
                  <SelectItem value="office">{t('مكتب', 'Office')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Before/After Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{t('صورة قبل (اختياري)', 'Before Image (Optional)')}</Label>
                <div className="mt-2">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {beforeImagePreview ? (
                      <div className="relative">
                        <img
                          src={beforeImagePreview}
                          alt="Before Preview"
                          className="w-full h-32 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => handleImageChange(null, 'before_image')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e.target.files?.[0] || null, 'before_image')}
                          className="hidden"
                          id="before-image-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('before-image-upload')?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {t('اختر صورة', 'Choose Image')}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <Label>{t('صورة بعد (الصورة الرئيسية)', 'After Image (Main Image)')}</Label>
                <div className="mt-2">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {afterImagePreview ? (
                      <div className="relative">
                        <img
                          src={afterImagePreview}
                          alt="After Preview"
                          className="w-full h-32 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => handleImageChange(null, 'after_image')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e.target.files?.[0] || null, 'after_image')}
                          className="hidden"
                          id="after-image-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('after-image-upload')?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {t('اختر صورة', 'Choose Image')}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                {t('إلغاء', 'Cancel')}
              </Button>
              <Button type="submit" className="bg-[#D4AF37] hover:bg-[#B8941F] text-white">
                {item ? t('تحديث', 'Update') : t('إضافة', 'Add')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
