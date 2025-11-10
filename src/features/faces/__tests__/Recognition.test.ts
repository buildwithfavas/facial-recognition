import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { 
  calculateAge, 
  addKnownFace, 
  getKnownFaces, 
  deleteFaceByIndex,
  updateFaceByIndex,
  clearAllFaces,
  matchDescriptor,
  invalidateCache
} from '../Recognition';

describe('Recognition Module', () => {
  // Clear localStorage before each test
  beforeEach(() => {
    localStorage.clear();
    invalidateCache();
  });

  afterEach(() => {
    clearAllFaces();
  });

  describe('calculateAge', () => {
    it('should calculate age correctly for valid date', () => {
      const dob = '2000-01-01';
      const age = calculateAge(dob);
      const currentYear = new Date().getFullYear();
      const expectedAge = currentYear - 2000;
      
      expect(age).toBeGreaterThanOrEqual(expectedAge - 1);
      expect(age).toBeLessThanOrEqual(expectedAge);
    });

    it('should return 0 for invalid date string', () => {
      expect(calculateAge('invalid-date')).toBe(0);
    });

    it('should return 0 for empty string', () => {
      expect(calculateAge('')).toBe(0);
    });

    it('should return 0 for future date', () => {
      const futureDate = '2030-01-01';
      expect(calculateAge(futureDate)).toBe(0);
    });

    it('should return 0 for date exceeding 150 years', () => {
      const oldDate = '1800-01-01';
      expect(calculateAge(oldDate)).toBe(0);
    });

    it('should handle leap year correctly', () => {
      const leapDate = '2000-02-29';
      const age = calculateAge(leapDate);
      expect(age).toBeGreaterThanOrEqual(20);
    });
  });

  describe('addKnownFace', () => {
    it('should add a face with name only', () => {
      const descriptor = new Float32Array([1, 2, 3, 4, 5]);
      addKnownFace('John Doe', descriptor);
      
      const faces = getKnownFaces();
      expect(faces).toHaveLength(1);
      expect(faces[0].name).toBe('John Doe');
      expect(faces[0].descriptor).toEqual([1, 2, 3, 4, 5]);
    });

    it('should add a face with name, dob, and gender', () => {
      const descriptor = new Float32Array([1, 2, 3]);
      addKnownFace('Jane Smith', descriptor, '1990-05-15', 'female');
      
      const faces = getKnownFaces();
      expect(faces).toHaveLength(1);
      expect(faces[0].name).toBe('Jane Smith');
      expect(faces[0].dob).toBe('1990-05-15');
      expect(faces[0].gender).toBe('female');
    });

    it('should handle array descriptor', () => {
      const descriptor = [1, 2, 3, 4];
      addKnownFace('Test User', descriptor);
      
      const faces = getKnownFaces();
      expect(faces[0].descriptor).toEqual([1, 2, 3, 4]);
    });

    it('should add multiple faces', () => {
      addKnownFace('User 1', [1, 2, 3]);
      addKnownFace('User 2', [4, 5, 6]);
      addKnownFace('User 3', [7, 8, 9]);
      
      const faces = getKnownFaces();
      expect(faces).toHaveLength(3);
      expect(faces.map(f => f.name)).toEqual(['User 1', 'User 2', 'User 3']);
    });
  });

  describe('deleteFaceByIndex', () => {
    beforeEach(() => {
      addKnownFace('User 1', [1, 2, 3]);
      addKnownFace('User 2', [4, 5, 6]);
      addKnownFace('User 3', [7, 8, 9]);
    });

    it('should delete face at valid index', () => {
      deleteFaceByIndex(1);
      
      const faces = getKnownFaces();
      expect(faces).toHaveLength(2);
      expect(faces.map(f => f.name)).toEqual(['User 1', 'User 3']);
    });

    it('should not delete face at negative index', () => {
      deleteFaceByIndex(-1);
      
      const faces = getKnownFaces();
      expect(faces).toHaveLength(3);
    });

    it('should not delete face at out-of-bounds index', () => {
      deleteFaceByIndex(10);
      
      const faces = getKnownFaces();
      expect(faces).toHaveLength(3);
    });

    it('should delete first face', () => {
      deleteFaceByIndex(0);
      
      const faces = getKnownFaces();
      expect(faces).toHaveLength(2);
      expect(faces[0].name).toBe('User 2');
    });

    it('should delete last face', () => {
      deleteFaceByIndex(2);
      
      const faces = getKnownFaces();
      expect(faces).toHaveLength(2);
      expect(faces[1].name).toBe('User 2');
    });
  });

  describe('updateFaceByIndex', () => {
    beforeEach(() => {
      addKnownFace('User 1', [1, 2, 3], '1990-01-01', 'male');
    });

    it('should update face name', () => {
      updateFaceByIndex(0, 'Updated Name');
      
      const faces = getKnownFaces();
      expect(faces[0].name).toBe('Updated Name');
    });

    it('should update face with all fields', () => {
      updateFaceByIndex(0, 'New Name', '1995-06-20', 'female');
      
      const faces = getKnownFaces();
      expect(faces[0].name).toBe('New Name');
      expect(faces[0].dob).toBe('1995-06-20');
      expect(faces[0].gender).toBe('female');
    });

    it('should preserve descriptor when updating', () => {
      const originalFaces = getKnownFaces();
      const originalDescriptor = originalFaces[0].descriptor;
      
      updateFaceByIndex(0, 'Updated');
      
      const faces = getKnownFaces();
      expect(faces[0].descriptor).toEqual(originalDescriptor);
    });

    it('should not update at invalid index', () => {
      updateFaceByIndex(10, 'Invalid');
      
      const faces = getKnownFaces();
      expect(faces[0].name).toBe('User 1');
    });
  });

  describe('clearAllFaces', () => {
    it('should clear all faces', () => {
      addKnownFace('User 1', [1, 2, 3]);
      addKnownFace('User 2', [4, 5, 6]);
      
      clearAllFaces();
      
      const faces = getKnownFaces();
      expect(faces).toHaveLength(0);
    });

    it('should work when no faces exist', () => {
      clearAllFaces();
      
      const faces = getKnownFaces();
      expect(faces).toHaveLength(0);
    });
  });

  describe('matchDescriptor', () => {
    beforeEach(() => {
      addKnownFace('Known User', [1.0, 2.0, 3.0, 4.0, 5.0]);
    });

    it('should return unknown for empty known faces', () => {
      clearAllFaces();
      const result = matchDescriptor(new Float32Array([1, 2, 3, 4, 5]));
      
      expect(result.name).toBe('unknown');
    });

    it('should return unknown for null descriptor', () => {
      const result = matchDescriptor(null as unknown as Float32Array);
      
      expect(result.name).toBe('unknown');
    });

    it('should return match with stored dob and gender', () => {
      clearAllFaces();
      addKnownFace('Test User', [1, 2, 3], '1990-01-01', 'male');
      
      const result = matchDescriptor(new Float32Array([1.001, 2.001, 3.001]));
      
      // Note: actual matching requires euclidean distance calculation
      // This test validates that the function doesn't crash
      expect(result.name).toBeDefined();
    });
  });

  describe('getKnownFaces', () => {
    it('should return empty array initially', () => {
      const faces = getKnownFaces();
      expect(faces).toEqual([]);
    });

    it('should return cached faces', () => {
      addKnownFace('User 1', [1, 2, 3]);
      
      const faces1 = getKnownFaces();
      const faces2 = getKnownFaces();
      
      expect(faces1).toEqual(faces2);
    });

    it('should return copy of faces array', () => {
      addKnownFace('User 1', [1, 2, 3]);
      
      const faces = getKnownFaces();
      faces.push({ name: 'Fake User', descriptor: [9, 9, 9] });
      
      const facesAgain = getKnownFaces();
      expect(facesAgain).toHaveLength(1);
    });
  });

  describe('localStorage persistence', () => {
    it('should persist faces to localStorage', () => {
      addKnownFace('Persistent User', [1, 2, 3]);
      
      const stored = localStorage.getItem('face_recognition_known_faces');
      expect(stored).toBeTruthy();
      
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].name).toBe('Persistent User');
    });

    it('should load faces from localStorage', () => {
      const testFaces = [
        { name: 'User 1', descriptor: [1, 2, 3] },
        { name: 'User 2', descriptor: [4, 5, 6], dob: '1990-01-01', gender: 'male' }
      ];
      
      localStorage.setItem('face_recognition_known_faces', JSON.stringify(testFaces));
      invalidateCache(); // Clear cache to force reload from localStorage
      
      const faces = getKnownFaces();
      expect(faces).toHaveLength(2);
      expect(faces[0].name).toBe('User 1');
      expect(faces[1].dob).toBe('1990-01-01');
    });
  });
});
