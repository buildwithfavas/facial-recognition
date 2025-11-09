import { useCallback } from 'react';
import { Navbar as BsNavbar, Container, Button, ButtonGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../app/store';
import { selectStreaming, startStream, stopStream } from '../features/camera/CameraSlice';

type Props = {
  onUploadClick?: () => void;
  title?: string;
};

export default function Navbar({ onUploadClick, title = 'Facial Recognition' }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const streaming = useSelector(selectStreaming);

  const handleStart = useCallback(() => dispatch(startStream()), [dispatch]);
  const handleStop = useCallback(() => dispatch(stopStream()), [dispatch]);

  return (
    <BsNavbar bg="light" expand="md" className="mb-3 border-bottom">
      <Container fluid>
        <BsNavbar.Brand className="fw-semibold">{title}</BsNavbar.Brand>
        <div className="ms-auto d-flex align-items-center">
          <ButtonGroup>
            <Button variant="success" onClick={handleStart} disabled={streaming}>
              Start
            </Button>
            <Button variant="secondary" onClick={handleStop} disabled={!streaming}>
              Stop
            </Button>
            <Button variant="primary" onClick={onUploadClick}>
              Upload
            </Button>
          </ButtonGroup>
        </div>
      </Container>
    </BsNavbar>
  );
}
