import { Modal, Button, Accordion } from 'react-bootstrap';

interface HelpModalProps {
  show: boolean;
  onHide: () => void;
}

export default function HelpModal({ show, onHide }: HelpModalProps) {
  return (
    <Modal 
      show={show} 
      onHide={onHide}
      size="lg"
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
        <Modal.Title>How to Use Face Recognition</Modal.Title>
      </Modal.Header>
      
      <Modal.Body style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>
        <Accordion defaultActiveKey="0">
          <Accordion.Item 
            eventKey="0"
            style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', marginBottom: '8px' }}
          >
            <Accordion.Header style={{ backgroundColor: 'var(--bg-secondary)' }}>
              🎥 Getting Started
            </Accordion.Header>
            <Accordion.Body style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>
              <ol>
                <li>Click <strong>"Start"</strong> button</li>
                <li>Allow camera permissions when prompted</li>
                <li>Position your face in the camera view</li>
                <li>Detection starts automatically with a blue box around faces</li>
              </ol>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item 
            eventKey="1"
            style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', marginBottom: '8px' }}
          >
            <Accordion.Header>
              👤 Registering People
            </Accordion.Header>
            <Accordion.Body style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>
              <ol>
                <li>When a face is detected as "Unknown"</li>
                <li>Click the <strong>"Register"</strong> button next to their info</li>
                <li>Enter the person's name in the dialog</li>
                <li>Click "Register Face"</li>
                <li>✅ Next time they appear, their name will show automatically!</li>
              </ol>
              <div className="alert alert-info mt-3" style={{ backgroundColor: 'var(--bg-secondary)', border: 'none', color: 'var(--text-secondary)' }}>
                <strong>Tip:</strong> Registered names appear in <span style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>blue</span>
              </div>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item 
            eventKey="2"
            style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', marginBottom: '8px' }}
          >
            <Accordion.Header>
              🗂️ Managing Registered Faces
            </Accordion.Header>
            <Accordion.Body style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>
              <ol>
                <li>Click <strong>"Manage Faces"</strong> button</li>
                <li>View all registered people</li>
                <li>Delete individual faces or clear all</li>
              </ol>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item 
            eventKey="3"
            style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', marginBottom: '8px' }}
          >
            <Accordion.Header>
              📤 Upload Image
            </Accordion.Header>
            <Accordion.Body style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>
              <p>You can also detect faces in uploaded images:</p>
              <ol>
                <li>Click or drag image to the upload area</li>
                <li>Faces will be detected automatically</li>
                <li>Register unknown faces same way as webcam</li>
              </ol>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item 
            eventKey="4"
            style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', marginBottom: '8px' }}
          >
            <Accordion.Header>
              🎨 Emotion Colors
            </Accordion.Header>
            <Accordion.Body style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>
              <p>Face boxes change color based on detected emotion:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
                <div><span style={{ color: '#10b981', fontWeight: 'bold' }}>● Green</span> - Happy</div>
                <div><span style={{ color: '#ef4444', fontWeight: 'bold' }}>● Red</span> - Angry</div>
                <div><span style={{ color: '#3b82f6', fontWeight: 'bold' }}>● Blue</span> - Sad</div>
                <div><span style={{ color: '#f59e0b', fontWeight: 'bold' }}>● Orange</span> - Surprised</div>
                <div><span style={{ color: '#14b8a6', fontWeight: 'bold' }}>● Teal</span> - Neutral</div>
                <div><span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>● Purple</span> - Disgusted</div>
                <div><span style={{ color: '#6366f1', fontWeight: 'bold' }}>● Indigo</span> - Fearful</div>
              </div>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item 
            eventKey="5"
            style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
          >
            <Accordion.Header>
              🔒 Privacy & Storage
            </Accordion.Header>
            <Accordion.Body style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>
              <ul>
                <li>✅ All data stored <strong>locally</strong> in your browser</li>
                <li>✅ No photos saved - only facial features (mathematical vectors)</li>
                <li>✅ No data sent to any server</li>
                <li>✅ Clear browser data = removes all registrations</li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Modal.Body>
      
      <Modal.Footer 
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderTop: '1px solid var(--border-color)' 
        }}
      >
        <Button 
          variant="primary" 
          onClick={onHide}
        >
          Got it!
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
