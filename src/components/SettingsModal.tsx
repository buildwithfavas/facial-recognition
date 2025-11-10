import { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';

export type SettingsModalProps = {
  show: boolean;
  onHide: () => void;
  showExpressions: boolean;
  onChangeShowExpressions: (enabled: boolean) => void;
  intervalMs: number;
  onChangeInterval: (ms: number) => void;
  useTiny: boolean;
  onChangeUseTiny: (v: boolean) => void;
  minConfidence: number; // 0..1
  onChangeMinConfidence: (v: number) => void;
  facingMode: 'user' | 'environment';
  onChangeFacingMode: (v: 'user' | 'environment') => void;
};

const KEY_EXPR = 'app.settings.showExpressions';
const KEY_INT = 'app.settings.intervalMs';
const KEY_TINY = 'app.settings.useTiny';
const KEY_CONF = 'app.settings.minConfidence';
const KEY_FACING = 'app.settings.facingMode';

export default function SettingsModal(props: SettingsModalProps) {
  const {
    show,
    onHide,
    showExpressions,
    onChangeShowExpressions,
    intervalMs,
    onChangeInterval,
    useTiny,
    onChangeUseTiny,
    minConfidence,
    onChangeMinConfidence,
    facingMode,
    onChangeFacingMode,
  } = props;

  const [localExpr, setLocalExpr] = useState<boolean>(showExpressions);
  const [localInt, setLocalInt] = useState<number>(intervalMs);
  const [localTiny, setLocalTiny] = useState<boolean>(useTiny);
  const [localConf, setLocalConf] = useState<number>(minConfidence);
  const [localFacing, setLocalFacing] = useState<'user' | 'environment'>(facingMode);

  useEffect(() => {
    setLocalExpr(showExpressions);
    setLocalInt(intervalMs);
    setLocalTiny(useTiny);
    setLocalConf(minConfidence);
    setLocalFacing(facingMode);
  }, [showExpressions, intervalMs, useTiny, minConfidence, facingMode, show]);

  const handleSave = () => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(KEY_EXPR, JSON.stringify(localExpr));
        localStorage.setItem(KEY_INT, JSON.stringify(localInt));
        localStorage.setItem(KEY_TINY, JSON.stringify(localTiny));
        localStorage.setItem(KEY_CONF, JSON.stringify(localConf));
        localStorage.setItem(KEY_FACING, JSON.stringify(localFacing));
      }
    } catch {
      // localStorage may not be available in some environments
    }
    onChangeShowExpressions(localExpr);
    onChangeInterval(Math.max(100, Math.min(2000, Math.round(localInt))));
    onChangeUseTiny(localTiny);
    onChangeMinConfidence(Math.max(0.05, Math.min(0.99, localConf)));
    onChangeFacingMode(localFacing);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="g-3">
          <Col xs={12}>
            <Form.Check
              type="switch"
              id="toggle-expressions"
              label="Enable Emotion Recognition"
              checked={localExpr}
              onChange={(e) => setLocalExpr(e.currentTarget.checked)}
            />
          </Col>
          <Col xs={12} md={6}>
            <Form.Group controlId="detection-interval">
              <Form.Label>Detection frequency (ms)</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  min={100}
                  max={2000}
                  step={25}
                  value={localInt}
                  onChange={(e) => setLocalInt(parseInt(e.currentTarget.value || '0', 10))}
                />
                <InputGroup.Text>ms</InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Form.Group controlId="model-select">
              <Form.Label>Model</Form.Label>
              <Form.Select value={localTiny ? 'tiny' : 'ssd'} onChange={(e) => setLocalTiny(e.currentTarget.value === 'tiny')}>
                <option value="tiny">Tiny Face Detector (faster)</option>
                <option value="ssd">SSD MobileNet V1 (more accurate)</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Form.Group controlId="min-confidence">
              <Form.Label>Confidence threshold</Form.Label>
              <Form.Range
                min={0.05}
                max={0.99}
                step={0.01}
                value={localConf}
                onChange={(e) => setLocalConf(parseFloat(e.currentTarget.value))}
              />
              <div aria-live="polite" className="small text-muted">{localConf.toFixed(2)}</div>
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Form.Group controlId="facing-mode">
              <Form.Label>Camera (mobile)</Form.Label>
              <Form.Select value={localFacing} onChange={(e) => setLocalFacing(e.currentTarget.value as 'user' | 'environment')}>
                <option value="user">Front (user)</option>
                <option value="environment">Back (environment)</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSave}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}
