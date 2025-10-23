import { useState } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  allowedTypes?: string[];
  maxSize?: number; // in bytes
}

export default function FileUpload({ onFileSelect, allowedTypes = ['image/*', 'application/pdf'], maxSize = 5 * 1024 * 1024 }: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);

    if (!file) return;

    // Check file type
    const fileType = file.type;
    const isAllowedType = allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        const category = type.split('/')[0];
        return fileType.startsWith(`${category}/`);
      }
      return type === fileType;
    });

    if (!isAllowedType) {
      setError('File type not allowed');
      return;
    }

    // Check file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    onFileSelect(file);
  };

  return (
    <div className="relative">
      <input
        type="file"
        onChange={handleFileChange}
        accept={allowedTypes.join(',')}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer text-[#dcddde] hover:text-white transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
      </label>
      {error && (
        <div className="absolute bottom-full mb-2 left-0 bg-[#f04747] text-white px-2 py-1 rounded text-sm whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
}