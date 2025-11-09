import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

type CameraState = {
  streaming: boolean;
  deviceId?: string;
};

const initialState: CameraState = {
  streaming: false,
};

const cameraSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {
    startStream: (state) => {
      state.streaming = true;
    },
    stopStream: (state) => {
      state.streaming = false;
    },
    setDeviceId: (state, action: PayloadAction<string | undefined>) => {
      state.deviceId = action.payload;
    },
  },
});

export const { startStream, stopStream, setDeviceId } = cameraSlice.actions;

export const selectStreaming = (state: RootState) => state.camera.streaming;
export const selectDeviceId = (state: RootState) => state.camera.deviceId;
export default cameraSlice.reducer;
