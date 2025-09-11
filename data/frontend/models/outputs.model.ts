export interface DeviceOutputs {
  videoOutput?: {
    AV?: boolean;
    hasHdmi?: boolean;
    hasDisplayPort?: boolean;
    hasVga?: boolean;
    hasDvi?: boolean;
    hasUsbC?: boolean;
    hasMicroHdmi?: boolean;
    hasMiniHdmi?: boolean;
    OcuLink?: boolean;
  };
  audioOutput?: {
    has35mmJack?: boolean;
    hasHeadphoneJack?: boolean;
    hasUsbC?: boolean;
  };
  speaker?: {
    type: string;
  };
}
