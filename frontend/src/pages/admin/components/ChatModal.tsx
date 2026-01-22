import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { FileText } from 'lucide-react';
import type { Client, Translate } from '../types';
import type { Dispatch, RefObject, SetStateAction } from 'react';

type ChatModalProps = {
  modalChat: Client | null;
  t: Translate;
  onClose: () => void;
  chatRef: RefObject<HTMLDivElement | null>;
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
  selectedFile: File | null;
  setSelectedFile: Dispatch<SetStateAction<File | null>>;
  onSendMessage: () => void | Promise<void>;
  onTestMessage: () => void | Promise<void>;
};

export function ChatModal({
  modalChat,
  t,
  onClose,
  chatRef,
  message,
  setMessage,
  selectedFile,
  setSelectedFile,
  onSendMessage,
  onTestMessage,
}: ChatModalProps) {
  if (!modalChat) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-lg p-4 flex flex-col">
        <div className="flex justify-between items-center border-b pb-2 mb-2">
          <h3 className="font-bold">
            {t('محادثة مع', 'Chat with')} {modalChat.username}
          </h3>
          <Button size="sm" variant="ghost" onClick={onClose}>
            ✕
          </Button>
        </div>

        <div ref={chatRef} className="flex-1 overflow-y-auto space-y-2 mb-3">
          {modalChat.messages?.map((m) => (
            <div
              key={m.id}
              className={`p-2 rounded-lg max-w-[75%] ${
                m.sender === 'admin' ? 'bg-yellow-200 ml-auto text-right' : 'bg-gray-200 mr-auto'
              }`}
            >
              <p>{m.content}</p>
              {m.file_url && (
                <a
                  href={m.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-1 text-blue-500 underline"
                >
                  📎 View File
                </a>
              )}
              <small className="text-xs text-gray-500">{new Date(m.timestamp).toLocaleString()}</small>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-3">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('اكتب رسالة...', 'Type message...')}
            className="flex-1"
          />
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="hidden"
            id="file-upload"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
            className="px-3"
          >
            <FileText className="h-4 w-4" />
          </Button>
        </div>
        {selectedFile && (
          <div className="flex items-center gap-2 p-2 bg-gray-100 rounded mb-2">
            <span className="text-sm flex-1 truncate">{selectedFile.name}</span>
            <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedFile(null)}>
              ✕
            </Button>
          </div>
        )}
        <div className="flex gap-2">
          <Button onClick={onSendMessage}>{t('إرسال', 'Send')}</Button>

          <Button variant="outline" onClick={onTestMessage}>
            Test Message
          </Button>
        </div>
      </div>
    </div>
  );
}
