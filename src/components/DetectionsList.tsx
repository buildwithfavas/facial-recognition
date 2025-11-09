import { useEffect, useMemo, useRef, useState } from 'react';
import { ListGroup, Badge } from 'react-bootstrap';
import type { FaceResult } from '../features/faces/types';

export type DetectionsListProps = {
  sourceRef: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement | null;
  detections: FaceResult[];
  maxThumbSize?: number;
};

type Thumb = { id: string; url: string };

function getIntrinsicSize(el: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement | null):
  | { w: number; h: number }
  | null {
  if (!el) return null;
  if (el instanceof HTMLVideoElement) return { w: el.videoWidth || 0, h: el.videoHeight || 0 };
  if (el instanceof HTMLImageElement) return { w: el.naturalWidth || 0, h: el.naturalHeight || 0 };
  if (el instanceof HTMLCanvasElement) return { w: el.width || 0, h: el.height || 0 };
  return null;
}

function cropToDataURL(
  el: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
  box: { x: number; y: number; width: number; height: number },
  maxSize: number
): string | null {
  const size = getIntrinsicSize(el);
  if (!size || size.w === 0 || size.h === 0) return null;

  const sx = Math.max(0, Math.min(size.w, box.x));
  const sy = Math.max(0, Math.min(size.h, box.y));
  const sw = Math.max(1, Math.min(size.w - sx, box.width));
  const sh = Math.max(1, Math.min(size.h - sy, box.height));

  const scale = Math.min(maxSize / sw, maxSize / sh, 1);
  const dw = Math.max(1, Math.round(sw * scale));
  const dh = Math.max(1, Math.round(sh * scale));

  const canvas = document.createElement('canvas');
  canvas.width = dw;
  canvas.height = dh;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(el, sx, sy, sw, sh, 0, 0, dw, dh);
  return canvas.toDataURL('image/jpeg', 0.9);
}

export default function DetectionsList({ sourceRef, detections, maxThumbSize = 96 }: DetectionsListProps) {
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const lastCountRef = useRef(0);

  const topExpressions = useMemo(() => {
    return detections.map((d) => {
      const entries = d.expressions ? Object.entries(d.expressions) : [];
      entries.sort((a, b) => b[1] - a[1]);
      return { id: d.id, list: entries.slice(0, 3) };
    });
  }, [detections]);

  useEffect(() => {
    if (!sourceRef) return;
    const size = getIntrinsicSize(sourceRef);
    if (!size || size.w === 0 || size.h === 0) return;

    const map: Record<string, string> = {};
    for (const d of detections) {
      const url = cropToDataURL(sourceRef, d.box, maxThumbSize);
      if (url) map[d.id] = url;
    }
    setThumbs(map);
    lastCountRef.current = detections.length;
  }, [sourceRef, detections, maxThumbSize]);

  return (
    <ListGroup variant="flush">
      {detections.map((d) => {
        const expr = topExpressions.find((e) => e.id === d.id)?.list ?? [];
        return (
          <ListGroup.Item key={d.id} className="d-flex align-items-start gap-3">
            <img
              src={thumbs[d.id]}
              alt={d.name || 'face'}
              width={maxThumbSize}
              height={maxThumbSize}
              className="rounded border flex-shrink-0"
              style={{ objectFit: 'cover', background: '#000' }}
            />
            <div className="flex-grow-1">
              <div className="d-flex flex-wrap align-items-center gap-2">
                <strong>{d.name ?? 'Unknown'}</strong>
                {typeof d.score === 'number' && (
                  <Badge bg="dark">{d.score.toFixed(3)}</Badge>
                )}
                {typeof d.age === 'number' && <Badge bg="secondary">Age {d.age}</Badge>}
                {d.gender && <Badge bg="secondary">{d.gender}</Badge>}
              </div>
              {expr.length > 0 && (
                <div className="mt-1 d-flex flex-wrap gap-2">
                  {expr.map(([k, v]) => (
                    <Badge key={k} bg="info" title={k}>
                      {k}: {(v * 100).toFixed(0)}%
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </ListGroup.Item>
        );
      })}
      {detections.length === 0 && (
        <ListGroup.Item className="text-muted">No detections yet</ListGroup.Item>
      )}
    </ListGroup>
  );
}
