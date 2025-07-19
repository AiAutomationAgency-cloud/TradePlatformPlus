import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://groww.in/*"],
  all_frames: false
}

// Groww-specific data extraction logic
const GrowwEnhancer = () => {
  return null // This content script only runs extraction logic
}

export default GrowwEnhancer
