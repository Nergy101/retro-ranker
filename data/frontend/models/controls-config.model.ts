export interface ControlConfig {
  raw: string | null;
  type:
    | "wheel"
    | "dedicated-button"
    | "button-combination"
    | "slider"
    | "menu"
    | null;
}

export interface PowerControl {
  raw: string | null;
  type: "button" | "switch" | null;
}

export interface DeviceControlConfig {
  volumeControl: ControlConfig | null;
  brightnessControl: ControlConfig | null;
  powerControl: PowerControl | null;
}
