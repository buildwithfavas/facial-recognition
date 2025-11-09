import * as faceapi from '@vladmandic/face-api';

export type LoadModelsOptions = {
  baseUrl?: string;
  useTiny?: boolean;
  onProgress?: (status: string) => void;
};

function status(cb: ((s: string) => void) | undefined, s: string) {
  if (cb) cb(s);
}

async function loadAll(base: string, useTiny: boolean, onProgress?: (s: string) => void): Promise<void> {
  if (!faceapi.nets.tinyFaceDetector.isLoaded && !faceapi.nets.ssdMobilenetv1.isLoaded) {
    status(onProgress, useTiny ? 'loading tiny face detector' : 'loading ssd mobilenetv1');
    if (useTiny) {
      await faceapi.nets.tinyFaceDetector.loadFromUri(base);
    } else {
      await faceapi.nets.ssdMobilenetv1.loadFromUri(base);
    }
  }
  if (!faceapi.nets.faceLandmark68Net.isLoaded) {
    status(onProgress, 'loading face landmark 68');
    await faceapi.nets.faceLandmark68Net.loadFromUri(base);
  }
  if (!faceapi.nets.faceRecognitionNet.isLoaded) {
    status(onProgress, 'loading face recognition');
    await faceapi.nets.faceRecognitionNet.loadFromUri(base);
  }
  if (!faceapi.nets.ageGenderNet.isLoaded) {
    status(onProgress, 'loading age gender');
    await faceapi.nets.ageGenderNet.loadFromUri(base);
  }
  if (!faceapi.nets.faceExpressionNet.isLoaded) {
    status(onProgress, 'loading face expression');
    await faceapi.nets.faceExpressionNet.loadFromUri(base);
  }
  status(onProgress, 'models loaded');
}

export async function loadModels(opts?: LoadModelsOptions): Promise<void> {
  const useTiny = opts?.useTiny ?? true;
  const onProgress = opts?.onProgress;
  const localBase = opts?.baseUrl ?? '/models';
  try {
    await loadAll(localBase, useTiny, onProgress);
    return;
  } catch {
    const cdnBase = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@latest/model';
    await loadAll(cdnBase, useTiny, onProgress);
  }
}
