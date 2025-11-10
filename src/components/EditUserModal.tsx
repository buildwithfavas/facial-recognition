import { useState, useCallback, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { updateFaceByIndex, type KnownFace } from '../features/faces/Recognition';

interface EditUserModalProps {
  show: boolean;
  onHide: () => void;
  face: KnownFace | null;
  faceIndex: number;
  onUserUpdated?: () => void;
}

export default function EditUserModal({ show, onHide, face, faceIndex, onUserUpdated }: EditUserModalProps) {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');

  useEffect(() => {
    if (face) {
      setName(face.name);
      setDob(face.dob || '');
      setGender(face.gender || '');
    }
  }, [face]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    try {
      // Update the face name using the Recognition module
      updateFaceByIndex(faceIndex, name.trim(), dob || undefined, gender || undefined);
      
      // Notify parent to refresh the list
      onUserUpdated?.();
      onHide();
      
      toast.success(`User "${name}" updated successfully!`);
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error('Failed to update user. Please try again.');
    }
  }, [name, faceIndex, onHide, onUserUpdated]);

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
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
      
      <Modal.Body style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', padding: '24px' }}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label style={{ fontSize: '14px', fontWeight: '500' }}>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '10px 12px'
              }}
            />
            <Form.Text style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
              Update the name for this registered user
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label style={{ fontSize: '14px', fontWeight: '500' }}>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '10px 12px',
                colorScheme: 'dark'
              }}
            />
            <Form.Text style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
              Used to calculate and display age
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-4">
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
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Form.Select>
          </Form.Group>

          <div className="d-flex gap-2">
            <Button 
              type="submit"
              className="flex-grow-1"
              style={{
                backgroundColor: 'var(--accent-blue)',
                border: 'none',
                padding: '10px',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              Save Changes
            </Button>
            <Button 
              variant="secondary"
              onClick={handleClose}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
                padding: '10px 20px',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
