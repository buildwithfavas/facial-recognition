/**
 * Centralized validation utilities for the application
 * Provides consistent validation logic across all components
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Image validation utilities
 */
export const imageValidators = {
  /**
   * Validates if a file is a supported image type
   * @param file - File to validate
   * @returns true if valid image type
   */
  isValidType(file: File): boolean {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    return validTypes.includes(file.type);
  },

  /**
   * Validates if a file size is within acceptable limits
   * @param file - File to validate
   * @param maxSizeMB - Maximum file size in megabytes (default: 10)
   * @returns true if file size is acceptable
   */
  isValidSize(file: File, maxSizeMB = 10): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  },

  /**
   * Validates if an image has acceptable dimensions
   * @param file - File to validate
   * @param minSize - Minimum width/height in pixels (default: 100)
   * @returns Promise resolving to validation result
   */
  async isValidDimensions(file: File, minSize = 100): Promise<ValidationResult> {
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        
        if (img.width < minSize || img.height < minSize) {
          resolve({
            valid: false,
            error: `Image is too small. Minimum size is ${minSize}x${minSize} pixels.`
          });
        } else {
          resolve({ valid: true });
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve({
          valid: false,
          error: 'Failed to load image. Please ensure it\'s a valid image file.'
        });
      };

      img.src = objectUrl;
    });
  },

  /**
   * Performs comprehensive image validation
   * @param file - File to validate
   * @param options - Validation options
   * @returns Promise resolving to validation result
   */
  async validateImage(
    file: File,
    options: { maxSizeMB?: number; minSize?: number } = {}
  ): Promise<ValidationResult> {
    // Check file type
    if (!this.isValidType(file)) {
      return {
        valid: false,
        error: 'Invalid file type. Please upload PNG, JPG, JPEG, or WEBP images.'
      };
    }

    // Check file size
    if (!this.isValidSize(file, options.maxSizeMB)) {
      return {
        valid: false,
        error: `File size too large. Maximum size is ${options.maxSizeMB || 10}MB.`
      };
    }

    // Check dimensions
    return await this.isValidDimensions(file, options.minSize);
  }
};

/**
 * User input validation utilities
 */
export const userValidators = {
  /**
   * Validates a user's name
   * @param name - Name to validate
   * @param options - Validation options
   * @returns Validation result with error message if invalid
   */
  isValidName(
    name: string,
    options: { minLength?: number; maxLength?: number } = {}
  ): ValidationResult {
    const minLength = options.minLength ?? 2;
    const maxLength = options.maxLength ?? 50;

    if (!name || !name.trim()) {
      return { valid: false, error: 'Name is required' };
    }

    const trimmedName = name.trim();

    if (trimmedName.length < minLength) {
      return {
        valid: false,
        error: `Name must be at least ${minLength} characters long`
      };
    }

    if (trimmedName.length > maxLength) {
      return {
        valid: false,
        error: `Name must be less than ${maxLength} characters`
      };
    }

    return { valid: true };
  },

  /**
   * Validates a date of birth
   * @param dob - Date of birth string in YYYY-MM-DD format
   * @returns Validation result with error message if invalid
   */
  isValidDOB(dob: string): ValidationResult {
    if (!dob || typeof dob !== 'string') {
      return { valid: false, error: 'Date of birth is required' };
    }

    const birthDate = new Date(dob);

    if (isNaN(birthDate.getTime())) {
      return { valid: false, error: 'Invalid date format' };
    }

    const today = new Date();

    if (birthDate > today) {
      return { valid: false, error: 'Date of birth cannot be in the future' };
    }

    const yearDiff = today.getFullYear() - birthDate.getFullYear();
    if (yearDiff > 150) {
      return { valid: false, error: 'Date of birth exceeds reasonable limit' };
    }

    return { valid: true };
  }
};

/**
 * General validation utilities
 */
export const generalValidators = {
  /**
   * Checks if a value is not null or undefined
   * @param value - Value to check
   * @returns true if value exists
   */
  exists<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
  },

  /**
   * Checks if a string is empty or contains only whitespace
   * @param value - String to check
   * @returns true if empty or whitespace
   */
  isEmpty(value: string): boolean {
    return !value || value.trim().length === 0;
  }
};

/**
 * Combined validators export
 */
export const validators = {
  image: imageValidators,
  user: userValidators,
  general: generalValidators
};

export default validators;
