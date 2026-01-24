import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import type { CreateClientForm, Translate } from '../types';
import type { Dispatch, SetStateAction } from 'react';

type CreateClientModalProps = {
  isOpen: boolean;
  onClose: () => void;
  form: CreateClientForm;
  setForm: Dispatch<SetStateAction<CreateClientForm>>;
  onCreateClient: () => void;
  t: Translate;
};

export function CreateClientModal({
  isOpen,
  onClose,
  form,
  setForm,
  onCreateClient,
  t,
}: CreateClientModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl mb-4">{t('إنشاء عميل جديد', 'Create New Client')}</h2>
        <div className="space-y-3">
          <Input
            placeholder={t('اسم المشروع', 'Project Title')}
            value={form.project_title}
            onChange={(e) => setForm({ ...form, project_title: e.target.value })}
          />
          <Input
            placeholder={t('اسم المستخدم', 'Username')}
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <Input
            type="password"
            placeholder={t('كلمة المرور', 'Password')}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Input
            placeholder={t('الهاتف (اختياري)', 'Phone (Optional)')}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            placeholder={t('العنوان (اختياري)', 'Address (Optional)')}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <Input
            type="date"
            placeholder={t('تاريخ البدء', 'Start Date')}
            value={form.start_date}
            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
          />
          <Input
            type="date"
            placeholder={t('تاريخ الانتهاء المتوقع', 'Expected End Date')}
            value={form.expected_end_date}
            onChange={(e) => setForm({ ...form, expected_end_date: e.target.value })}
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>
              {t('إلغاء', 'Cancel')}
            </Button>
            <Button onClick={onCreateClient} className="bg-[#D4AF37] text-white">
              {t('إنشاء', 'Create')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
