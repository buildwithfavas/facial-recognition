import { useCallback, useRef, useState, type ChangeEvent, type DragEvent } from 'react';

type Props = {
  onUpload: (dataUrl: string) => void;
};

export default function UploadImage({ onUpload }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const processFile = useCallback((file: File) => {
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string | null;
      if (result) {
        onUpload(result);
      }
    };
    reader.readAsDataURL(file);
  }, [onUpload]);

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          backgroundColor: isDragging ? 'var(--bg-secondary)' : '#374151',
          border: `2px dashed ${isDragging ? 'var(--accent-blue)' : 'var(--border-color)'}`,
          borderRadius: '8px',
          padding: '40px 20px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <svg 
          width="48" 
          height="48" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ margin: '0 auto 16px', display: 'block', opacity: 0.6 }}
        >
          <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
          Click to upload or drag and drop
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          Or upload an image to begin
        </div>
      </div>
    </div>
  );
}
