import React from 'react';
import { Thermometer, Wind, Eye, Gauge, Compass, Droplets } from 'lucide-react';
import { LiveWeatherData } from '../types/telematics';

interface LiveWeatherTelemetryBarProps {
  weather: LiveWeatherData | null;
  speedKmh: number;
}

export const LiveWeatherTelemetryBar: React.FC<LiveWeatherTelemetryBarProps> = ({
  weather,
  speedKmh,
}) => {
  if (!weather) {
    return (
      <div className="w-full bg-[#0b101c]/80 border-b border-cyan-500/20 px-4 py-3 text-center text-xs font-mono text-cyan-400">
        Connecting to Open-Meteo live public telematics stream...
      </div>
    );
  }

  const tempF = Math.round((weather.temperature * 9) / 5 + 32);

  // Determine friction color
  let frictionColor = 'text-emerald-400';
  let frictionBadge = 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300';
  if (weather.frictionCoefficient < 0.4) {
    frictionColor = 'text-red-400';
    frictionBadge = 'bg-red-950/70 border-red-500/40 text-red-300';
  } else if (weather.frictionCoefficient < 0.7) {
    frictionColor = 'text-amber-400';
    frictionBadge = 'bg-amber-950/70 border-amber-500/40 text-amber-300';
  }

  return (
    <div className="w-full bg-[#090e18]/90 border-b border-cyan-500/20 px-4 py-2.5 backdrop-blur-md">
      <div className="max-w-[1700px] mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        
        {/* Metric 1: Temperature */}
        <div className="bg-[#0e1626]/80 p-2.5 rounded-lg border border-cyan-500/20 flex items-center space-x-3">
          <div className="p-2 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            <Thermometer className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Ambient Temp</div>
            <div className="text-sm font-bold font-mono text-white flex items-baseline space-x-1">
              <span>{weather.temperature.toFixed(1)}°C</span>
              <span className="text-[10px] text-slate-400">({tempF}°F)</span>
            </div>
            <div className="text-[10px] text-cyan-400/80 font-mono truncate">{weather.weatherDescription}</div>
          </div>
        </div>

        {/* Metric 2: Road Surface Friction Coefficient (mu) */}
        <div className="bg-[#0e1626]/80 p-2.5 rounded-lg border border-cyan-500/20 flex items-center space-x-3">
          <div className="p-2 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Road Friction (μ)</div>
            <div className={`text-sm font-bold font-mono ${frictionColor} flex items-baseline space-x-1`}>
              <span>{weather.frictionCoefficient.toFixed(2)}</span>
              <span className="text-[10px] text-slate-400">/ 1.0</span>
            </div>
            <div className="text-[10px] text-slate-300 font-mono truncate">{weather.roadCondition}</div>
          </div>
        </div>

        {/* Metric 3: Aerodynamic Drag & Wind */}
        <div className="bg-[#0e1626]/80 p-2.5 rounded-lg border border-cyan-500/20 flex items-center space-x-3">
          <div className="p-2 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Wind & Aero Drag</div>
            <div className="text-sm font-bold font-mono text-white flex items-baseline space-x-1">
              <span>{weather.aerodynamicDragForce} N</span>
              <span className="text-[10px] text-slate-400">(@ {speedKmh} km/h)</span>
            </div>
            <div className="text-[10px] text-cyan-400 font-mono">Wind: {weather.windSpeed.toFixed(1)} km/h</div>
          </div>
        </div>

        {/* Metric 4: Visibility Range */}
        <div className="bg-[#0e1626]/80 p-2.5 rounded-lg border border-cyan-500/20 flex items-center space-x-3">
          <div className="p-2 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Optical Visibility</div>
            <div className="text-sm font-bold font-mono text-white flex items-baseline space-x-1">
              <span>{(weather.visibility / 1000).toFixed(1)} km</span>
              <span className="text-[10px] text-slate-400">({weather.visibility}m)</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">
              {weather.visibility >= 8000 ? 'Clear Optics' : weather.visibility >= 3000 ? 'Moderate Damping' : 'Heavy Attenuation'}
            </div>
          </div>
        </div>

        {/* Metric 5: Air Density & Barometer */}
        <div className="bg-[#0e1626]/80 p-2.5 rounded-lg border border-cyan-500/20 flex items-center space-x-3">
          <div className="p-2 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Atmospheric Density</div>
            <div className="text-sm font-bold font-mono text-white flex items-baseline space-x-1">
              <span>{weather.airDensity.toFixed(3)}</span>
              <span className="text-[10px] text-slate-400">kg/m³</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">{weather.surfacePressure.toFixed(0)} hPa</div>
          </div>
        </div>

        {/* Metric 6: Relative Humidity & Wetness */}
        <div className="bg-[#0e1626]/80 p-2.5 rounded-lg border border-cyan-500/20 flex items-center space-x-3">
          <div className="p-2 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Humidity / Precip</div>
            <div className="text-sm font-bold font-mono text-white flex items-baseline space-x-1">
              <span>{weather.relativeHumidity}%</span>
              <span className="text-[10px] text-slate-400">{weather.precipitation > 0 ? `${weather.precipitation}mm` : '0mm'}</span>
            </div>
            <div className="text-[10px] text-cyan-400 font-mono">
              {weather.precipitation > 0 ? 'Active Surface Rain' : 'Nominal Moisture'}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
