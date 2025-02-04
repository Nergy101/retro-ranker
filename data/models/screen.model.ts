export interface ScreenType {
  raw: string | null;
  type:
    | "IPS"
    | "ADS"
    | "HIPS"
    | "OLED"
    | "MonochromeOLED"
    | "LCD"
    | "LTPS"
    | "TFT"
    | "AMOLED"
    | null;
  isTouchscreen: boolean | null;
  isPenCapable: boolean | null;
}

export interface ScreenResolution {
  raw: string | null;
  width: number | null;
  height: number | null;
}

export interface DeviceScreen {
  size: number | null;
  type: ScreenType | null;
  resolution: ScreenResolution[] | null;
  ppi: number[] | null;
  aspectRatio: string | null;
  lens: string | null;
}
