export type CameraConstraints = MediaStreamConstraints;

export async function startCamera(constraints?: CameraConstraints): Promise<MediaStream> {
  const c = constraints ?? { video: true, audio: false };
  return await navigator.mediaDevices.getUserMedia(c);
}

export function stopCamera(stream: MediaStream | null | undefined): void {
  if (!stream) return;
  stream.getTracks().forEach((t) => t.stop());
}

import * as faceapi from '@vladmandic/face-api';
import type { AppDispatch } from '../../app/store';
import { setDetections, setIsDetecting } from '../faces/FacesSlice';
import { detectFromVideoElement, init } from '../faces/FaceService';

let detectionHandle: { stop: () => void } | null = null;

export function isMobileEnvironment(): boolean {
  try {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent || navigator.vendor : '';
    const isTouch = typeof window !== 'undefined' ? ('ontouchstart' in window || (navigator as any).maxTouchPoints > 0) : false;
    const smallScreen = typeof window !== 'undefined' ? Math.min(window.innerWidth, window.innerHeight) < 768 : false;
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(ua) || isTouch || smallScreen;
  } catch {
    return false;
  }
}

export async function startDetectionLoop(
  videoEl: HTMLVideoElement,
  dispatch: AppDispatch,
  intervalMs: number = 250,
  useTiny: boolean = false,
  minConfidence: number = 0.5,
  mobileAdaptive: boolean = true,
  onFallback?: (message: string) => void
): Promise<void> {
  try {
    await init();
    if (detectionHandle) {
      detectionHandle.stop();
      detectionHandle = null;
    }
    dispatch(setIsDetecting(true));
    let effectiveInterval = Math.min(Math.max(intervalMs, 150), 400);
    try {
      const tf = (faceapi as any)?.tf;
      const backend: string | undefined =
        typeof tf?.engine === 'function' ? tf.engine()?.backendName : typeof tf?.getBackend === 'function' ? tf.getBackend() : undefined;
      const isCpu = backend === 'cpu' || !backend;
      if (isCpu) {
        effectiveInterval = Math.max(effectiveInterval, 600);
        if (onFallback)
          onFallback('Running on a slow backend (CPU or unknown). Reducing detection frequency; you can switch to snapshot-only mode.');
      }
    } catch {}
    if (mobileAdaptive && isMobileEnvironment()) {
      effectiveInterval = Math.max(effectiveInterval, 350);
    }
    detectionHandle = detectFromVideoElement(videoEl, {
      intervalMs: effectiveInterval,
      useTiny,
      minConfidence,
      onUpdate: (results) => {
        dispatch(setDetections(results));
      },
    });
  } catch (e) {
    if (onFallback) onFallback('TensorFlow backend failed to initialize. Falling back to snapshot-only mode.');
    dispatch(setIsDetecting(false));
    throw e;
  }
}

export function stopDetectionLoop(dispatch?: AppDispatch): void {
  if (detectionHandle) {
    detectionHandle.stop();
    detectionHandle = null;
  }
  if (dispatch) dispatch(setIsDetecting(false));
}
