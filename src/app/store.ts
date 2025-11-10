import { configureStore } from '@reduxjs/toolkit';
import cameraReducer from '../features/camera/CameraSlice';
import facesReducer from '../features/faces/FacesSlice';

export const store = configureStore({
  reducer: {
    camera: cameraReducer,
    faces: facesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these paths in the state because face detection results
        // from face-api.js contain non-serializable data (expressions objects)
        ignoredActions: ['faces/setDetections'],
        ignoredPaths: ['faces.detections'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
