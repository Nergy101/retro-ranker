export interface DeviceSensors {
  hasGyroscope: boolean;
  hasAccelerometer: boolean;
  hasMicrophone: boolean;
  hasCamera: boolean;
  hasFingerprintSensor: boolean;
  hasCompass: boolean;
  hasMagnetometer: boolean;
  hasBarometer: boolean;
  hasProximitySensor: boolean;
  hasAmbientLightSensor: boolean;
  hasGravitySensor: boolean;
  hasPressureSensor: boolean;
  hasTemperatureSensor: boolean;
  hasHumiditySensor: boolean;
  hasHeartRateSensor: boolean;
  hasAntenna: boolean;
  screenClosure: boolean;
  raw: string;
}
