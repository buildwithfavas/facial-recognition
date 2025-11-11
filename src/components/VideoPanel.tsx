import { Alert, Col } from 'react-bootstrap';
import type { FaceResult } from '../features/faces/types';
import FaceOverlay from './FaceOverlay';
import WebcamFeed from './WebcamFeed';

interface VideoPanelProps {
  streaming: boolean;
  detections: FaceResult[];
  showExpressions: boolean;
  videoEl: HTMLVideoElement | null;
  fallbackMsg: string | null;
  uploadUrl: string | null;
  videoWrapRef: React.RefObject<HTMLDivElement | null>;
  uploadImgRef: React.RefObject<HTMLImageElement | null>;
  captureRef: React.MutableRefObject<(() => void) | null>;
  facingMode: 'user' | 'environment';
  onCapture: (dataUrl: string) => void;
}

/**
 * VideoPanel Component
 * Displays the webcam feed or uploaded image with face detection overlay
 */
export default function VideoPanel({
  streaming,
  detections,
  showExpressions,
  videoEl,
  fallbackMsg,
  uploadUrl,
  videoWrapRef,
  uploadImgRef,
  captureRef,
  facingMode,
  onCapture,
}: VideoPanelProps) {
  return (
    <Col xs={12} lg={8} className="d-flex video-panel-col" style={{ backgroundColor: 'var(--bg-primary)', padding: '12px' }}>
      <div className="w-100" style={{ position: 'relative' }}>
        {fallbackMsg && (
          <Alert variant="warning" className="mb-3">
            {fallbackMsg}
          </Alert>
        )}
        
        {/* Video Container with Label */}
        <div style={{ position: 'relative' }}>
          {detections.length > 0 && (
            <div 
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                zIndex: 10,
                backgroundColor: 'var(--accent-blue)',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              {detections.length} {detections.length === 1 ? 'Face' : 'Faces'} Detected
            </div>
          )}
          
          <div 
            ref={videoWrapRef} 
            className="video-container"
            style={{
              border: '2px solid var(--accent-blue)',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: 'var(--bg-card)'
            }}
          >
            {streaming ? (
              <>
                <div className="position-absolute top-0 start-0 w-100 h-100">
                  <WebcamFeed 
                    onCapture={onCapture} 
                    mirrored 
                    captureRef={captureRef} 
                    facingMode={facingMode} 
                    embed 
                  />
                </div>
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{ pointerEvents: 'none' }}>
                  <FaceOverlay 
                    videoRef={videoEl} 
                    detections={detections} 
                    showExpressions={showExpressions} 
                    mirrored 
                  />
                </div>
              </>
            ) : (
              <>
                {uploadUrl ? (
                  <>
                    <img
                      ref={uploadImgRef}
                      src={uploadUrl}
                      alt="Uploaded"
                      className="position-absolute top-0 start-0 w-100 h-100 object-fit-contain"
                    />
                    <div className="position-absolute top-0 start-0 w-100 h-100" style={{ pointerEvents: 'none' }}>
                      <FaceOverlay 
                        videoRef={uploadImgRef.current} 
                        detections={detections} 
                        showExpressions={showExpressions} 
                      />
                    </div>
                  </>
                ) : (
                  <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="2" y1="2" x2="22" y2="22" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Col>
  );
}
