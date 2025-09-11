export interface DeviceControls {
  dPad?: {
    type: string;
    raw: string;
  } | null;
  dpad?: string;
  analogs?: {
    dual: boolean;
    single: boolean;
    isHallSensor: boolean;
    isThumbstick: boolean;
    isSlidepad: boolean;
    L3: boolean;
    R3: boolean;
    raw: string;
  } | null;
  analogSticks?: string;
  numberOfFaceButtons?: number | null;
  faceButtons?: string;
  shoulderButtons?: {
    L1: boolean;
    L2: boolean;
    L3: boolean;
    R1: boolean;
    R2: boolean;
    R3: boolean;
    M1: boolean;
    M2: boolean;
    ZL: boolean;
    ZRVertical: boolean;
    ZRHorizontal: boolean;
    L: boolean;
    R: boolean;
    LC: boolean;
    RC: boolean;
    raw: string;
  } | null;
  touchscreen?: string;
  extraButtons?: {
    power: boolean;
    reset: boolean;
    home: boolean;
    volumeUp: boolean;
    volumeDown: boolean;
    function: boolean;
    turbo: boolean;
    touchpad: boolean;
    fingerprint: boolean;
    mute: boolean;
    screenshot: boolean;
    programmableButtons: boolean;
    raw: string;
  } | null;
}
