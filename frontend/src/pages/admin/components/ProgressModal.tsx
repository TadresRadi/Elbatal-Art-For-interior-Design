import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Progress } from '../../../components/ui/progress';
import { useState, useEffect } from 'react';
import type { Client, Translate } from '../types';

type ProgressModalProps = {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  onUpdateProgress: (clientId: number, progress: number) => void;
  t: Translate;
};

export function ProgressModal({ isOpen, onClose, client, onUpdateProgress, t }: ProgressModalProps) {
  const [progressValue, setProgressValue] = useState(client?.progress || 0);

  useEffect(() => {
    setProgressValue(client?.progress || 0);
  }, [client]);

  if (!isOpen || !client) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const progress = parseInt(formData.get('progress') as string);
    
    if (isNaN(progress) || progress < 0 || progress > 100) {
      alert(t('الرجاء إدخال نسبة مئوية صحيحة بين 0 و 100', 'Please enter a valid percentage between 0 and 100'));
      return;
    }

    onUpdateProgress(client.id, progress);
    onClose();
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 0 && value <= 100) {
      setProgressValue(value);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {t('تحديث تقدم العميل', 'Update Client Progress')}
          </h3>
          <Button size="sm" variant="ghost" onClick={onClose}>
            ✕
          </Button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('العميل', 'Client')}: {client.name || client.username}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('التقدم الحالي', 'Current Progress')}: {client.progress}%
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="progress">{t('نسبة التقدم (%)', 'Progress Percentage (%)')}</Label>
            <Input
              id="progress"
              name="progress"
              type="number"
              min="0"
              max="100"
              value={progressValue}
              onChange={handleProgressChange}
              placeholder="0-100"
              required
            />
          </div>

          <div>
            <Label>{t('معاينة التقدم', 'Progress Preview')}</Label>
            <div className="mt-2">
              <Progress value={progressValue} className="w-full" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {progressValue}%
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {t('تحديث', 'Update')}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              {t('إلغاء', 'Cancel')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
