import { CityCoordinates, LiveWeatherData } from '../types/telematics';

export const KARNATAKA_CITIES: CityCoordinates[] = [
  {
    name: 'Bengaluru (Capital)',
    state: 'Karnataka, India',
    regionTag: 'Deccan Plateau Tech Corridor (Elev. 920m)',
    latitude: 12.9716,
    longitude: 77.5946,
    timezone: 'Asia/Kolkata',
  },
  {
    name: 'Mysuru',
    state: 'Karnataka, India',
    regionTag: 'Southern Heritage Corridor / Chamundi Foothills',
    latitude: 12.2958,
    longitude: 76.6394,
    timezone: 'Asia/Kolkata',
  },
  {
    name: 'Hubballi-Dharwad',
    state: 'Karnataka, India',
    regionTag: 'North Karnataka Industrial Hub / Malaprabha Basin',
    latitude: 15.3647,
    longitude: 75.1240,
    timezone: 'Asia/Kolkata',
  },
  {
    name: 'Mangaluru',
    state: 'Karnataka, India',
    regionTag: 'Arabian Sea Coastal / Heavy Monsoon Belt',
    latitude: 12.9141,
    longitude: 74.8560,
    timezone: 'Asia/Kolkata',
  },
  {
    name: 'Belagavi',
    state: 'Karnataka, India',
    regionTag: 'Western Ghats Borderland / Highland Mist & Rain',
    latitude: 15.8497,
    longitude: 74.4977,
    timezone: 'Asia/Kolkata',
  },
  {
    name: 'Kalaburagi',
    state: 'Karnataka, India',
    regionTag: 'Kalyana-Karnataka / High Tropical Thermal Belt',
    latitude: 17.3297,
    longitude: 76.8343,
    timezone: 'Asia/Kolkata',
  },
];

export function interpretWeatherCode(code: number, cityName?: string): { description: string; roadCondition: string; friction: number } {
  const isCoastalMonsoon = cityName?.includes('Mangaluru') || cityName?.includes('Belagavi');

  if (code === 0) {
    return {
      description: 'Clear Sky / Dry Tropical Sun',
      roadCondition: 'Dry Asphalt (High Grip)',
      friction: 0.88,
    };
  } else if (code <= 3) {
    return {
      description: 'Mainly Clear / Tropical Scatters',
      roadCondition: 'Dry Asphalt (Optimal Traction)',
      friction: 0.85,
    };
  } else if (code === 45 || code === 48) {
    return {
      description: 'Ghats Morning Fog / Highland Mist',
      roadCondition: 'Damp Asphalt / Moisture Slick',
      friction: 0.66,
    };
  } else if (code >= 51 && code <= 55) {
    return {
      description: 'Monsoon Drizzle / Intermittent Showers',
      roadCondition: 'Wet Tarmac / Surface Sheen',
      friction: 0.58,
    };
  } else if (code >= 61 && code <= 65) {
    return {
      description: isCoastalMonsoon ? 'Heavy Coastal Monsoon Downpour' : 'Southwest Monsoon Rainstorm',
      roadCondition: isCoastalMonsoon ? 'Severe Hydroplaning Risk / Standing Water' : 'Wet Road / Reduced Braking Grip',
      friction: isCoastalMonsoon ? 0.42 : 0.48,
    };
  } else if (code >= 71 && code <= 77) {
    return {
      description: 'Hail / Pre-Monsoon Squall Anomaly',
      roadCondition: 'Low Grip Hazardous Surface',
      friction: 0.35,
    };
  } else if (code >= 80 && code <= 82) {
    return {
      description: 'Tropical Convective Cloudburst',
      roadCondition: 'Rapid Water Ponding / Slippery',
      friction: 0.45,
    };
  } else if (code >= 85 && code <= 86) {
    return {
      description: 'Heavy Ghats Monsoon Storm',
      roadCondition: 'Torrential Runoff / Hydroplane Danger',
      friction: 0.38,
    };
  } else if (code >= 95) {
    return {
      description: 'Severe Pre-Monsoon Thunderstorm & Lightning',
      roadCondition: 'Torrential Flash Pooling / High Risk',
      friction: 0.32,
    };
  }
  return {
    description: 'Overcast Tropical Monsoonal Sky',
    roadCondition: 'Standard Sub-Tropical Surface',
    friction: 0.82,
  };
}

