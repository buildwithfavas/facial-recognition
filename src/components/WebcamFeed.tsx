import { useCallback, useMemo, useRef } from 'react';
import Webcam from 'react-webcam';
import { Button, ButtonGroup, Card, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../app/store';
import { selectDeviceId, selectStreaming, startStream, stopStream } from '../features/camera/CameraSlice';

interface WebcamFeedProps {
  onCapture: (imageDataUrl: string) => void;
  mirrored?: boolean;
  captureRef?: React.MutableRefObject<(() => void) | null>;
  facingMode?: 'user' | 'environment';
  embed?: boolean; // when true, render bare video that fills parent (no Card padding)
}

export default function WebcamFeed({ onCapture, mirrored = false, captureRef, facingMode = 'user', embed = false }: WebcamFeedProps) {
  const dispatch = useDispatch<AppDispatch>();
  const streaming = useSelector(selectStreaming);
  const deviceId = useSelector(selectDeviceId);
  const webcamRef = useRef<Webcam | null>(null);

  const videoConstraints = useMemo<MediaTrackConstraints | undefined>(() => {
    const base: MediaTrackConstraints = { facingMode };
    if (deviceId) return { ...base, deviceId: { exact: deviceId } };
    return base;
  }, [deviceId, facingMode]);

  const handleStart = useCallback(() => {
    dispatch(startStream());
  }, [dispatch]);

  const handleStop = useCallback(() => {
    dispatch(stopStream());
  }, [dispatch]);

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
    }
  }, [onCapture]);

  // expose capture to parent if requested
  if (captureRef) {
    captureRef.current = handleCapture;
  }

  if (embed) {
    // Bare rendering: video fills parent; use contain to avoid cropping so overlay math stays correct
    return streaming ? (
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        mirrored={mirrored}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    ) : (
      <div className="bg-light border d-flex align-items-center justify-content-center w-100 h-100">
        <span className="text-muted">Camera is stopped</span>
      </div>
    );
  }

  return (
    <Card className="w-100">
      <Card.Body>
        <Row className="g-3 align-items-center">
          <Col xs={12} md={8} className="text-center">
            {streaming ? (
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                mirrored={mirrored}
                className="img-fluid w-100"
              />
            ) : (
              <div className="bg-light border d-flex align-items-center justify-content-center" style={{ aspectRatio: '16/9', width: '100%' }}>
                <span className="text-muted">Camera is stopped</span>
              </div>
            )}
          </Col>
          <Col xs={12} md={4} className="d-flex justify-content-md-end justify-content-center">
            <ButtonGroup>
              <Button variant="success" onClick={handleStart} disabled={streaming}>
                Start
              </Button>
              <Button variant="secondary" onClick={handleStop} disabled={!streaming}>
                Stop
              </Button>
              <Button variant="primary" onClick={handleCapture} disabled={!streaming}>
                Capture
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
