export interface DeviceScreen {
  size?: number | null;
  type?: {
    type: string;
    raw: string;
    isTouchscreen?: boolean;
    isPenCapable?: boolean;
  } | null;
  resolution?:
    | Array<{
      raw: string;
      width: number;
      height: number;
    }>
    | null;
  aspectRatio?: string | null;
  refreshRate?: string;
  ppi?: number[] | null;
  lens?: string | null;
}
