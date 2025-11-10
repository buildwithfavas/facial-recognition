import { Col } from 'react-bootstrap';
import type { AppDispatch } from '../app/store';
import { startStream, stopStream } from '../features/camera/CameraSlice';
import { clearDetections } from '../features/faces/FacesSlice';
import { calculateAge } from '../features/faces/Recognition';
import type { FaceResult } from '../features/faces/types';
import UploadImage from './UploadImage';

interface DetectionSidebarProps {
  streaming: boolean;
  detections: FaceResult[];
  showExpressions: boolean;
  uploadWrapRef: React.RefObject<HTMLDivElement | null>;
  dispatch: AppDispatch;
  onShowManageFaces: () => void;
  onUpload: (dataUrl: string) => void;
}

/**
 * DetectionSidebar Component
 * Displays control buttons and detected faces list
 */
export default function DetectionSidebar({
  streaming,
  detections,
  showExpressions,
  uploadWrapRef,
  dispatch,
  onShowManageFaces,
  onUpload,
}: DetectionSidebarProps) {
  return (
    <Col xs={12} lg={4} className="d-flex align-items-stretch" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div 
        className="d-flex flex-column w-100" 
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderRadius: '8px',
          padding: '16px',
          margin: '12px',
          alignSelf: 'stretch'
        }}
      >
        {/* Manage Users Button */}
        <button
          className="btn btn-primary w-100 mb-2 mb-lg-3"
          onClick={onShowManageFaces}
          style={{ 
            borderRadius: '6px',
            padding: '10px 12px',
            fontWeight: '600',
            fontSize: '13px'
          }}
        >
          Manage Users
        </button>

        {/* Control Buttons */}
        <div className="d-flex gap-2 mb-3 mb-lg-4">
          <button
            className="btn btn-primary d-flex align-items-center justify-content-center gap-2 flex-grow-1"
            onClick={() => dispatch(startStream())}
            disabled={streaming}
            style={{ borderRadius: '6px', padding: '8px 10px', fontSize: '12px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Start Camera
          </button>
          <button
            className="btn d-flex align-items-center justify-content-center gap-2 flex-grow-1"
            onClick={() => {
              dispatch(stopStream());
              dispatch(clearDetections());
            }}
            disabled={!streaming}
            style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              borderRadius: '6px',
              padding: '8px 10px',
              fontSize: '12px'
            }}
          >
            {streaming ? (
              <span 
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#ef4444',
                  animation: 'pulse 1.5s ease-in-out infinite'
                }}
              />
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="currentColor" />
              </svg>
            )}
            Stop Camera
          </button>
        </div>

        {/* Detected Faces Section */}
        <div className="flex-grow-1" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 250px)' }}>
          <h5 style={{ marginBottom: '12px', fontWeight: '600', fontSize: '15px' }}>Detected Faces</h5>
          {detections.length > 0 ? (
            <div>
              {detections.map((d) => (
                <div 
                  key={d.id}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: '6px',
                    padding: '10px',
                    marginBottom: '10px'
                  }}
                >
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Name</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {d.name || 'Unknown'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Details</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                      {d.dob ? calculateAge(d.dob) : (d.age || 'N/A')}, {d.gender ? d.gender.charAt(0).toUpperCase() + d.gender.slice(1) : 'N/A'}, {showExpressions && d.expressions ? Object.entries(d.expressions).sort((a, b) => b[1] - a[1])[0]?.[0].charAt(0).toUpperCase() + Object.entries(d.expressions).sort((a, b) => b[1] - a[1])[0]?.[0].slice(1) : 'N/A'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px', fontSize: '13px' }}>
              No faces detected yet
            </div>
          )}
        </div>
        
        {/* Hidden Upload Area */}
        <div ref={uploadWrapRef} style={{ display: 'none' }}>
          <UploadImage onUpload={onUpload} />
        </div>
      </div>
    </Col>
  );
}
