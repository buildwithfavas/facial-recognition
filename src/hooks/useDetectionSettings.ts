import { useState } from 'react';

/**
 * Custom hook for managing detection settings with localStorage persistence
 * @returns Settings state and setter functions
 */
export function useDetectionSettings() {
  const [showExpressions, setShowExpressions] = useState<boolean>(() => {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('app.settings.showExpressions') : null;
      return raw ? JSON.parse(raw) : true;
    } catch {
      return true;
    }
  });

  const [intervalMs, setIntervalMs] = useState<number>(() => {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('app.settings.intervalMs') : null;
      const v = raw ? parseInt(JSON.parse(raw)) : 250;
      return Number.isFinite(v) ? v : 250;
    } catch {
      return 250;
    }
  });

  const [useTiny, setUseTiny] = useState<boolean>(() => {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('app.settings.useTiny') : null;
      return raw ? JSON.parse(raw) : false;
    } catch {
      return false;
    }
  });

  const [minConfidence, setMinConfidence] = useState<number>(() => {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('app.settings.minConfidence') : null;
      const v = raw ? parseFloat(JSON.parse(raw)) : 0.5;
      return Number.isFinite(v) ? v : 0.5;
    } catch {
      return 0.5;
    }
  });

  const [facingMode, setFacingMode] = useState<'user' | 'environment'>(() => {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('app.settings.facingMode') : null;
      const v = raw ? (JSON.parse(raw) as 'user' | 'environment') : 'user';
      return v === 'environment' ? 'environment' : 'user';
    } catch {
      return 'user';
    }
  });

  return {
    showExpressions,
    setShowExpressions,
    intervalMs,
    setIntervalMs,
    useTiny,
    setUseTiny,
    minConfidence,
    setMinConfidence,
    facingMode,
    setFacingMode,
  };
}
