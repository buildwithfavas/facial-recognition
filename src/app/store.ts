import { configureStore } from '@reduxjs/toolkit';
import cameraReducer from '../features/camera/CameraSlice';
import facesReducer from '../features/faces/FacesSlice';

export const store = configureStore({
  reducer: {
    camera: cameraReducer,
    faces: facesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
