export interface DeviceOs {
  raw: string;
  list: string[];
  icons: string[];
  customFirmwares: string[];
  links: {
    url: string;
    name: string;
  }[];
}
