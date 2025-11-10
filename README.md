# 🎭 Facial Recognition Web Application

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)

> A real-time facial recognition system built with React, TypeScript, and TensorFlow.js that runs entirely in your browser. Privacy-first with all processing happening locally - no data sent to servers!

## 🎯 Features

### Core Capabilities
- **Real-time Face Detection:** Continuously detect faces from webcam feed
- **Multiple Face Support:** Detect and track multiple faces simultaneously
- **Facial Analysis:**
  - Age estimation
  - Gender classification
  - Emotion recognition (7 emotions: neutral, happy, sad, angry, fearful, disgusted, surprised)
  - Face recognition and matching
- **Face Registration:** Register faces with names for automatic recognition
- **Image Upload:** Analyze faces in uploaded images (PNG/JPEG)
- **Visual Overlay:** Emotion-based color-coded bounding boxes with labels showing:
  - Name (registered or "Unknown")
  - Age, Gender, Emotion with confidence
  - **Green** for happy, **Red** for angry, **Blue** for sad, and more!
- **Responsive Design:** Works seamlessly on desktop and mobile devices

### Advanced Features
- **Face Registration System:**
  - Register unknown faces with names
  - Store facial descriptors in browser localStorage
  - Automatic recognition when registered people appear
  - Manage database (view/delete registered faces)
