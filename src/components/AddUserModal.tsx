import { useState, useCallback, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import * as faceapi from '@vladmandic/face-api';
import { addKnownFace } from '../features/faces/Recognition';
import { init } from '../features/faces/FaceService';
import DatePicker from './DatePicker';

interface AddUserModalProps {
  show: boolean;
  onHide: () => void;
  onUserAdded?: () => void;
}

export default function AddUserModal({ show, onHide, onUserAdded }: AddUserModalProps) {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Please upload a valid image file');
    }
  }, []);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields
    if (!name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    if (!dob) {
      toast.error('Please select date of birth');
      return;
    }

    if (!gender) {
      toast.error('Please select gender');
      return;
    }

    if (!imageFile) {
      toast.error('Please upload an image');
      return;
    }

    setIsSubmitting(true);

    try {
      // Load face-api models if not already loaded
      await init();

      // Create an image element to process
      const img = document.createElement('img');
      img.src = imagePreview;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Detect face and extract descriptor
      const detection = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        toast.error('No face detected in the image. Please upload a clear image with a visible face.');
        setIsSubmitting(false);
        return;
      }

      // Add the face to the database
      addKnownFace(name.trim(), detection.descriptor, dob || undefined, gender || undefined);

      // Reset form
      setName('');
      setDob('');
      setGender('');
      setImageFile(null);
      setImagePreview('');
      
      // Notify parent
      onUserAdded?.();
      onHide();
      
      toast.success(`User "${name}" added successfully!`);
    } catch (error) {
      console.error('Failed to add user:', error);
      toast.error('Failed to add user. Please try again with a different image.');
    } finally {
      setIsSubmitting(false);
    }
  }, [name, dob, gender, imageFile, imagePreview, onHide, onUserAdded]);

  const handleClose = useCallback(() => {
    setName('');
    setDob('');
    setGender('');
    setImageFile(null);
    setImagePreview('');
    onHide();
  }, [onHide]);

  return (
    <Modal 
      show={show} 
      onHide={handleClose}
      centered
      contentClassName="border-0"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
    >
      <Modal.Header 
        closeButton 
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderBottom: '1px solid var(--border-color)',
          color: 'var(--text-primary)'
        }}
      >
        <Modal.Title>Upload Image</Modal.Title>
      </Modal.Header>
      
      <Modal.Body style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', padding: '24px' }}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontSize: '14px', fontWeight: '500' }}>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '10px 12px'
              }}
            />
          </Form.Group>

          <DatePicker
            value={dob}
            onChange={setDob}
            label="Date of Birth"
            helpText="Used to calculate and display age"
            required
          />

          <Form.Group className="mb-3">
            <Form.Label style={{ fontSize: '14px', fontWeight: '500' }}>Gender</Form.Label>
            <Form.Select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '10px 12px'
              }}
            >
              <option value="" disabled hidden>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label style={{ fontSize: '14px', fontWeight: '500' }}>Image</Form.Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            <div
              onClick={handleUploadClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${isDragging ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                borderRadius: '8px',
                padding: '40px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: isDragging ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-secondary)',
                transition: 'all 0.2s'
              }}
            >
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '6px' }}
                />
              ) : (
                <>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '12px' }}>
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 8L12 3L7 8" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 3V15" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '4px', fontSize: '14px' }}>
                    Click to upload or drag and drop
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '12px', margin: 0 }}>
                    PNG, JPG, or JPEG (MAX. 10MB)
                  </p>
                </>
              )}
            </div>
          </Form.Group>

          <Button 
            type="submit"
            className="w-100 d-flex align-items-center justify-content-center gap-2"
            disabled={isSubmitting}
            style={{
              backgroundColor: 'var(--accent-blue)',
              border: 'none',
              padding: '12px',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 8L12 3L7 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 3V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {isSubmitting ? 'Processing...' : 'Upload'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
