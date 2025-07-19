import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://web.angelone.in/*"],
  all_frames: false
}

// AngelOne-specific data extraction logic
const AngelOneEnhancer = () => {
  return null // This content script only runs extraction logic
}

export default AngelOneEnhancer
