import { EmulationTier } from "../enums/EmulationTier.ts";
import { SystemRating } from "../../data/models/system-rating.model.ts";
import { Cooling } from "./cooling.model.ts";
export interface Device {
  name: {
    raw: string;
    sanitized: string;
    normalized: string;
  };
  brand: string;
  image: {
    originalUrl: string | null;
    url: string | null;
    alt: string | null;
  };
  released: {
    raw: string | null;
    mentionedDate: Date | null;
  };
  formFactor: string | null;
  os: {
    raw: string;
    list: string[];
    icons: string[]; // ph icon class names, can be used with deviceService.getOsIconComponent or <i class={icon} />
    customFirmwares: string[];
    links: {
      url: string;
      name: string;
    }[];
  };
  performance: {
    tier: EmulationTier | null;
    rating: number | null; // 0-15
    normalizedRating: number | null; // 0-10

    // samey?
    maxEmulation: string | null;
    emulationLimit: string | null;
  };
  systemRatings: SystemRating[];

  systemOnChip: string | null;
  architecture: "ARM" | "x86-64" | "MIPS" | "other" | null;

  // CPU
  cpus: {
    raw: string | null;
    names: string[];
    cores: number | null;
    threads: number | null;
    clockSpeed: {
      min: number | null;
      max: number | null;
      unit: "MHz" | "GHz" | null;
    } | null;
  }[] | null;

  // GPU
  gpus: {
    name: string | null;
    cores: string | null;
    clockSpeed: {
      min: number | null;
      max: number | null;
      unit: "MHz" | "GHz" | null;
    } | null;
  }[] | null;

  ram: {
    raw: string | null;
    sizes: number[] | null;
    unit: "GB" | "MB" | "KB" | null;
    type:
      | "DDR"
      | "DDR2"
      | "DDR3"
      | "DDR4"
      | "DDR5"
      | "LPDDR4"
      | "LPDDR4X"
      | "LPDDR5"
      | "LPDDR5X"
      | "other"
      | null;
  } | null;
  battery: {
    raw: string | null;
    capacity: number | null;
    unit: "mAh" | "Wh" | null;
  };
  chargePort: {
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
  } | null;
  storage: string | null;

  // Screen
  screen: {
    size: number | null;
    type: {
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
    } | null;
    resolution: {
      raw: string | null;
      width: number | null;
      height: number | null;
    }[] | null;
    ppi: number[] | null;
    aspectRatio: string | null;
    lens: string | null;
  };

  cooling: Cooling;

  // Controls
  controls: {
    dPad: {
      raw: string | null;
      type:
        | "cross"
        | "separated-cross"
        | "separated-buttons"
        | "d-pad"
        | "disc";
    } | null;
    analogs: {
      raw: string | null;
      dual: boolean | null;
      single: boolean | null;

      L3: boolean | null;
      R3: boolean | null;
      isHallSensor: boolean | null;
      isThumbstick: boolean | null;
      isSlidepad: boolean | null;
    } | null;

    numberOfFaceButtons: number | null;
    shoulderButtons: {
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
    } | null;

    extraButtons: {
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
    } | null;
  };

  connectivity: {
    hasWifi: boolean | null;
    hasBluetooth: boolean | null;
    hasNfc: boolean | null;
    hasUsb: boolean | null;
    hasUsbC: boolean | null;
  };

  // Outputs
  outputs: {
    videoOutput: {
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
    } | null;
    audioOutput: {
      raw: string | null;
      has35mmJack: boolean | null;
      hasHeadphoneJack: boolean | null;
      hasUsbC: boolean | null;
    } | null;
    speaker: {
      raw: string | null;
      type: "mono" | "stereo" | "surround" | null;
    } | null;
  };

  rumble: boolean | null;
  sensors: {
    raw: string | null;
    hasMicrophone: boolean | null;
    hasAccelerometer: boolean | null;
    hasGyroscope: boolean | null;
    hasCompass: boolean | null;
    hasMagnetometer: boolean | null;
    hasBarometer: boolean | null;
    hasProximitySensor: boolean | null;
    hasAmbientLightSensor: boolean | null;
    hasFingerprintSensor: boolean | null;
    hasCamera: boolean | null;
    hasGravitySensor: boolean | null;
    hasPressureSensor: boolean | null;
    hasTemperatureSensor: boolean | null;
    hasHumiditySensor: boolean | null;
    hasHeartRateSensor: boolean | null;
    hasAntenna: boolean | null;
    screenClosure: boolean | null;
  } | null;
  lowBatteryIndicator: string | null;

  volumeControl: {
    raw: string | null;
    type:
      | "wheel"
      | "dedicated-button"
      | "button-combination"
      | "slider"
      | "menu"
      | null;
  } | null;
  brightnessControl: {
    raw: string | null;
    type:
      | "wheel"
      | "dedicated-button"
      | "button-combination"
      | "slider"
      | "menu"
      | null;
  } | null;
  powerControl: {
    raw: string | null;
    type: "button" | "switch" | null;
  } | null;

  dimensions: {
    length: number | null;
    width: number | null;
    height: number | null;
  } | null;
  weight: number | null;
  shellMaterial: {
    raw: string | null;
    isPlastic: boolean | null;
    isMetal: boolean | null;
    isAluminum: boolean | null;
    isMagnesiumAlloy: boolean | null;
    isOther: boolean | null;
  } | null;
  colors: string[];

  // Reviews
  reviews: {
    videoReviews: {
      url: string;
      name: string;
    }[];
    writtenReviews: {
      url: string;
      name: string;
    }[];
  };

  pricing: {
    raw: string | null;
    discontinued: boolean | null;
    average: number | null;
    range: {
      min: number | null;
      max: number | null;
    };
    currency: string | null;
    category: string | null; // budget, mid, high
  };

  pros: string[];
  cons: string[];

  vendorLinks: {
    url: string;
    name: string;
  }[];
  hackingGuides: {
    url: string;
    name: string;
  }[];
  notes: string[];
}