export async function fetchLiveCityWeather(city: CityCoordinates, speedKmh: number = 75): Promise<LiveWeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_gusts_10m&hourly=visibility&timezone=${encodeURIComponent(city.timezone)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Open-Meteo HTTP ${response.status}`);
    }

    const data = await response.json();
    const current = data.current || {};
    const hourly = data.hourly || {};

    const temp = typeof current.temperature_2m === 'number' ? current.temperature_2m : 26.5;
    const apparentTemp = typeof current.apparent_temperature === 'number' ? current.apparent_temperature : temp + 1.5;
    const humidity = typeof current.relative_humidity_2m === 'number' ? current.relative_humidity_2m : 68;
    const pressureHpa = typeof current.surface_pressure === 'number' ? current.surface_pressure : (city.name.includes('Bengaluru') ? 918 : 1008);
    const windSpeed = typeof current.wind_speed_10m === 'number' ? current.wind_speed_10m : 11.5;
    const windGusts = typeof current.wind_gusts_10m === 'number' ? current.wind_gusts_10m : windSpeed * 1.35;
    const precip = typeof current.precipitation === 'number' ? current.precipitation : 0;
    const weatherCode = typeof current.weather_code === 'number' ? current.weather_code : 1;

    // Visibility: take current hour or estimate from humidity/precip in Karnataka
    let visibility = 9500;
    if (hourly.visibility && Array.isArray(hourly.visibility) && hourly.visibility.length > 0) {
      visibility = hourly.visibility[0] || 9500;
    } else {
      if (weatherCode >= 45 && weatherCode <= 48) visibility = 900;
      else if (precip > 5) visibility = 2800;
      else if (humidity > 85) visibility = 5500;
    }

    const { description, roadCondition, friction } = interpretWeatherCode(weatherCode, city.name);

    // Air density calculation: rho = P / (R_spec * T_kelvin)
    const tKelvin = temp + 273.15;
    const pressurePa = pressureHpa * 100;
    const airDensity = Math.max(1.02, Math.min(1.35, Number((pressurePa / (287.05 * tKelvin)).toFixed(4))));

    // Drag: F_d = 0.5 * rho * Cd * A * v_relative^2
    const cd = 0.23;
    const frontalArea = 2.2;
    const vVehicleMs = speedKmh / 3.6;
    const vWindHeadMs = (windSpeed * 0.4) / 3.6;
    const vRelative = vVehicleMs + vWindHeadMs;
    const dragForce = Math.round(0.5 * airDensity * cd * frontalArea * Math.pow(vRelative, 2));

    return {
      temperature: temp,
      apparentTemperature: apparentTemp,
      relativeHumidity: humidity,
      surfacePressure: pressureHpa,
      windSpeed,
      windGusts,
      precipitation: precip,
      weatherCode,
      weatherDescription: description,
      visibility,
      frictionCoefficient: friction,
      roadCondition,
      airDensity,
      aerodynamicDragForce: dragForce,
      fetchedAt: new Date()
    };
  } catch (error) {
    console.warn('Karnataka live telematics stream fetch warning, using regional baseline:', error);
    const { description, roadCondition, friction } = interpretWeatherCode(1, city.name);
    return {
      temperature: 27.2,
      apparentTemperature: 28.5,
      relativeHumidity: 65,
      surfacePressure: city.name.includes('Bengaluru') ? 918.0 : 1008.0,
      windSpeed: 13.0,
      windGusts: 18.5,
      precipitation: 0.0,
      weatherCode: 1,
      weatherDescription: description,
      visibility: 9200,
      frictionCoefficient: friction,
      roadCondition,
      airDensity: 1.145,
      aerodynamicDragForce: 245,
      fetchedAt: new Date()
    };
  }
}

