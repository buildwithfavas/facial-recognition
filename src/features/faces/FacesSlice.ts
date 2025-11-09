import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { FaceResult } from './types';

type FacesState = {
  detections: FaceResult[];
  isDetecting: boolean;
  lastUpdated: string | null;
};

const initialState: FacesState = {
  detections: [],
  isDetecting: false,
  lastUpdated: null,
};

const facesSlice = createSlice({
  name: 'faces',
  initialState,
  reducers: {
    setDetections: (state, action: PayloadAction<FaceResult[]>) => {
      state.detections = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    clearDetections: (state) => {
      state.detections = [];
      state.lastUpdated = null;
    },
    setIsDetecting: (state, action: PayloadAction<boolean>) => {
      state.isDetecting = action.payload;
    },
  },
});

export const { setDetections, clearDetections, setIsDetecting } = facesSlice.actions;
export default facesSlice.reducer;
