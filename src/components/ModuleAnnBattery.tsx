import React, { useMemo } from 'react';
import { BatteryCharging, Cpu, Zap, Activity } from 'lucide-react';
import { LiveWeatherData, VehicleParameters } from '../types/telematics';
import { runDeepAnnBatteryInference, AnnLayerActivations } from '../dl_math/annBatteryModel';

interface ModuleAnnBatteryProps {
  weather: LiveWeatherData | null;
  vehicle: VehicleParameters;
  isStreaming: boolean;
}

export const ModuleAnnBattery: React.FC<ModuleAnnBatteryProps> = ({
  weather,
  vehicle,
  isStreaming,
}) => {
  // Run real feedforward MLP inference
  const annResults: AnnLayerActivations = useMemo(() => {
    const temp = weather ? weather.temperature : 20;
    const humidity = weather ? weather.relativeHumidity : 50;
    const wind = weather ? weather.windSpeed : 10;
    const friction = weather ? weather.frictionCoefficient : 0.85;

    return runDeepAnnBatteryInference(
      temp,
      humidity,
      wind,
      friction,
      vehicle.speedKmh,
      vehicle.payloadKg,
      vehicle.currentSoC,
      vehicle.batteryCapacityKwh
    );
  }, [weather, vehicle]);

  const { inputLayer, hiddenLayer1, hiddenLayer2, outputLayer } = annResults;

  return (
    <div className="cyber-card rounded-xl p-4 flex flex-col h-full">
      {/* Module Title */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-cyan-500/20">
        <div className="flex items-center space-x-2">
          <BatteryCharging className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="text-sm font-bold tracking-wider font-display uppercase text-white">
              Module 3: Battery & Performance Optimizer
            </h2>
            <div className="text-[10px] text-cyan-400 font-mono">Topic: Deep Artificial Neural Networks (ANNs / MLP)</div>
          </div>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 rounded">
          ReLU Feedforward
        </span>
      </div>

      {/* Main Tabular Input Vector Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 mb-3 bg-[#090d16]/90 p-2 rounded-lg border border-cyan-500/20 text-[10px] font-mono">
        <div className="bg-black/50 p-1.5 rounded border border-cyan-500/10">
          <div className="text-slate-400">Temp T</div>
          <div className="text-cyan-300 font-bold">{weather ? `${weather.temperature.toFixed(0)}°C` : '20°C'}</div>
        </div>
        <div className="bg-black/50 p-1.5 rounded border border-cyan-500/10">
          <div className="text-slate-400">Humidity</div>
          <div className="text-cyan-300 font-bold">{weather ? `${weather.relativeHumidity}%` : '50%'}</div>
        </div>
        <div className="bg-black/50 p-1.5 rounded border border-cyan-500/10">
          <div className="text-slate-400">Wind</div>
          <div className="text-cyan-300 font-bold">{weather ? `${weather.windSpeed.toFixed(0)}km/h` : '12km/h'}</div>
        </div>
        <div className="bg-black/50 p-1.5 rounded border border-cyan-500/10">
          <div className="text-slate-400">Friction μ</div>
          <div className="text-cyan-300 font-bold">{weather ? weather.frictionCoefficient.toFixed(2) : '0.88'}</div>
        </div>
        <div className="bg-black/50 p-1.5 rounded border border-cyan-500/10">
          <div className="text-slate-400">Speed v</div>
          <div className="text-cyan-300 font-bold">{vehicle.speedKmh} km/h</div>
        </div>
        <div className="bg-black/50 p-1.5 rounded border border-cyan-500/10">
          <div className="text-slate-400">Payload</div>
          <div className="text-cyan-300 font-bold">{vehicle.payloadKg} kg</div>
        </div>
        <div className="bg-black/50 p-1.5 rounded border border-cyan-500/10">
          <div className="text-slate-400">SoC %</div>
          <div className="text-emerald-400 font-bold">{vehicle.currentSoC}%</div>
        </div>
      </div>

      {/* Structural MLP Neural Architecture Diagram (SVG with pulsing synapses) */}
      <div className="relative w-full aspect-[21/9] min-h-[140px] bg-black/60 rounded-lg overflow-hidden border border-cyan-500/30 p-2 mb-3 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 540 160">
          <defs>
            <linearGradient id="synapseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#00ff88" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ff007f" stopOpacity="0.5" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Connect Layer 1 (7 nodes) to Layer 2 (6 nodes) */}
          {inputLayer.map((_, i) => {
            const y1 = 15 + i * 20;
            return hiddenLayer1.map((_, j) => {
              const y2 = 25 + j * 22;
              return (
                <line
                  key={`l1-${i}-${j}`}
                  x1="60"
                  y1={y1}
                  x2="200"
                  y2={y2}
                  stroke="rgba(0, 240, 255, 0.15)"
                  strokeWidth="1"
                  className={isStreaming ? 'animate-pulse' : ''}
                />
              );
            });
          })}

          {/* Connect Layer 2 (6 nodes) to Layer 3 (4 nodes) */}
          {hiddenLayer1.map((_, j) => {
            const y1 = 25 + j * 22;
            return hiddenLayer2.map((_, k) => {
              const y2 = 42 + k * 26;
              return (
                <line
                  key={`l2-${j}-${k}`}
                  x1="200"
                  y1={y1}
                  x2="350"
                  y2={y2}
                  stroke="rgba(0, 255, 136, 0.2)"
                  strokeWidth="1.2"
                />
              );
            });
          })}

          {/* Connect Layer 3 (4 nodes) to Output (2 nodes) */}
          {hiddenLayer2.map((_, k) => {
            const y1 = 42 + k * 26;
            return [0, 1].map((outIdx) => {
              const y2 = 55 + outIdx * 45;
              return (
                <line
                  key={`l3-${k}-${outIdx}`}
                  x1="350"
                  y1={y1}
                  x2="475"
                  y2={y2}
                  stroke="rgba(255, 0, 127, 0.25)"
                  strokeWidth="1.5"
                />
              );
            });
          })}

          {/* Render Input Nodes (x = 60) */}
          {inputLayer.map((val, i) => {
            const y = 15 + i * 20;
            return (
              <g key={`in-${i}`}>
                <circle
                  cx="60"
                  cy={y}
                  r="6"
                  fill="#00f0ff"
                  opacity={0.7 + Math.abs(val) * 0.3}
                  filter="url(#glow)"
                />
                <text x="44" y={y + 3} fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono" textAnchor="end">
                  x{i + 1}
                </text>
              </g>
            );
          })}

          {/* Render Hidden 1 Nodes (x = 200, ReLU) */}
          {hiddenLayer1.map((val, j) => {
            const y = 25 + j * 22;
            return (
              <g key={`h1-${j}`}>
                <circle
                  cx="200"
                  cy={y}
                  r="7"
                  fill="#00ff88"
                  opacity={Math.max(0.3, Math.min(1, val))}
                  filter="url(#glow)"
                />
              </g>
            );
          })}

          {/* Render Hidden 2 Nodes (x = 350, ReLU) */}
          {hiddenLayer2.map((val, k) => {
            const y = 42 + k * 26;
            return (
              <g key={`h2-${k}`}>
                <circle
                  cx="350"
                  cy={y}
                  r="7.5"
                  fill="#ffaa00"
                  opacity={Math.max(0.4, Math.min(1, val))}
                  filter="url(#glow)"
                />
              </g>
            );
          })}

          {/* Render Output Nodes (x = 475) */}
          <g>
            <circle cx="475" cy="55" r="9" fill="#00f0ff" filter="url(#glow)" />
            <text x="492" y="58" fill="#00f0ff" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
              Range (km)
            </text>
            <circle cx="475" cy="100" r="9" fill="#ff007f" filter="url(#glow)" />
            <text x="492" y="103" fill="#ff007f" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
              Wh/km
            </text>
          </g>

          {/* Layer Headers */}
          <text x="60" y="152" fill="#64748b" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">
            Inputs (7)
          </text>
          <text x="200" y="152" fill="#64748b" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">
            H1: ReLU (6)
          </text>
          <text x="350" y="152" fill="#64748b" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">
            H2: ReLU (4)
          </text>
          <text x="475" y="152" fill="#64748b" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">
            Outputs (2)
          </text>
        </svg>
      </div>

      {/* Output Predictions Display */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#090d16]/90 p-3 rounded-lg border border-cyan-500/20 flex-grow">
        
        {/* Metric 1: Remaining Range */}
        <div className="flex items-center space-x-3 bg-black/40 p-2.5 rounded border border-cyan-500/20">
          <div className="p-2 rounded bg-cyan-950/80 border border-cyan-400/40 text-cyan-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-mono uppercase">Predicted Range</div>
            <div className="text-xl font-bold font-mono text-cyan-300 neon-glow-text-cyan flex items-baseline space-x-1">
              <span>{outputLayer.predictedRangeKm}</span>
              <span className="text-xs text-cyan-400/80">km</span>
            </div>
            <div className="text-[9px] text-slate-400 font-mono">Battery: 78 kWh Pack</div>
          </div>
        </div>

        {/* Metric 2: Energy Consumption Rate */}
        <div className="flex items-center space-x-3 bg-black/40 p-2.5 rounded border border-cyan-500/20">
          <div className="p-2 rounded bg-emerald-950/80 border border-emerald-400/40 text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-mono uppercase">Consumption Rate</div>
            <div className="text-xl font-bold font-mono text-emerald-300 flex items-baseline space-x-1">
              <span>{outputLayer.consumptionWhPerKm}</span>
              <span className="text-xs text-emerald-400/80">Wh/km</span>
            </div>
            <div className="text-[9px] text-slate-400 font-mono">Real Dynamic Wh/km</div>
          </div>
        </div>

        {/* Metric 3: Real-Time Powertrain Efficiency */}
        <div className="flex items-center space-x-3 bg-black/40 p-2.5 rounded border border-cyan-500/20">
          <div className="p-2 rounded bg-purple-950/80 border border-purple-400/40 text-purple-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-mono uppercase">Powertrain Index</div>
            <div className="text-base font-bold font-mono text-purple-300">
              {outputLayer.efficiencyRating}
            </div>
            <div className="text-[9px] text-slate-400 font-mono">ANN Ingestion: 100% OK</div>
          </div>
        </div>

      </div>
    </div>
  );
};
