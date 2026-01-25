import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Edit, Trash2, Plus, Image as ImageIcon } from 'lucide-react';

interface WorkItem {
  id: number;
  title_ar: string;
  title_en: string;
  category: string;
  image: string;
  before_image?: string;
  after_image?: string;
  created_at: string;
  updated_at: string;
}

interface WorkItemsTableProps {
  list: WorkItem[];
  onEdit: (item: WorkItem) => void;
  onDelete: (id: number) => void;
  onCreateNew: () => void;
  t: (ar: string, en: string) => string;
  language: 'ar' | 'en';
}

export function WorkItemsTable({ list, onEdit, onDelete, onCreateNew, t, language }: WorkItemsTableProps) {
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'villa':
        return t('فيلا', 'Villa');
      case 'apartment':
        return t('شقة', 'Apartment');
      case 'office':
        return t('مكتب', 'Office');
      default:
        return category;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('عناصر العمل', 'Work Items')}</h2>
        <Button onClick={onCreateNew} className="bg-[#D4AF37] hover:bg-[#B8941F] text-white">
          <Plus className="h-4 w-4 mr-2" />
          {t('إضافة عنصر جديد', 'Add New Item')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              {item.image ? (
                <ImageWithFallback
                  src={item.image.startsWith('http') ? item.image : `http://127.0.0.1:8000${item.image}`}
                  alt={language === 'ar' ? item.title_ar : item.title_en}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <Badge className="absolute top-2 right-2 bg-[#D4AF37] text-white">
                {getCategoryLabel(item.category)}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 text-[#1A1A1A] dark:text-white">
                {language === 'ar' ? item.title_ar : item.title_en}
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                {t('تم الإنشاء:', 'Created:')} {new Date(item.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
              </p>
              {(item.before_image || item.after_image) && (
                <div className="text-sm text-[#D4AF37] mb-3">
                  {item.before_image && item.after_image 
                    ? t('متوفر قبل وبعد', 'Before & After Available')
                    : item.before_image 
                    ? t('متوفر صورة قبل', 'Before Image Available')
                    : t('متوفر صورة بعد', 'After Image Available')
                  }
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(item)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  {t('تعديل', 'Edit')}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(item.id)}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  {t('حذف', 'Delete')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {list.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">{t('لا توجد عناصر عمل', 'No work items found')}</p>
          <Button onClick={onCreateNew} className="bg-[#D4AF37] hover:bg-[#B8941F] text-white">
            <Plus className="h-4 w-4 mr-2" />
            {t('إضافة عنصر جديد', 'Add New Item')}
          </Button>
        </div>
      )}
    </div>
  );
}
