import { useState, useCallback } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import type { FaceResult } from '../features/faces/types';
import { addKnownFace } from '../features/faces/Recognition';
import DatePicker from './DatePicker';

interface RegisterFaceModalProps {
  show: boolean;
  onHide: () => void;
  faceToRegister: FaceResult | null;
  onRegistered?: () => void;
}

export default function RegisterFaceModal({ show, onHide, faceToRegister, onRegistered }: RegisterFaceModalProps) {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!faceToRegister?.features) {
      toast.error('No face detected');
      return;
    }

    setIsSubmitting(true);
    try {
      // Save the face with the provided name
      addKnownFace(name.trim(), faceToRegister.features, dob || undefined, gender || undefined);
      
      // Reset and close
      setName('');
      setDob('');
      setGender('');
      onRegistered?.();
      onHide();
    } catch (error) {
      console.error('Failed to register face:', error);
      toast.error('Failed to register face. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [name, dob, gender, faceToRegister, onHide, onRegistered]);

  const handleClose = useCallback(() => {
    setName('');
    setDob('');
    setGender('');
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
        <Modal.Title>Register New Face</Modal.Title>
      </Modal.Header>
      
      <Modal.Body style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Person's Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)'
              }}
            />
            <Form.Text style={{ color: 'var(--text-secondary)' }}>
              This name will be displayed when this person is detected again.
            </Form.Text>
          </Form.Group>

          <DatePicker
            value={dob}
            onChange={setDob}
            label="Date of Birth"
            helpText="Used to calculate and display age when detected"
            required
          />

          <Form.Group className="mb-3">
            <Form.Label>Gender</Form.Label>
            <Form.Select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="" disabled hidden>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Form.Select>
          </Form.Group>

          {faceToRegister && (
            <div className="mb-3">
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Face Information:
              </p>
              <ul style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                {faceToRegister.age && <li>Age: ~{faceToRegister.age} years</li>}
                {faceToRegister.gender && <li>Gender: {faceToRegister.gender}</li>}
                {faceToRegister.expressions && (
                  <li>
                    Emotion: {Object.entries(faceToRegister.expressions)
                      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
                  </li>
                )}
              </ul>
            </div>
          )}

          <div className="d-flex gap-2 justify-content-end">
            <Button 
              variant="secondary" 
              onClick={handleClose}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register Face'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
