import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import type { AppDispatch } from '../app/store';
import { detectFaces } from '../features/faces/FaceService';
import { setDetections } from '../features/faces/FacesSlice';
import type { FaceResult } from '../features/faces/types';

/**
 * Custom hook for face detection operations
 * Handles detection from data URLs with proper error handling and user feedback
 * 
 * @returns Object containing detection functions
 * 
 * @example
 * const { detectFromDataUrl } = useFaceDetection();
 * await detectFromDataUrl(imageDataUrl, true);
 */
export function useFaceDetection() {
  const dispatch = useDispatch<AppDispatch>();

  /**
   * Detects faces from an image data URL
   * @param dataUrl - Base64 encoded image data URL
   * @param isUpload - Whether this is from a user upload (affects feedback)
   * @param onClear - Optional callback to clear the image if no faces detected
   * @returns Promise resolving to detected faces
   */
  const detectFromDataUrl = useCallback(
    async (
      dataUrl: string,
      isUpload = false,
      onClear?: () => void
    ): Promise<FaceResult[]> => {
      try {
        // Create and load image
        const img = new Image();
        img.src = dataUrl;

        await new Promise((resolve, reject) => {
          img.onload = () => resolve(null);
          img.onerror = reject;
        });

        // Detect faces
        const results: FaceResult[] = await detectFaces(img);

        // Handle no faces detected
        if (results.length === 0) {
          if (isUpload) {
            toast.warning(
              'No faces detected in the uploaded image. Please upload an image with visible faces.'
            );
            onClear?.();
          }
          dispatch(setDetections([]));
          return [];
        }

        // Success feedback for uploads
        if (isUpload) {
          toast.success(
            `${results.length} face${results.length > 1 ? 's' : ''} detected successfully!`
          );
        }

        dispatch(setDetections(results));
        return results;
      } catch (error) {
        console.error('Detection error:', error);
        toast.error('Failed to process the image. Please try again.');

        if (isUpload) {
          onClear?.();
        }

        dispatch(setDetections([]));
        return [];
      }
    },
    [dispatch]
  );

  return {
    detectFromDataUrl
  };
}
