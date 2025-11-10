import { useCallback, useEffect, useRef, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../app/store';
import DetectionSidebar from '../components/DetectionSidebar';
import HelpModal from '../components/HelpModal';
import ManageFacesModal from '../components/ManageFacesModal';
import Navbar from '../components/Navbar';
import SettingsModal from '../components/SettingsModal';
import VideoPanel from '../components/VideoPanel';
import { useDetectionSettings } from '../hooks';
import { startDetectionLoop, stopDetectionLoop } from '../features/camera/CameraService';
import { selectStreaming, startStream, stopStream } from '../features/camera/CameraSlice';
import { detectFaces } from '../features/faces/FaceService';
import { clearDetections, setDetections } from '../features/faces/FacesSlice';
import type { FaceResult } from '../features/faces/types';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const detections = useSelector((s: RootState) => s.faces.detections);
  const streaming = useSelector(selectStreaming);

  const videoWrapRef = useRef<HTMLDivElement>(null);
  const uploadWrapRef = useRef<HTMLDivElement>(null);
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const [fallbackMsg, setFallbackMsg] = useState<string | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const uploadImgRef = useRef<HTMLImageElement>(null);
  const captureRef = useRef<(() => void) | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showManageFaces, setShowManageFaces] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Use custom hook for detection settings
  const {
    showExpressions,
    setShowExpressions,
    intervalMs,
    setIntervalMs,
    useTiny,
    setUseTiny,
    minConfidence,
    setMinConfidence,
    facingMode,
    setFacingMode,
  } = useDetectionSettings();

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
    const isTypingTarget = (el: EventTarget | null): boolean => {
      const t = el as HTMLElement | null;
      if (!t) return false;
      const tag = (t.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || t.isContentEditable) return true;
      return false;
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      if (e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        captureRef.current?.();
      } else if (e.key === 's' || e.key === 'S') {
        if (streaming) {
          dispatch(stopStream());
          dispatch(clearDetections());
        } else {
          dispatch(startStream());
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dispatch, streaming]);

  useEffect(() => {
    if (streaming && videoEl) {
      void startDetectionLoop(
        videoEl,
        dispatch,
        intervalMs,
        useTiny,
        minConfidence,
        true,
        (msg: string) => {
          setFallbackMsg(msg);
        }
      ).catch((e) => {
        setFallbackMsg('Automatic detection unavailable. You can still take snapshots.');
        console.error(e);
      });
      return () => {
        stopDetectionLoop(dispatch);
      };
    }
    return;
  }, [streaming, videoEl, dispatch, intervalMs, useTiny, minConfidence, forceUpdate]);

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
    setUploadUrl(dataUrl);
    void runDetectionOnDataUrl(dataUrl);
  }, [runDetectionOnDataUrl]);

  const handleUploadClick = useCallback(() => {
    // Try to focus/trigger the file input inside the upload section
    const input = uploadWrapRef.current?.querySelector('input[type="file"]') as HTMLInputElement | null;
    input?.click();
    uploadWrapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);


  const handleFaceRegistered = useCallback(() => {
    // Force re-render to update detections with new names
    setForceUpdate(prev => prev + 1);
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar 
        onUploadClick={handleUploadClick} 
        onSettingsClick={() => setShowSettings(true)}
        onHelpClick={() => setShowHelp(true)}
      />
      <Container fluid className="p-0">
        <Row className="g-0" style={{ minHeight: 'calc(100vh - 56px)' }}>
          <VideoPanel
            streaming={streaming}
            detections={detections}
            showExpressions={showExpressions}
            videoEl={videoEl}
            fallbackMsg={fallbackMsg}
            uploadUrl={uploadUrl}
            videoWrapRef={videoWrapRef}
            uploadImgRef={uploadImgRef}
            captureRef={captureRef}
            facingMode={facingMode}
            onCapture={handleCapture}
          />
          
          <DetectionSidebar
            streaming={streaming}
            detections={detections}
            showExpressions={showExpressions}
            uploadWrapRef={uploadWrapRef}
            dispatch={dispatch}
            onShowManageFaces={() => setShowManageFaces(true)}
            onUpload={handleUpload}
          />
        </Row>
      </Container>
      <SettingsModal
        show={showSettings}
        onHide={() => setShowSettings(false)}
        showExpressions={showExpressions}
        onChangeShowExpressions={setShowExpressions}
        intervalMs={intervalMs}
        onChangeInterval={setIntervalMs}
        useTiny={useTiny}
        onChangeUseTiny={setUseTiny}
        minConfidence={minConfidence}
        onChangeMinConfidence={setMinConfidence}
        facingMode={facingMode}
        onChangeFacingMode={setFacingMode}
      />
      <ManageFacesModal
        show={showManageFaces}
        onHide={() => setShowManageFaces(false)}
        onFacesChanged={handleFaceRegistered}
      />
      <HelpModal
        show={showHelp}
        onHide={() => setShowHelp(false)}
      />
    </div>
  );
}
