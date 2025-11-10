import * as faceapi from '@vladmandic/face-api';
import { loadModels } from '../../utils/modelLoader';
import type { FaceResult } from './types';
import { matchDescriptor } from './Recognition';

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

type FaceApiDetection = {
  detection: { box: { x: number; y: number; width: number; height: number }; score?: number };
  descriptor?: Float32Array | number[];
  age?: number;
  gender?: string;
  expressions?: Record<string, number> | { [key: string]: number };
};

function toFaceResults(items: unknown[]): FaceResult[] {
  return (items as FaceApiDetection[]).map((it, idx: number) => {
    const rawDesc: Float32Array | number[] | undefined = it.descriptor;
    const match = rawDesc ? matchDescriptor(rawDesc) : { name: 'unknown', distance: Number.POSITIVE_INFINITY };
    return {
      id: `${Date.now()}-${idx}`,
      box: {
        x: Math.max(0, Math.round(it.detection.box.x)),
        y: Math.max(0, Math.round(it.detection.box.y)),
        width: Math.max(0, Math.round(it.detection.box.width)),
        height: Math.max(0, Math.round(it.detection.box.height)),
      },
      score: typeof it.detection?.score === 'number' ? it.detection.score : undefined,
      age: typeof it.age === 'number' ? Math.round(it.age) : undefined,
      gender: match.gender || (typeof it.gender === 'string' ? it.gender : undefined),
      expressions: it.expressions as Record<string, number> | undefined,
      name: match.name !== 'unknown' ? match.name : undefined,
      dob: match.dob,
      features: Array.isArray(it.descriptor)
        ? (it.descriptor as number[])
        : it.descriptor instanceof Float32Array
        ? Array.from(it.descriptor as Float32Array)
        : undefined,
    } as FaceResult;
  });
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
    .detectAllFaces(
      input as HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
      detector
    )
    .withFaceLandmarks()
    .withFaceExpressions()
    .withAgeAndGender()
    .withFaceDescriptors();

  return toFaceResults(results);
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
