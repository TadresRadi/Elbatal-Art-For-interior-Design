import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Check, X, Edit } from 'lucide-react';

interface EditableClientFieldProps {
  value: string | number;
  onSave: (value: string) => void;
  type?: 'text' | 'number';
  placeholder?: string;
  className?: string;
}

export function EditableClientField({ 
  value, 
  onSave, 
  type = 'text', 
  placeholder = '',
  className = ''
}: EditableClientFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value));

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(String(value));
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        <Input
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`text-sm ${className}`}
          autoFocus
        />
        <Button size="sm" onClick={handleSave} className="h-7 w-7 p-0">
          <Check className="h-3 w-3" />
        </Button>
        <Button size="sm" variant="outline" onClick={handleCancel} className="h-7 w-7 p-0">
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div 
      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded group"
      onClick={() => setIsEditing(true)}
    >
      <span className={className}>{value}</span>
      <Edit className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
    </div>
  );
}
