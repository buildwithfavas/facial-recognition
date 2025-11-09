export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
export const uuid = () => Math.random().toString(36).slice(2);
