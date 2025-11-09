import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../app/store';
import Navbar from '../components/Navbar';
import WebcamFeed from '../components/WebcamFeed';
import UploadImage from '../components/UploadImage';
import FaceOverlay from '../components/FaceOverlay';
import { detectFaces } from '../features/faces/FaceService';
import { setDetections } from '../features/faces/FacesSlice';
import type { FaceResult } from '../features/faces/types';
import { startDetectionLoop, stopDetectionLoop, isMobileEnvironment } from '../features/camera/CameraService';
import { selectStreaming } from '../features/camera/CameraSlice';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const detections = useSelector((s: RootState) => s.faces.detections);
  const streaming = useSelector(selectStreaming);

  const videoWrapRef = useRef<HTMLDivElement | null>(null);
  const uploadWrapRef = useRef<HTMLDivElement | null>(null);
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const [fallbackMsg, setFallbackMsg] = useState<string | null>(null);
  const [snapshotOnly, setSnapshotOnly] = useState<boolean>(false);

  useEffect(() => {
    const findVideo = () => {
      const el = videoWrapRef.current?.querySelector('video') as HTMLVideoElement | null;
      setVideoEl(el ?? null);
    };
    findVideo();
    const id = window.setInterval(findVideo, 500);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (streaming && videoEl) {
      const isMobile = isMobileEnvironment();
      void startDetectionLoop(
        videoEl,
        dispatch,
        isMobile ? 350 : 250,
        isMobile,
        0.5,
        true,
        (msg: string) => {
          setFallbackMsg(msg);
          setSnapshotOnly(true);
        }
      ).catch((e) => {
        setFallbackMsg('Automatic detection unavailable. You can still take snapshots.');
        setSnapshotOnly(true);
        // eslint-disable-next-line no-console
        console.error(e);
      });
      return () => {
        stopDetectionLoop(dispatch);
      };
    }
    return;
  }, [streaming, videoEl, dispatch]);

  const runDetectionOnDataUrl = useCallback(async (dataUrl: string) => {
    const img = new Image();
    img.src = dataUrl;
    await new Promise((res, rej) => {
      img.onload = () => res(null);
      img.onerror = rej;
    });
    const results: FaceResult[] = await detectFaces(img);
    dispatch(setDetections(results));
  }, [dispatch]);

  const handleCapture = useCallback((dataUrl: string) => {
    void runDetectionOnDataUrl(dataUrl);
  }, [runDetectionOnDataUrl]);

  const handleUpload = useCallback((dataUrl: string) => {
    void runDetectionOnDataUrl(dataUrl);
  }, [runDetectionOnDataUrl]);

  const handleUploadClick = useCallback(() => {
    // Try to focus/trigger the file input inside the upload section
    const input = uploadWrapRef.current?.querySelector('input[type="file"]') as HTMLInputElement | null;
    input?.click();
    uploadWrapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const resultsList = useMemo(() => (
    <ListGroup variant="flush">
      {detections.map((d) => (
        <ListGroup.Item key={d.id} className="d-flex flex-column gap-1">
          <div className="fw-semibold">ID: {d.id}</div>
          <div className="small text-muted">
            Box: x {d.box.x}, y {d.box.y}, w {d.box.width}, h {d.box.height}
          </div>
          {typeof d.score === 'number' && <div className="small">Score: {d.score.toFixed(3)}</div>}
          {typeof d.age === 'number' && <div className="small">Age: {d.age}</div>}
          {d.gender && <div className="small">Gender: {d.gender}</div>}
        </ListGroup.Item>
      ))}
      {detections.length === 0 && <ListGroup.Item className="text-muted">No detections yet</ListGroup.Item>}
    </ListGroup>
  ), [detections]);

  return (
    <>
      <Navbar onUploadClick={handleUploadClick} />
      <Container className="pb-4">
        <Row className="g-4">
          <Col xs={12} lg={8}>
            <Card>
              <Card.Header>Camera</Card.Header>
              <Card.Body>
                {fallbackMsg && (
                  <Alert variant="warning" className="mb-3">
                    {fallbackMsg}
                  </Alert>
                )}
                <div ref={videoWrapRef} className="position-relative w-100" style={{ aspectRatio: '16/9' }}>
                  <div className="position-absolute top-0 start-0 w-100 h-100">
                    <WebcamFeed onCapture={handleCapture} mirrored />
                  </div>
                  <div className="position-absolute top-0 start-0 w-100 h-100" style={{ pointerEvents: 'none' }}>
                    <FaceOverlay videoRef={videoEl} detections={detections} />
                  </div>
                </div>
                {snapshotOnly && (
                  <div className="mt-2 text-muted small">Detection disabled. Use Capture to analyze snapshots.</div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} lg={4}>
            <Card>
              <Card.Header>Upload Image</Card.Header>
              <Card.Body>
                <div ref={uploadWrapRef}>
                  <UploadImage onUpload={handleUpload} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4 mt-1">
          <Col xs={12}>
            <Card>
              <Card.Header>Detections</Card.Header>
              <Card.Body>{resultsList}</Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
