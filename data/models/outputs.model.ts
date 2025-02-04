export interface VideoOutput {
  raw: string | null;
  hasUsbC: boolean | null;
  hasMicroHdmi: boolean | null;
  hasMiniHdmi: boolean | null;
  hasHdmi: boolean | null;
  hasDvi: boolean | null;
  hasVga: boolean | null;
  hasDisplayPort: boolean | null;
  OcuLink: boolean | null;
  AV: boolean | null;
}

export interface AudioOutput {
  raw: string | null;
  has35mmJack: boolean | null;
  hasHeadphoneJack: boolean | null;
  hasUsbC: boolean | null;
}

export interface Speaker {
  raw: string | null;
  type: "mono" | "stereo" | "surround" | null;
}

export interface DeviceOutputs {
  videoOutput: VideoOutput | null;
  audioOutput: AudioOutput | null;
  speaker: Speaker | null;
}
