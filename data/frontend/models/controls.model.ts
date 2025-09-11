export interface DeviceControls {
  dPad?: {
    type: string;
  };
  analogs?: {
    dual: boolean;
    single: boolean;
    isHallSensor: boolean;
    L3: boolean;
    R3: boolean;
  };
  numberOfFaceButtons?: number;
  shoulderButtons?: {
    L1: boolean;
    L2: boolean;
    L3: boolean;
    R1: boolean;
    R2: boolean;
    R3: boolean;
    M1: boolean;
    M2: boolean;
  };
  extraButtons?: {
    home: boolean;
    function: boolean;
    turbo: boolean;
    touchpad: boolean;
    programmableButtons: boolean;
  };
}
