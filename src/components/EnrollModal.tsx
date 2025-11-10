import { useEffect, useMemo, useState } from 'react';
import { Modal, Button, Form, Row, Col, Image, Toast, ToastContainer } from 'react-bootstrap';
import { addKnownFace } from '../features/faces/Recognition';

export type EnrollModalProps = {
  show: boolean;
  onHide: () => void;
  descriptor: Float32Array | number[] | null;
  thumbnailDataUrl?: string;
  defaultName?: string;
};

export default function EnrollModal({ show, onHide, descriptor, thumbnailDataUrl, defaultName = '' }: EnrollModalProps) {
  const [name, setName] = useState<string>(defaultName);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  useEffect(() => {
    if (show) {
      setName(defaultName);
      setSaving(false);
    }
  }, [show, defaultName]);

  const canSave = useMemo(() => Boolean(descriptor && name.trim().length > 0), [descriptor, name]);

  const handleSave = async () => {
    if (!descriptor) return;
    setSaving(true);
    try {
      addKnownFace(name.trim(), descriptor);
      setToast({ show: true, message: `Enrolled ${name.trim()}` });
      setTimeout(() => {
        setSaving(false);
        onHide();
      }, 800);
    } catch (e) {
      setSaving(false);
      setToast({ show: true, message: 'Failed to enroll. Please try again.' });
      console.error(e);
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enroll Face</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3 align-items-center">
            <Col xs="auto">
              {thumbnailDataUrl ? (
                <Image src={thumbnailDataUrl} rounded width={96} height={96} style={{ objectFit: 'cover', background: '#000' }} />
              ) : (
                <div className="rounded border" style={{ width: 96, height: 96, background: '#000' }} />)
              }
            </Col>
            <Col>
              <Form.Group controlId="enrollName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </Form.Group>
              {!descriptor && (
                <div className="text-danger small mt-2">Descriptor not available. Capture a face first.</div>
              )}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={!canSave || saving}>
            {saving ? 'Saving…' : 'Enroll'}
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-end" className="p-3">
        <Toast bg="success" show={toast.show} onClose={() => setToast({ show: false, message: '' })} delay={2000} autohide>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}