- **Emotion-Based Color Coding:**
  - Happy → Green (#10b981)
  - Angry → Red (#ef4444)
  - Sad → Blue (#3b82f6)
  - Surprised → Orange (#f59e0b)
  - Neutral → Teal (#14b8a6)
  - Disgusted → Purple (#8b5cf6)
  - Fearful → Indigo (#6366f1)
- **Configurable Settings:** Adjust detection frequency, model type, confidence threshold
- **Privacy-First:** All processing happens locally in your browser, no data sent to servers
- **Download Results:** Export annotated images with detected faces
- **Mobile Support:** Front/back camera switching on mobile devices
- **Keyboard Shortcuts:** Quick actions with Space and S keys
- **Help System:** In-app guide with accordion sections

## 🛠️ Tech Stack

- **Frontend:** React 19 + TypeScript
- **State Management:** Redux Toolkit
- **UI Framework:** React Bootstrap 5
- **Face Recognition:** @vladmandic/face-api (TensorFlow.js)
- **Build Tool:** Vite
- **Webcam Access:** react-webcam (MediaDevices.getUserMedia API)

## 📋 Requirements Met

This application fulfills 100% of client requirements:
- ✅ React + TypeScript implementation
- ✅ Start/Stop webcam controls
- ✅ Facial recognition with TensorFlow.js
- ✅ Visual overlay on detected faces
- ✅ Display name, age, gender, and emotions
- ✅ Multiple face detection
- ✅ Responsive desktop and mobile design
- ✅ Redux state management
- ✅ **Bonus:** Image upload functionality
- ✅ **Bonus:** Real-time emotion recognition
- ✅ **Extra:** Face registration and persistent storage
- ✅ **Extra:** Emotion-based color coding
- ✅ **Extra:** Name display in overlay

See [REQUIREMENTS_COMPLIANCE.md](./REQUIREMENTS_COMPLIANCE.md) for detailed analysis.
See [EMOTION_COLOR_GUIDE.md](./EMOTION_COLOR_GUIDE.md) for color coding details.
See [FACE_REGISTRATION_GUIDE.md](./FACE_REGISTRATION_GUIDE.md) for registration system guide.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Modern browser (Chrome, Firefox, Edge, Safari)
- HTTPS connection (or localhost for development)

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Production Build
```bash
npm run build       # Build for production
npm run preview     # Preview production build
```

## ⌨️ Keyboard Shortcuts

- **Space:** Capture a snapshot (when webcam is active)
- **S:** Start/Stop webcam streaming

*Note: Shortcuts are disabled while typing in input fields or text areas.*

## 📖 Usage Guide

### Starting Face Detection
1. Click **Start** button in the navbar
2. Grant webcam permission when prompted
3. Green boxes will appear around detected faces
4. Face attributes (age, gender, emotion) display in overlay labels

### Capturing & Analyzing Images
- **From Webcam:** Press **Space** or click **Capture (Space)** button
- **Upload Image:** Click **Upload** → Select PNG/JPEG file
- **Download Results:** Click **Download annotated** to save image with boxes

### Configuring Settings
1. Click **Settings** button
2. Adjust:
   - Detection frequency (150-5000ms)
   - Model type (Tiny for speed, SSD for accuracy)
   - Confidence threshold (0.0-1.0)
   - Camera facing mode (mobile)
   - Show/hide expressions
3. Settings persist across sessions

### Enrolling Faces
1. Capture a frame with a detected face
2. Click **Enroll** in the detection list
3. Enter a name for the face
4. Future detections will show the enrolled name

## 📂 Project Structure

```
src/
├── app/              # Redux store configuration
├── components/       # React components (Navbar, Overlay, Modals, etc.)
│   ├── ErrorBoundary.tsx      # Error handling boundary
│   ├── FaceOverlay.tsx         # Face detection overlay (memoized)
│   ├── WebcamFeed.tsx          # Webcam controls
│   └── ...modals               # Various modal dialogs
├── constants/        # Application-wide constants
│   └── index.ts                # Centralized configuration
├── features/
│   ├── camera/      # Camera state & services
│   │   ├── CameraService.ts    # Camera control logic
│   │   └── CameraSlice.ts      # Redux state management
│   └── faces/       # Face detection & recognition
│       ├── FaceService.ts      # Face detection engine
│       ├── Recognition.ts      # Face matching & storage
│       └── types.ts            # TypeScript interfaces
├── hooks/            # Custom React hooks
│   ├── useFaceDetection.ts    # Face detection hook
│   └── useLocalStorage.ts     # localStorage hook
├── pages/           # Main application pages
│   └── Home.tsx                # Main detection interface
├── utils/           # Utility functions
│   ├── validators.ts           # Input validation
│   └── modelLoader.ts          # ML model loading
└── __tests__/       # Test suites
```

### Architecture Highlights

- **Error Boundary**: Catches React errors gracefully
- **Custom Hooks**: Reusable stateful logic
- **Centralized Validation**: Consistent input validation
- **TypeScript**: Full type safety throughout
- **Performance Optimized**: React.memo, useCallback, useMemo
- **Comprehensive Testing**: Unit tests with Vitest

## 🧪 Testing

### Running Tests
```bash
npm run test        # Run unit tests with Vitest
npm run test:ui     # Run tests with UI
npm run coverage    # Generate coverage report
npm run lint        # Code quality checks
npm run type-check  # TypeScript type checking
```

### Test Coverage

- **Recognition Module**: CRUD operations, age calculation, face matching
- **Validators**: Image validation, user input validation
- **Custom Hooks**: Face detection, localStorage management
- **Target Coverage**: 80%+

### Test Structure
```
src/
├── features/faces/__tests__/
│   └── Recognition.test.ts
├── utils/__tests__/
│   └── validators.test.ts
└── hooks/__tests__/
    ├── useFaceDetection.test.ts
    └── useLocalStorage.test.ts
```

## 🎖️ Code Quality & Best Practices

### Recent Improvements

This codebase has undergone a comprehensive senior-level code review with the following improvements implemented:

#### ✅ Completed
- **Error Boundary**: Prevents app crashes, shows user-friendly error messages
- **Centralized Validation**: Reusable validators in `utils/validators.ts`
- **Custom Hooks**: Extracted reusable logic (`useFaceDetection`, `useLocalStorage`)
- **TypeScript Strict Mode**: Removed all `any` types, proper type safety
- **Performance Optimization**: React.memo on expensive components
- **Consistent Naming**: All components use specific interface names (no generic `Props`)
- **Constants File**: Application-wide configuration in `constants/index.ts`
- **JSDoc Documentation**: All public APIs documented with examples
- **Unit Tests**: Core functionality covered with Vitest

#### 📋 Code Standards
- **No `any` types**: Full TypeScript type coverage
- **Consistent interfaces**: All components use `ComponentNameProps` pattern
- **Error handling**: Try-catch blocks with user-friendly messages
- **Toast notifications**: All user feedback via react-toastify
- **Validation**: Input validation at multiple layers
- **Accessibility**: ARIA labels, keyboard navigation support

### Architecture Patterns

- **Feature-based structure**: Code organized by domain (camera, faces)
- **Separation of concerns**: Services, state, UI cleanly separated
- **Dependency injection**: Services passed as props where needed
- **Immutable state**: Redux Toolkit ensures immutability
- **Type-safe Redux**: Fully typed actions, reducers, selectors

See [IMPROVEMENTS.md](./IMPROVEMENTS.md) for detailed changelog of all improvements.

### Manual Test Checklist

- **Launch app**
  - Open the app over HTTPS. Confirm Navbar loads and no errors in console.

- **Start/Stop camera**
  - Click Start. Grant webcam permission. Verify live video appears.
  - Click Stop. Verify video area shows "Camera is stopped" placeholder.
  - Use keyboard: press `S` to toggle start/stop.

- **Live detection**
  - With camera running, ensure green boxes appear around faces.
  - Verify multiple faces show multiple boxes and labels.
  - Check the Detections list updates with thumbnails and attributes.

- **Upload image detection**
  - Click Upload and choose a PNG/JPEG. Confirm image displays in the left pane.
  - Verify boxes/labels overlay correctly and Detections list populates.

- **Emotion recognition**
  - Open Settings → Enable Emotion Recognition (if disabled). Save.
  - Confirm top emotion and probability appear on labels and in the Detections list.
  - Toggle it off and verify emotions disappear, boxes remain.

- **Enrollment and recognition**
  - Capture a frame (Capture button or press Space) and enroll a detected face via Enroll dialog.
  - After enrolling, capture again or keep streaming; verify the name appears for the matched face.

- **Settings impact**
  - Change Detection frequency (ms) and confirm CPU usage/refresh rate changes.
  - Switch Model between Tiny and SSD and confirm detection speed/accuracy changes.
  - Adjust Confidence threshold and verify box count changes accordingly.
  - On mobile, change Camera to Front/Back (facingMode) and verify camera switches (device support dependent).

- **Download annotated**
  - Click "Download annotated" and verify a PNG downloads with boxes and labels drawn.

- **Keyboard shortcuts**
  - `Space`: captures snapshot (when webcam active).
  - `S`: start/stop streaming.
  - Verify shortcuts are ignored while typing in inputs/textareas.

- **Privacy & storage**
  - Confirm no network requests for images/descriptors.
  - Verify enrolled faces persist across reloads (localStorage) and can be cleared/exported as documented.