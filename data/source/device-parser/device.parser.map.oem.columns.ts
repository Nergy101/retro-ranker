import { RatingsService } from "../../frontend/services/devices/ratings.service.ts";
import { EmulationSystem } from "../../frontend/enums/emulation-system.ts";
import { Device } from "../../frontend/contracts/device.model.ts";
import {
  getPriceCurrency,
  getPricingCategory,
  parseOsIcons,
  parsePriceRange,
  unknownOrValue,
} from "./device.parser.helpers.ts";
import { slugify } from "https://deno.land/x/slugify@0.3.0/mod.ts";
slugify.extend({
  "?": "-question-mark-",
  '"': "-double-quote-",
  " ": "-",
});

export function mapOEMsColumnToDevice(
  colIndex: number,
  rawValue: string,
  device: Device,
): void {
  const value = rawValue.toLowerCase().trim();

  // Initialize required objects if they don't exist
  device.outputs = device.outputs || {
    videoOutput: null,
    audioOutput: null,
    speaker: null,
  };

  switch (colIndex) {
    case 0: {
      break;
    }
    case 1: {
      const sanitizedName = slugify(value);
      device.id = sanitizedName;

      device.image = {
        ...device.image,
        webpUrl: "/devices/" + sanitizedName + ".webp",
        pngUrl: "/devices/" + sanitizedName + ".png",
        alt: value,
      };
      device.name = {
        raw: unknownOrValue(rawValue),
        sanitized: unknownOrValue(sanitizedName),
        normalized: unknownOrValue(rawValue.split("(")[0].trim()),
      };
      break;
    }
    case 3:
      device.brand = {
        raw: unknownOrValue(rawValue),
        sanitized: unknownOrValue(slugify(rawValue)),
        normalized: unknownOrValue(rawValue.split("(")[0].trim()),
      };
      break;
    case 4:
      {
        // given the date format is <year> / <month>
        // we need to convert it to a date
        const regex = /^(\d{4})\s*\/\s*(\d{1,2})$/;
        const mentionedDate = value.match(regex)?.[0];

        device.released = {
          raw: unknownOrValue(rawValue),
          mentionedDate: mentionedDate
            ? new Date(Date.UTC(
              parseInt(mentionedDate.split("/")[0]),
              parseInt(mentionedDate.split("/")[1]) - 1,
              1,
            ))
            : null,
        };
      }
      break;
    case 5:
      device.formFactor = value;
      break;
    case 6:
      device.os = {
        raw: rawValue,
        icons: parseOsIcons(value),
        list: rawValue.split(/, | \/ /),
        customFirmwares: [],
      };
      break;
    case 7: // custom firmware
      device.os.customFirmwares = value.split(", ");
      break;
    case 8: // performance
      device.performance = RatingsService.parsePerformanceRating(value);
      break;
    // System ratings mapping
    case 9:
      device.systemRatings?.push({
        system: EmulationSystem.GameBoy,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 10:
      device.systemRatings?.push({
        system: EmulationSystem.NES,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 11:
      device.systemRatings?.push({
        system: EmulationSystem.Genesis,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 12:
      device.systemRatings?.push({
        system: EmulationSystem.GameBoyAdvance,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 13:
      device.systemRatings?.push({
        system: EmulationSystem.SNES,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 14:
      device.systemRatings?.push({
        system: EmulationSystem.PS1,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 15:
      device.systemRatings?.push({
        system: EmulationSystem.NintendoDS,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 16:
      device.systemRatings?.push({
        system: EmulationSystem.Nintendo64,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 17:
      device.systemRatings?.push({
        system: EmulationSystem.Dreamcast,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 18:
      device.systemRatings?.push({
        system: EmulationSystem.PSP,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 19:
      device.systemRatings?.push({
        system: EmulationSystem.Saturn,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 20:
      device.systemRatings?.push({
        system: EmulationSystem.GameCube,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 21:
      device.systemRatings?.push({
        system: EmulationSystem.Wii,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 22:
      device.systemRatings?.push({
        system: EmulationSystem.Nintendo3DS,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 23:
      device.systemRatings?.push({
        system: EmulationSystem.PS2,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 24:
      device.systemRatings?.push({
        system: EmulationSystem.WiiU,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 25:
      device.systemRatings?.push({
        system: EmulationSystem.Switch,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 26:
      device.systemOnChip = rawValue;
      break;
    case 27:
      device.cpus = [{
        raw: rawValue,
        names: rawValue.split(", "),
        cores: null,
        threads: null,
        clockSpeed: null,
      }];
      break;
    case 28:
      if (device.cpus?.[0]) {
        device.cpus[0].cores = parseInt(value) || null;
      }
      break;
    case 29:
      if (device.cpus?.[0]) {
        const clockSpeedRegex = /(\d+(?:\.\d+)?)\s*(MHz|GHz)/i;
        const match = value.match(clockSpeedRegex);
        if (match) {
          device.cpus[0].clockSpeed = {
            min: parseFloat(match[1]),
            max: parseFloat(match[1]),
            unit: match[2].toUpperCase() as "MHz" | "GHz",
          };
        }
      }
      break;
    case 30:
      {
        const arch = value;
        device.architecture = arch.includes("arm")
          ? "ARM"
          : arch.includes("x86-64") || arch.includes("x86_64")
          ? "x86-64"
          : arch.includes("mips")
          ? "MIPS"
          : arch
          ? "other"
          : null;
      }
      break;
    case 31:
      device.gpus = [{
        name: rawValue,
        cores: null,
        clockSpeed: null,
      }];
      break;
    case 32:
      if (device.gpus?.[0]) {
        const clockSpeedRegex = /(\d+(?:\.\d+)?)\s*(MHz|GHz)/i;
        const match = value.match(clockSpeedRegex);
        if (match) {
          device.gpus[0].clockSpeed = {
            min: parseFloat(match[1]),
            max: parseFloat(match[1]),
            unit: match[2].toUpperCase() as "MHz" | "GHz",
          };
        }
      }
      break;
    case 33:
      {
        const ramRegex = /(\d+(?:\.\d+)?)\s*(GB|MB|KB)/i;
        const ramMatch = value.match(ramRegex);
        device.ram = {
          raw: rawValue,
          sizes: ramMatch ? [parseFloat(ramMatch[1])] : null,
          unit: ramMatch
            ? ramMatch[2].toUpperCase() as "GB" | "MB" | "KB"
            : null,
          type: value.includes("lpddr5x")
            ? "LPDDR5X"
            : value.includes("lpddr4x")
            ? "LPDDR4X"
            : value.includes("lpddr4")
            ? "LPDDR4"
            : value.includes("ddr5")
            ? "DDR5"
            : value.includes("ddr4")
            ? "DDR4"
            : value.includes("ddr3")
            ? "DDR3"
            : value.includes("ddr2")
            ? "DDR2"
            : value.includes("ddr")
            ? "DDR"
            : value
            ? "other"
            : null,
        };
      }
      break;
    case 34:
      {
        const screenSizeRegex = /(\d+(?:\.\d+)?)/;
        const screenMatch = value.match(screenSizeRegex);
        device.screen.size = screenMatch ? parseFloat(screenMatch[1]) : null;
      }
      break;
    case 35:
      {
        const screenType = value;
        device.screen.type = {
          raw: rawValue,
          isTouchscreen: screenType.includes("touch"),
          isPenCapable: screenType.includes("pen"),
          type: screenType.includes("ips")
            ? "IPS"
            : screenType.includes("ads")
            ? "ADS"
            : screenType.includes("hips")
            ? "HIPS"
            : screenType.includes("oled")
            ? "OLED"
            : screenType.includes("monochrome") &&
                screenType.includes("oled")
            ? "MonochromeOLED"
            : screenType.includes("lcd")
            ? "LCD"
            : screenType.includes("ltps")
            ? "LTPS"
            : screenType.includes("tft")
            ? "TFT"
            : screenType.includes("amoled")
            ? "AMOLED"
            : null,
        };
      }
      break;
    case 36:
      device.screen.resolution = value.split(",").map((res) => ({
        raw: res,
        width: parseInt(res.split(" x ")[0]),
        height: parseInt(res.split(" x ")[1]),
      }));
      break;
    case 37:
      device.screen.aspectRatio = value;
      break;
    case 38:
      device.screen.lens = value;
      break;
    case 39:
      {
        const batteryRegex = /(\d+(?:\.\d+)?)\s*(mAh|Wh)/i;
        const batteryMatch = value.match(batteryRegex);
        device.battery = {
          raw: rawValue,
          capacity: batteryMatch ? parseFloat(batteryMatch[1]) : null,
          unit: batteryMatch ? batteryMatch[2] as "mAh" | "Wh" : null,
        };
      }
      break;
    case 40:
      {
        const cooling = value;
        device.cooling = {
          raw: rawValue,
          hasHeatsink: cooling.includes("heatsink") ||
            cooling.includes("heat sink"),
          hasFan: cooling.includes("fan"),
          hasHeatPipe: cooling.includes("heatpipe") ||
            cooling.includes("heat pipe"),
          hasVentilationCutouts: cooling.includes("ventilation") ||
            cooling.includes("cutouts"),
        };
      }
      break;
    case 41:
      {
        const dPadType = value;
        device.controls.dPad = {
          raw: rawValue,
          type: dPadType.includes("separated") && dPadType.includes("cross")
            ? "separated-cross"
            : dPadType.includes("separated")
            ? "separated-buttons"
            : dPadType.includes("cross")
            ? "cross"
            : dPadType.includes("disc")
            ? "disc"
            : "d-pad",
        };
      }
      break;
    case 42:
      {
        const analogsText = value;
        device.controls.analogs = {
          raw: rawValue,
          dual: analogsText.includes("dual") || analogsText.includes("2x"),
          single: analogsText.includes("single") || analogsText.includes("1x"),
          L3: analogsText.includes("l3"),
          R3: analogsText.includes("r3"),
          isHallSensor: analogsText.includes("hall"),
          isThumbstick: analogsText.includes("thumbstick"),
          isSlidepad: analogsText.includes("slide"),
        };
      }
      break;
    case 43:
      {
        const regexNumberOfFaceButtons = /(\d+)/;
        const numberOfFaceButtons = value.match(regexNumberOfFaceButtons)?.[0];
        device.controls.numberOfFaceButtons = numberOfFaceButtons
          ? parseInt(numberOfFaceButtons)
          : null;
      }
      break;
    case 44:
      {
        const shoulderText = value;
        device.controls.shoulderButtons = {
          raw: rawValue,
          L: shoulderText.includes("l"),
          L1: shoulderText.includes("l1"),
          L2: shoulderText.includes("l2"),
          L3: shoulderText.includes("l3"),
          R: shoulderText.includes("r"),
          R1: shoulderText.includes("r1"),
          R2: shoulderText.includes("r2"),
          R3: shoulderText.includes("r3"),
          M1: shoulderText.includes("m1"),
          M2: shoulderText.includes("m2"),
          LC: shoulderText.includes("lc"),
          RC: shoulderText.includes("rc"),
          ZL: shoulderText.includes("zl"),
          ZRVertical: shoulderText.includes("zrvertical"),
          ZRHorizontal: shoulderText.includes("zrhorizontal"),
        };
      }
      break;
    case 45:
      {
        const extraText = value;
        device.controls.extraButtons = {
          raw: rawValue,
          power: extraText.includes("power"),
          reset: extraText.includes("reset"),
          home: extraText.includes("home"),
          volumeUp: extraText.includes("volume up"),
          volumeDown: extraText.includes("volume down"),
          function: extraText.includes("fn") || extraText.includes("function"),
          turbo: extraText.includes("turbo"),
          touchpad: extraText.includes("touchpad"),
          fingerprint: extraText.includes("fingerprint"),
          mute: extraText.includes("mute"),
          screenshot: extraText.includes("screenshot"),
          programmableButtons: extraText.includes("programmable"),
        };
      }
      break;
    case 46:
      {
        const chargePortText = value;
        const numberOfPorts = value.match(/\d+/)?.[0];
        device.chargePort = {
          raw: rawValue,
          type: chargePortText.includes("usb-c")
            ? "USB-C"
            : chargePortText.includes("usb a")
            ? "USB-A"
            : chargePortText.includes("usb b")
            ? "USB-B"
            : chargePortText.includes("micro")
            ? "Micro-USB"
            : chargePortText.includes("mini")
            ? "Mini-USB"
            : chargePortText.includes("dc")
            ? "DC-Power"
            : chargePortText.includes("wireless")
            ? "Wireless"
            : null,
          numberOfPorts: numberOfPorts ? parseInt(numberOfPorts) : null,
        };
      }
      break;
    case 47:
      device.storage = value;
      break;
    case 48:
      {
        const sensorText = value;
        device.sensors = {
          raw: sensorText,
          hasMicrophone: sensorText.includes("microphone"),
          hasAccelerometer: sensorText.includes("accelerometer"),
          hasGyroscope: sensorText.includes("gyroscope"),
          hasCompass: sensorText.includes("compass"),
          hasMagnetometer: sensorText.includes("magnetometer"),
          hasBarometer: sensorText.includes("barometer"),
          hasProximitySensor: sensorText.includes("proximity"),
          hasAmbientLightSensor: sensorText.includes("ambient") ||
            sensorText.includes("light"),
          hasFingerprintSensor: sensorText.includes("fingerprint"),
          hasCamera: sensorText.includes("camera"),
          hasGravitySensor: sensorText.includes("gravity"),
          hasPressureSensor: sensorText.includes("pressure"),
          hasTemperatureSensor: sensorText.includes("temperature"),
          hasHumiditySensor: sensorText.includes("humidity"),
          hasHeartRateSensor: sensorText.includes("heart"),
          hasAntenna: sensorText.includes("antenna"),
          screenClosure: sensorText.includes("closure"),
        };
      }
      break;
    case 49:
      {
        const connectivityText = value;
        device.connectivity = {
          hasWifi: connectivityText.includes("wifi") ||
            connectivityText.includes("wi-fi"),
          hasBluetooth: connectivityText.includes("bluetooth"),
          hasNfc: connectivityText.includes("nfc"),
          hasUsb: connectivityText.includes("usb"),
          hasUsbC: connectivityText.includes("usb-c") ||
            connectivityText.includes("usbc"),
        };
      }
      break;
    case 50:
      {
        const videoOutputText = value;
        device.outputs.videoOutput = {
          raw: rawValue,
          hasUsbC: videoOutputText.includes("usb-c") ||
            videoOutputText.includes("usbc"),
          hasMicroHdmi: videoOutputText.includes("micro-hdmi") ||
            videoOutputText.includes("micro hdmi"),
          hasMiniHdmi: videoOutputText.includes("mini-hdmi") ||
            videoOutputText.includes("mini hdmi"),
          hasHdmi: videoOutputText.includes("hdmi") ||
            videoOutputText.includes("hdmi2"),
          hasDvi: videoOutputText.includes("dvi"),
          hasVga: videoOutputText.includes("vga"),
          hasDisplayPort: videoOutputText.includes("displayport"),
          OcuLink: videoOutputText.includes("oculink"),
          AV: videoOutputText.includes("av"),
        };
      }
      break;
    case 51:
      {
        const audioOutputText = value;
        device.outputs.audioOutput = {
          raw: rawValue,
          has35mmJack: audioOutputText.includes("3.5") ||
            audioOutputText.includes("35mm"),
          hasHeadphoneJack: audioOutputText.includes("headphone"),
          hasUsbC: audioOutputText.includes("usb-c") ||
            audioOutputText.includes("usbc"),
        };
      }
      break;
    case 52:
      {
        const speakerText = value;
        device.outputs.speaker = {
          raw: rawValue,
          type: speakerText.includes("stereo")
            ? "stereo"
            : speakerText.includes("surround")
            ? "surround"
            : speakerText.includes("mono")
            ? "mono"
            : null,
        };
      }
      break;
    case 53:
      device.rumble = value === "yes" ||
        value.includes("true") || value === "✅";
      break;
    case 54:
      device.lowBatteryIndicator = value;
      break;
    case 55:
      {
        const volumeText = value;
        device.volumeControl = {
          raw: rawValue,
          type: volumeText.includes("wheel")
            ? "wheel"
            : volumeText.includes("slider")
            ? "slider"
            : volumeText.includes("menu")
            ? "menu"
            : volumeText.includes("combination")
            ? "button-combination"
            : volumeText.includes("button")
            ? "dedicated-button"
            : null,
        };
      }
      break;
    case 56:
      {
        const brightnessText = value;
        device.brightnessControl = {
          raw: rawValue,
          type: brightnessText.includes("wheel")
            ? "wheel"
            : brightnessText.includes("slider")
            ? "slider"
            : brightnessText.includes("menu")
            ? "menu"
            : brightnessText.includes("combination")
            ? "button-combination"
            : brightnessText.includes("button")
            ? "dedicated-button"
            : null,
        };
      }
      break;
    case 57:
      {
        const powerText = value;
        device.powerControl = {
          raw: rawValue,
          type: powerText.includes("switch")
            ? "switch"
            : powerText.includes("button")
            ? "button"
            : null,
        };
      }
      break;
    case 58:
      {
        const dimensions = value.split(" x ");
        device.dimensions = {
          length: dimensions[0] ? parseFloat(dimensions[0]) : null,
          width: dimensions[1] ? parseFloat(dimensions[1]) : null,
          height: dimensions[2] ? parseFloat(dimensions[2]) : null,
        };
      }
      break;
    case 59:
      {
        const weightMatch = value.match(/(\d+(?:\.\d+)?)/);
        device.weight = weightMatch ? parseFloat(weightMatch[1]) : null;
      }
      break;
    case 60:
      device.colors = rawValue.split(", ");
      break;
    case 67:
      {
        if (value.includes("discontinued")) {
          device.pricing = {
            ...device.pricing,
            raw: rawValue,
            discontinued: true,
          };
          break;
        }

        const priceRange = parsePriceRange(value);
        const averagePrice = (priceRange.min + priceRange.max) / 2;
        device.pricing = {
          ...device.pricing,
          average: averagePrice,
          category: getPricingCategory(averagePrice) as
            | "low"
            | "mid"
            | "high"
            | null,
          raw: rawValue,
          discontinued: false,
          range: {
            min: priceRange.min,
            max: priceRange.max,
          },
          currency: getPriceCurrency(value),
        };
      }
      break;
    case 73:
      device.pros = rawValue.split(", ").filter((pro) => pro.trim() !== "");
      break;
    case 74:
      device.cons = rawValue.split(", ").filter((con) => con.trim() !== "");
      break;
    case 75:
      device.performance.emulationLimit = rawValue;
      break;
    case 76:
      device.notes = rawValue.split(", ");
      break;
  }
}
