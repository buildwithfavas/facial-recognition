import * as faceapi from '@vladmandic/face-api';
import { loadModels } from '../../utils/modelLoader';
import type { FaceResult } from './types';

export async function init(): Promise<void> {
  await loadModels();
}

export async function initFaceApi(): Promise<void> {
  await init();
}

function ensureModelsLoaded(): void {
  const loaded =
    faceapi.nets.ssdMobilenetv1.isLoaded ||
    faceapi.nets.tinyFaceDetector.isLoaded;
  if (!loaded) {
    throw new Error('Face API models are not loaded. Call init() before detection.');
  }
}

function toFaceResults(items: Array<any>): FaceResult[] {
  return items.map((it: any, idx: number) => ({
    id: `${Date.now()}-${idx}`,
    box: {
      x: Math.max(0, Math.round(it.detection.box.x)),
      y: Math.max(0, Math.round(it.detection.box.y)),
      width: Math.max(0, Math.round(it.detection.box.width)),
      height: Math.max(0, Math.round(it.detection.box.height)),
    },
    score: typeof it.detection?.score === 'number' ? it.detection.score : undefined,
    age: typeof it.age === 'number' ? Math.round(it.age) : undefined,
    gender: it.gender as any,
    expressions: it.expressions as Record<string, number> | undefined,
    features: Array.isArray(it.descriptor)
      ? (it.descriptor as number[])
      : it.descriptor instanceof Float32Array
      ? Array.from(it.descriptor as Float32Array)
      : undefined,
  }));
}

export type DetectOptions = {
  minConfidence?: number;
  useTiny?: boolean;
};

async function detectAll(
  input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
  options?: DetectOptions
): Promise<FaceResult[]> {
  ensureModelsLoaded();
  const minConfidence = options?.minConfidence ?? 0.5;
  const useTiny = options?.useTiny ?? false;

  const detector = useTiny
    ? new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: minConfidence })
    : new faceapi.SsdMobilenetv1Options({ minConfidence });

  const results = await faceapi
    .detectAllFaces(input as any, detector)
    .withFaceLandmarks()
    .withFaceExpressions()
    .withAgeAndGender()
    .withFaceDescriptors();

  return toFaceResults(results as any);
}

export async function detectFromImage(
  image: HTMLImageElement | HTMLCanvasElement,
  options?: DetectOptions
): Promise<FaceResult[]> {
  return await detectAll(image, options);
}

export function detectFromVideoElement(
  video: HTMLVideoElement,
  opts?: DetectOptions & { intervalMs?: number; onUpdate?: (results: FaceResult[]) => void }
): { stop: () => void } {
  let stopped = false;
  const interval = Math.max(100, opts?.intervalMs ?? 300);

  const loop = async () => {
    if (stopped) return;
    try {
      if (video.readyState >= 2) {
        const res = await detectAll(video, opts);
        opts?.onUpdate?.(res);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Video detection error:', err);
    } finally {
      if (!stopped) setTimeout(loop, interval);
    }
  };
  void loop();

  return {
    stop: () => {
      stopped = true;
    },
  };
}

export async function detectFaces(
  input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
  options?: DetectOptions
): Promise<FaceResult[]> {
  if (input instanceof HTMLVideoElement) {
    return await detectAll(input, options);
  }
  return await detectAll(input, options);
}

export async function recognizeFaces(results: FaceResult[]): Promise<FaceResult[]> {
  return results;
}
