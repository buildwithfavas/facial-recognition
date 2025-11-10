/**
 * Application-wide constants
 * Centralized configuration values used throughout the application
 */

/**
 * LocalStorage keys
 */
export const STORAGE_KEYS = {
  KNOWN_FACES: 'face_recognition_known_faces',
  USER_PREFERENCES: 'face_recognition_preferences',
  CAMERA_SETTINGS: 'face_recognition_camera_settings',
} as const;

/**
 * File upload constraints
 */
export const FILE_CONSTRAINTS = {
  MAX_SIZE_MB: 10,
  MAX_SIZE_BYTES: 10 * 1024 * 1024,
  MIN_IMAGE_DIMENSION: 100,
  ACCEPTED_TYPES: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
  ACCEPTED_EXTENSIONS: ['.png', '.jpg', '.jpeg', '.webp'],
} as const;

/**
 * Validation constraints
 */
export const VALIDATION_CONSTRAINTS = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  MAX_AGE_YEARS: 150,
} as const;

/**
 * Face detection settings
 */
export const DETECTION_SETTINGS = {
  MIN_CONFIDENCE: 0.5,
  MATCH_THRESHOLD: 0.6,
  DETECTION_INTERVAL_MS: 300,
  DETECTION_INTERVAL_MOBILE_MS: 500,
  DETECTION_INTERVAL_CPU_MS: 1000,
} as const;

/**
 * UI Constants
 */
export const UI_CONSTANTS = {
  TOAST_AUTO_CLOSE_MS: 3000,
  MODAL_ANIMATION_MS: 300,
  DEBOUNCE_DELAY_MS: 300,
} as const;

/**
 * Model loading URLs
 */
export const MODEL_URLS = {
  LOCAL: '/models',
  CDN: 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model',
} as const;

/**
 * Gender options for user input
 */
export const GENDER_OPTIONS = [
  { value: '', label: 'Prefer not to say' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
] as const;

/**
 * Keyboard shortcuts
 */
export const KEYBOARD_SHORTCUTS = {
  CAPTURE: 'c',
  START_STOP: 's',
  TOGGLE_EXPRESSIONS: 'e',
  HELP: 'h',
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  CAMERA_PERMISSION_DENIED: 'Camera access denied. Please grant camera permissions and try again.',
  CAMERA_NOT_FOUND: 'No camera found. Please connect a camera and try again.',
  CAMERA_IN_USE: 'Camera is already in use by another application.',
  CAMERA_UNSUPPORTED: 'Camera is not supported in this browser.',
  
  FILE_INVALID_TYPE: 'Invalid file type. Please upload PNG, JPG, JPEG, or WEBP images.',
  FILE_TOO_LARGE: `File size too large. Maximum size is ${FILE_CONSTRAINTS.MAX_SIZE_MB}MB.`,
  FILE_TOO_SMALL: `Image is too small. Minimum size is ${FILE_CONSTRAINTS.MIN_IMAGE_DIMENSION}x${FILE_CONSTRAINTS.MIN_IMAGE_DIMENSION} pixels.`,
  
  NO_FACES_DETECTED: 'No faces detected in the uploaded image. Please upload an image with visible faces.',
  FACE_DETECTION_FAILED: 'Failed to detect faces. Please try again.',
  
  MODEL_LOAD_FAILED: 'Failed to load face detection models. Please check your internet connection and try again.',
  
  NAME_REQUIRED: 'Please enter a name',
  NAME_TOO_SHORT: `Name must be at least ${VALIDATION_CONSTRAINTS.NAME_MIN_LENGTH} characters long`,
  NAME_TOO_LONG: `Name must be less than ${VALIDATION_CONSTRAINTS.NAME_MAX_LENGTH} characters`,
  
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  FACE_REGISTERED: 'Face registered successfully!',
  USER_ADDED: 'User added successfully!',
  USER_UPDATED: 'User updated successfully!',
  USER_DELETED: 'User deleted successfully!',
  ALL_CLEARED: 'All users cleared successfully!',
  FACES_DETECTED: (count: number) => `${count} face${count !== 1 ? 's' : ''} detected successfully!`,
} as const;

/**
 * Application metadata
 */
export const APP_METADATA = {
  NAME: 'Facial Recognition',
  VERSION: '1.0.0',
  DESCRIPTION: 'Real-time facial recognition application with emotion detection',
} as const;

/**
 * Type exports for better TypeScript support
 */
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
export type GenderOption = typeof GENDER_OPTIONS[number];
export type KeyboardShortcut = typeof KEYBOARD_SHORTCUTS[keyof typeof KEYBOARD_SHORTCUTS];
