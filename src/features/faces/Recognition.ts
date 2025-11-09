export type KnownFace = {
  name: string;
  descriptor: number[];
};

export type MatchResult = {
  name: string;
  distance: number;
};

const STORAGE_KEY = 'knownFaces';

let cache: KnownFace[] | null = null;

function toArray(d: Float32Array | number[]): number[] {
  return Array.isArray(d) ? d : Array.from(d);
}

function euclidean(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length);
  let sum = 0;
  for (let i = 0; i < len; i++) {
    const diff = a[i] - b[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

function loadKnownFaces(): KnownFace[] {
  if (cache) return cache;
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) {
      cache = [];
      return cache;
    }
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      cache = parsed
        .filter((x) => x && typeof x.name === 'string' && Array.isArray(x.descriptor))
        .map((x) => ({ name: x.name, descriptor: x.descriptor as number[] }));
      return cache;
    }
  } catch {
    // ignore and reset
  }
  cache = [];
  return cache;
}

function saveKnownFaces(items: KnownFace[]): void {
  cache = items;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  } catch {
    // ignore
  }
}

export function getKnownFaces(): KnownFace[] {
  return loadKnownFaces();
}

export function addKnownFace(name: string, descriptor: Float32Array | number[]): void {
  const list = loadKnownFaces();
  const item: KnownFace = { name, descriptor: toArray(descriptor) };
  list.push(item);
  saveKnownFaces(list);
}

export function matchDescriptor(
  descriptor: Float32Array | number[],
  threshold = 0.45
): MatchResult {
  const probe = toArray(descriptor);
  const list = loadKnownFaces();
  if (list.length === 0) return { name: 'unknown', distance: Number.POSITIVE_INFINITY };

  let best: MatchResult = { name: 'unknown', distance: Number.POSITIVE_INFINITY };
  for (const k of list) {
    const dist = euclidean(probe, k.descriptor);
    if (dist < best.distance) {
      best = { name: k.name, distance: dist };
    }
  }

  if (best.distance <= threshold) return best;
  return { name: 'unknown', distance: best.distance };
}
