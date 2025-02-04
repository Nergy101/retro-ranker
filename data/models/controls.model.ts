export interface DPad {
  raw: string | null;
  type: "cross" | "separated-cross" | "separated-buttons" | "d-pad" | "disc";
}

export interface Analogs {
  raw: string | null;
  dual: boolean | null;
  single: boolean | null;
  L3: boolean | null;
  R3: boolean | null;
  isHallSensor: boolean | null;
  isThumbstick: boolean | null;
  isSlidepad: boolean | null;
}

export interface ShoulderButtons {
  raw: string | null;
  L: boolean | null;
  L1: boolean | null;
  L2: boolean | null;
  L3: boolean | null;
  R: boolean | null;
  R1: boolean | null;
  R2: boolean | null;
  R3: boolean | null;
  M1: boolean | null;
  M2: boolean | null;
  LC: boolean | null;
  RC: boolean | null;
  ZL: boolean | null;
  ZRVertical: boolean | null;
  ZRHorizontal: boolean | null;
}

export interface ExtraButtons {
  raw: string | null;
  power: boolean | null;
  reset: boolean | null;
  home: boolean | null;
  volumeUp: boolean | null;
  volumeDown: boolean | null;
  function: boolean | null;
  turbo: boolean | null;
  touchpad: boolean | null;
  fingerprint: boolean | null;
  mute: boolean | null;
  screenshot: boolean | null;
  programmableButtons: boolean | null;
}

export interface DeviceControls {
  dPad: DPad | null;
  analogs: Analogs | null;
  numberOfFaceButtons: number | null;
  shoulderButtons: ShoulderButtons | null;
  extraButtons: ExtraButtons | null;
}
