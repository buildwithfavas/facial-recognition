import { useEffect, useMemo, useRef } from 'react';
import type { FaceResult } from '../features/faces/types';

type Props = {
  videoRef: HTMLVideoElement | HTMLImageElement | null;
  detections: FaceResult[];
  showExpressions?: boolean;
  mirrored?: boolean;
};

export default function FaceOverlay({ videoRef, detections, showExpressions = true, mirrored = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const size = useMemo(() => {
    const w = videoRef?.clientWidth ?? 0;
    const h = videoRef?.clientHeight ?? 0;
    const isImg = typeof HTMLImageElement !== 'undefined' && videoRef instanceof HTMLImageElement;
    const vw = isImg ? (videoRef as HTMLImageElement).naturalWidth || w : (videoRef as HTMLVideoElement | null)?.videoWidth ?? w;
    const vh = isImg ? (videoRef as HTMLImageElement).naturalHeight || h : (videoRef as HTMLVideoElement | null)?.videoHeight ?? h;
    return { w, h, vw, vh };
  }, [videoRef?.clientWidth, videoRef?.clientHeight, (videoRef as any)?.videoWidth, (videoRef as any)?.videoHeight, (videoRef as any)?.naturalWidth, (videoRef as any)?.naturalHeight]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { w, h } = size;
    if (w > 0 && h > 0) {
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    }
  }, [size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { w, h, vw, vh } = size;
    ctx.clearRect(0, 0, w, h);
    if (w === 0 || h === 0 || vw === 0 || vh === 0) return;

    // object-fit: contain mapping
    const s = Math.min(w / vw, h / vh);
    const displayW = vw * s;
    const displayH = vh * s;
    const offsetX = (w - displayW) / 2;
    const offsetY = (h - displayH) / 2;

    ctx.lineWidth = 2;
    ctx.font = '12px system-ui, -apple-system, Segoe UI, Roboto, Arial';
    ctx.textBaseline = 'top';

    detections.forEach((d) => {
      let x = Math.round(d.box.x * s + offsetX);
      const y = Math.round(d.box.y * s + offsetY);
      const bw = Math.round(d.box.width * s);
      const bh = Math.round(d.box.height * s);

      if (mirrored) {
        // Flip horizontally within full canvas width
        x = Math.round(w - (x + bw));
      }

      // Blue border for detected face
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, bw, bh);

      const topExpr = showExpressions && d.expressions
        ? Object.entries(d.expressions).sort((a, b) => b[1] - a[1])[0]
        : undefined;
      const exprText = topExpr ? `${topExpr[0]} ${(topExpr[1] * 100).toFixed(0)}%` : undefined;
      const labelParts: string[] = [];
      if (d.name) labelParts.push(d.name);
      if (typeof d.age === 'number') labelParts.push(`age ${d.age}`);
      if (d.gender) labelParts.push(d.gender);
      if (exprText) labelParts.push(exprText);
      const label = labelParts.join(' · ');

      if (label) {
        const padding = 6;
        const metrics = ctx.measureText(label);
        const textW = Math.ceil(metrics.width) + padding * 2;
        const textH = 16 + padding * 2;
        const bx = x;
        const by = Math.max(0, y - textH - 4);
        // Blue background for label
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(bx, by, textW, textH);
        ctx.fillStyle = '#fff';
        ctx.fillText(label, bx + padding, by + padding);
      }
    });
  }, [detections, size, showExpressions, mirrored]);

  useEffect(() => {
    if (!videoRef) return;
    const handler = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const w = videoRef.clientWidth;
      const h = videoRef.clientHeight;
      if (w && h) {
        canvas.width = w;
        canvas.height = h;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
      }
    };
    videoRef.addEventListener('loadedmetadata', handler);
    window.addEventListener('resize', handler);
    return () => {
      videoRef.removeEventListener('loadedmetadata', handler);
      window.removeEventListener('resize', handler);
    };
  }, [videoRef]);

  return (
    <canvas ref={canvasRef} className="position-absolute top-0 start-0 w-100 h-100" style={{ pointerEvents: 'none' }} />
  );
}
