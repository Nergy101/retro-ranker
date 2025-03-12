export interface DeviceChargePort {
  raw: string | null;
  type:
    | "USB-C"
    | "USB-A"
    | "USB-B"
    | "Micro-USB"
    | "Mini-USB"
    | "DC-Power"
    | "Wireless"
    | null;
  numberOfPorts: number | null;
}
