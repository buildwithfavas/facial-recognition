import { describe, it, expect, vi } from 'vitest';
import { validators, imageValidators, userValidators } from '../validators';

describe('Validators', () => {
  describe('imageValidators', () => {
    describe('isValidType', () => {
      it('should accept valid image types', () => {
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        
        validTypes.forEach(type => {
          const file = new File([''], 'test.png', { type });
          expect(imageValidators.isValidType(file)).toBe(true);
        });
      });

      it('should reject invalid image types', () => {
        const invalidTypes = ['image/gif', 'image/bmp', 'application/pdf', 'text/plain'];
        
        invalidTypes.forEach(type => {
          const file = new File([''], 'test.file', { type });
          expect(imageValidators.isValidType(file)).toBe(false);
        });
      });
    });

    describe('isValidSize', () => {
      it('should accept files within size limit', () => {
        const file = new File(['x'.repeat(1024 * 1024)], 'test.png', { type: 'image/png' }); // 1MB
        expect(imageValidators.isValidSize(file, 10)).toBe(true);
      });

      it('should reject files exceeding size limit', () => {
        const file = new File(['x'.repeat(11 * 1024 * 1024)], 'test.png', { type: 'image/png' }); // 11MB
        expect(imageValidators.isValidSize(file, 10)).toBe(false);
      });

      it('should use default 10MB limit', () => {
        const file = new File(['x'.repeat(9 * 1024 * 1024)], 'test.png', { type: 'image/png' }); // 9MB
        expect(imageValidators.isValidSize(file)).toBe(true);
      });
    });

    describe('isValidDimensions', () => {
      it('should accept images with valid dimensions', async () => {
        // Mock Image constructor
        const mockImage = {
          width: 200,
          height: 200,
          onload: null as (() => void) | null,
          onerror: null as (() => void) | null,
          src: ''
        };

        vi.stubGlobal('Image', class {
          width = mockImage.width;
          height = mockImage.height;
          onload: (() => void) | null = null;
          onerror: (() => void) | null = null;
          set src(_value: string) {
            queueMicrotask(() => this.onload?.());
          }
        });

        vi.stubGlobal('URL', {
          createObjectURL: vi.fn(() => 'blob:test'),
          revokeObjectURL: vi.fn()
        });

        const file = new File([''], 'test.png', { type: 'image/png' });
        const result = await imageValidators.isValidDimensions(file, 100);

        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it('should reject images with small dimensions', async () => {
        const mockImage = {
          width: 50,
          height: 50,
          onload: null as (() => void) | null,
          onerror: null as (() => void) | null
        };

        vi.stubGlobal('Image', class {
          width = mockImage.width;
          height = mockImage.height;
          onload: (() => void) | null = null;
          onerror: (() => void) | null = null;
          set src(_value: string) {
            queueMicrotask(() => this.onload?.());
          }
        });

        vi.stubGlobal('URL', {
          createObjectURL: vi.fn(() => 'blob:test'),
          revokeObjectURL: vi.fn()
        });

        const file = new File([''], 'test.png', { type: 'image/png' });
        const result = await imageValidators.isValidDimensions(file, 100);

        expect(result.valid).toBe(false);
        expect(result.error).toContain('too small');
      });
    });
  });

  describe('userValidators', () => {
    describe('isValidName', () => {
      it('should accept valid names', () => {
        const validNames = ['John Doe', 'Jane', 'A' + 'b'.repeat(48)]; // 2-50 chars
        
        validNames.forEach(name => {
          const result = userValidators.isValidName(name);
          expect(result.valid).toBe(true);
          expect(result.error).toBeUndefined();
        });
      });

      it('should reject empty names', () => {
        const result = userValidators.isValidName('');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('required');
      });

      it('should reject whitespace-only names', () => {
        const result = userValidators.isValidName('   ');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('required');
      });

      it('should reject names that are too short', () => {
        const result = userValidators.isValidName('A');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('at least');
      });

      it('should reject names that are too long', () => {
        const result = userValidators.isValidName('A'.repeat(51));
        expect(result.valid).toBe(false);
        expect(result.error).toContain('less than');
      });

      it('should trim whitespace before validation', () => {
        const result = userValidators.isValidName('  John Doe  ');
        expect(result.valid).toBe(true);
      });

      it('should accept custom length constraints', () => {
        const result = userValidators.isValidName('ABC', { minLength: 3, maxLength: 5 });
        expect(result.valid).toBe(true);
      });
    });

    describe('isValidDOB', () => {
      it('should accept valid dates', () => {
        const result = userValidators.isValidDOB('1990-01-01');
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it('should reject empty date', () => {
        const result = userValidators.isValidDOB('');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('required');
      });

      it('should reject invalid date format', () => {
        const result = userValidators.isValidDOB('invalid-date');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Invalid date format');
      });

      it('should reject future dates', () => {
        const result = userValidators.isValidDOB('2030-01-01');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('future');
      });

      it('should reject dates exceeding 150 years', () => {
        const result = userValidators.isValidDOB('1800-01-01');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('reasonable limit');
      });

      it('should accept leap year dates', () => {
        const result = userValidators.isValidDOB('2000-02-29');
        expect(result.valid).toBe(true);
      });
    });
  });

  describe('generalValidators', () => {
    describe('exists', () => {
      it('should return true for existing values', () => {
        expect(validators.general.exists(0)).toBe(true);
        expect(validators.general.exists('')).toBe(true);
        expect(validators.general.exists(false)).toBe(true);
        expect(validators.general.exists([])).toBe(true);
        expect(validators.general.exists({})).toBe(true);
      });

      it('should return false for null and undefined', () => {
        expect(validators.general.exists(null)).toBe(false);
        expect(validators.general.exists(undefined)).toBe(false);
      });
    });

    describe('isEmpty', () => {
      it('should return true for empty strings', () => {
        expect(validators.general.isEmpty('')).toBe(true);
        expect(validators.general.isEmpty('   ')).toBe(true);
        expect(validators.general.isEmpty('\t\n')).toBe(true);
      });

      it('should return false for non-empty strings', () => {
        expect(validators.general.isEmpty('Hello')).toBe(false);
        expect(validators.general.isEmpty('  x  ')).toBe(false);
      });
    });
  });

  describe('combined validators export', () => {
    it('should export all validator groups', () => {
      expect(validators.image).toBeDefined();
      expect(validators.user).toBeDefined();
      expect(validators.general).toBeDefined();
    });
  });
});
