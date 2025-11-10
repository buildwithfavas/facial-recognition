/**
 * Represents a known face stored in the recognition system
 */
export interface KnownFace {
  /** Full name of the person */
  name: string;
  /** Face descriptor vector (128-dimensional) */
  descriptor: number[];
  /** Date of birth in YYYY-MM-DD format */
  dob?: string;
  /** Gender of the person */
  gender?: string;
}

/**
 * Result of matching a face descriptor against known faces
 */
export interface MatchResult {
  /** Name of the matched person or 'unknown' */
  name: string;
  /** Euclidean distance between descriptors (lower = better match) */
  distance: number;
  /** Date of birth if available */
  dob?: string;
  /** Gender if available */
  gender?: string;
}

const STORAGE_KEY = 'face_recognition_known_faces';

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
        .map((x) => ({ 
          name: x.name, 
          descriptor: x.descriptor as number[],
          dob: x.dob as string | undefined,
          gender: x.gender as string | undefined
        }));
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

/**
 * Retrieves all known faces from storage
 * @returns Array of known faces (copy to prevent external mutation)
 */
export function getKnownFaces(): KnownFace[] {
  return [...loadKnownFaces()];
}

/**
 * Adds a new face to the known faces database
 * @param name - Full name of the person
 * @param descriptor - Face descriptor vector (128-dimensional)
 * @param dob - Optional date of birth in YYYY-MM-DD format
 * @param gender - Optional gender
 */
export function addKnownFace(name: string, descriptor: Float32Array | number[], dob?: string, gender?: string): void {
  const list = loadKnownFaces();
  const item: KnownFace = { name, descriptor: toArray(descriptor), dob, gender };
  list.push(item);
  saveKnownFaces(list);
}

/**
 * Deletes a known face by its index
 * @param index - Zero-based index of the face to delete
 */
export function deleteFaceByIndex(index: number): void {
  const list = loadKnownFaces();
  if (index >= 0 && index < list.length) {
    list.splice(index, 1);
    saveKnownFaces(list);
  }
}

/**
 * Updates a known face's information by index
 * @param index - Zero-based index of the face to update
 * @param name - New name
 * @param dob - New date of birth (optional)
 * @param gender - New gender (optional)
 */
export function updateFaceByIndex(index: number, name: string, dob?: string, gender?: string): void {
  const list = loadKnownFaces();
  if (index >= 0 && index < list.length) {
    list[index] = { ...list[index], name, dob, gender };
    saveKnownFaces(list);
    // Force cache invalidation to ensure fresh data on next read
    cache = null;
    console.log('Updated face at index', index, 'New data:', list[index]);
  }
}

export function calculateAge(dob: string): number {
  try {
    // Validate input
    if (!dob || typeof dob !== 'string') {
      throw new Error('Invalid date of birth');
    }

    const birthDate = new Date(dob);
    
    // Check if date is valid
    if (isNaN(birthDate.getTime())) {
      throw new Error('Invalid date format');
    }

    const today = new Date();
    
    // Check if birth date is not in the future
    if (birthDate > today) {
      throw new Error('Date of birth cannot be in the future');
    }

    // Check if age is reasonable (e.g., not more than 150 years)
    const yearDiff = today.getFullYear() - birthDate.getFullYear();
    if (yearDiff > 150) {
      throw new Error('Invalid date of birth: age exceeds reasonable limit');
    }

    let age = yearDiff;
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    // Return 0 if age is negative (shouldn't happen with above checks, but just in case)
    return Math.max(0, age);
  } catch (error) {
    console.error('Error calculating age:', error);
    // Return 0 or throw based on your error handling strategy
    // For user-facing code, returning 0 is safer
    return 0;
  }
}

export function clearAllFaces(): void {
  cache = [];
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

export function invalidateCache(): void {
  cache = null;
}

export function matchDescriptor(
  descriptor: Float32Array | number[],
  threshold = 0.45
): MatchResult {
  if (!descriptor) return { name: 'unknown', distance: Number.POSITIVE_INFINITY };
  const probe = toArray(descriptor);
  const list = loadKnownFaces();
  if (list.length === 0) return { name: 'unknown', distance: Number.POSITIVE_INFINITY };

  let best: MatchResult = { name: 'unknown', distance: Number.POSITIVE_INFINITY };
  for (const k of list) {
    const dist = euclidean(probe, k.descriptor);
    if (dist < best.distance) {
      best = { name: k.name, distance: dist, dob: k.dob, gender: k.gender };
    }
  }

  if (best.distance <= threshold) return best;
  return { name: 'unknown', distance: best.distance };
}
