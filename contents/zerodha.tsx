import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://kite.zerodha.com/*"],
  all_frames: false
}

// Zerodha-specific data extraction logic
const ZerodhaEnhancer = () => {
  return null // This content script only runs extraction logic
}

export default ZerodhaEnhancer
