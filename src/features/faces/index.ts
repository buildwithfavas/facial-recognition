export * from './types';
export * from './FaceService';
export {
  default as facesReducer,
  setDetections,
  clearDetections,
  setStatus,
  setError,
} from './FacesSlice';
