import { useCallback, useRef, useState, type ChangeEvent } from 'react';

type Props = {
  onUpload: (dataUrl: string) => void;
};

export default function UploadImage({ onUpload }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!['image/png', 'image/jpeg'].includes(file.type)) {
        // Ignore unsupported file types silently as per requirements
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string | null;
        if (result) {
          setPreview(result);
          onUpload(result);
        }
      };
      reader.readAsDataURL(file);
    },
    [onUpload]
  );

  const triggerReupload = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.click();
    }
  }, []);

  return (
    <div className="d-flex flex-column align-items-start gap-2 w-100">
      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg"
        className="form-control"
        onChange={handleFileChange}
      />
      {preview && (
        <div className="w-100">
          <img src={preview} alt="Preview" className="img-fluid rounded border" />
          <button type="button" className="btn btn-outline-secondary mt-2" onClick={triggerReupload}>
            Re-upload
          </button>
        </div>
      )}
    </div>
  );
}
