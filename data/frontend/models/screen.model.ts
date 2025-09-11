export interface DeviceScreen {
  size?: number;
  type?: {
    type: string;
    isTouchscreen?: boolean;
    isPenCapable?: boolean;
  };
  ppi?: number[];
}
