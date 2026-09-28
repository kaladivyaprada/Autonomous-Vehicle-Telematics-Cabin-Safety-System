export interface CityCoordinates {
  name: string;
  regionTag: string;
  state: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface LiveWeatherData {
  temperature: number; // °C
  apparentTemperature: number; // °C
  relativeHumidity: number; // %
  surfacePressure: number; // hPa
  windSpeed: number; // km/h
  windGusts: number; // km/h
  precipitation: number; // mm
  weatherCode: number;
  weatherDescription: string;
  visibility: number; // meters
  frictionCoefficient: number; // mu (0.1 to 0.95)
  roadCondition: string;
  airDensity: number; // kg/m^3
  aerodynamicDragForce: number; // Newtons at current speed
  fetchedAt: Date;
}

export interface VehicleParameters {
  speedKmh: number; // 0 to 180 km/h
  payloadKg: number; // 0 to 600 kg
  batteryCapacityKwh: number; // e.g. 78 kWh
  currentSoC: number; // % (0 to 100)
  cabinTargetTemp: number; // °C
  driveMode: 'ECO' | 'AUTONOMOUS' | 'PERFORMANCE';
  steeringAngleDeg: number;
  isCyberAttackActive: boolean;
}

export interface CnnDetection {
  label: string;
  probability: number;
  distanceMeters: number;
  boundingBox: { x: number; y: number; width: number; height: number };
  color: string;
}

export interface TrajectoryPoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface AutoencoderMetrics {
  inputVector: number[];
  reconstructedVector: number[];
  latentVector: number[];
  mse: number;
  threshold: number;
  isAnomaly: boolean;
  tamperedFeatureIndices: number[];
}
