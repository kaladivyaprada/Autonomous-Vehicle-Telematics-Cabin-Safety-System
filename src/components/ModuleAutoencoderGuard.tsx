import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Chart, registerables } from 'chart.js';
import { ShieldCheck, ShieldAlert, Cpu, AlertTriangle, Activity } from 'lucide-react';
import { LiveWeatherData, VehicleParameters } from '../types/telematics';
import { runAutoencoderSecurityInference, AutoencoderResult } from '../dl_math/autoencoderModel';

Chart.register(...registerables);

interface ModuleAutoencoderGuardProps {
  weather: LiveWeatherData | null;
  vehicle: VehicleParameters;
  isStreaming: boolean;
  cnnConfidence: number;
}

export const ModuleAutoencoderGuard: React.FC<ModuleAutoencoderGuardProps> = ({
  weather,
  vehicle,
  isStreaming,
  cnnConfidence,
}) => {
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const [historyMse, setHistoryMse] = useState<number[]>(() => Array(25).fill(0.015));
  const [latestResult, setLatestResult] = useState<AutoencoderResult | null>(null);

  // Synthesize normalized 8-feature vector from multi-modal modules
  const rawVector = useMemo(() => {
    const vSpeed = Math.min(1, vehicle.speedKmh / 150);
    const vFriction = weather ? weather.frictionCoefficient : 0.85;
    const vSteer = (vehicle.steeringAngleDeg + 30) / 60;
    const vBattery = vehicle.currentSoC / 100;
    const vTemp = weather ? Math.min(1, Math.max(0, (weather.temperature + 10) / 50)) : 0.5;
    const vVision = Math.min(1, Math.max(0, cnnConfidence));
    const vDrag = weather ? Math.min(1, weather.aerodynamicDragForce / 600) : 0.4;
    const vYaw = Math.abs(vehicle.steeringAngleDeg) / 30;

    return [vSpeed, vFriction, vSteer, vBattery, vTemp, vVision, vDrag, vYaw];
  }, [weather, vehicle, cnnConfidence]);

  // Setup Chart.js scrolling line chart for MSE
  useEffect(() => {
    if (!chartCanvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartCanvasRef.current.getContext('2d');
    if (!ctx) return;

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array(25).fill(''),
        datasets: [
          {
            label: 'Reconstruction Error (MSE)',
            data: Array(25).fill(0.018),
            borderColor: '#00ff88',
            backgroundColor: 'rgba(0, 255, 136, 0.1)',
            fill: true,
            tension: 0.35,
            borderWidth: 2,
            pointRadius: 2,
            pointHoverRadius: 4,
          },
          {
            label: 'Safety Threshold (θ = 0.065)',
            data: Array(25).fill(0.065),
            borderColor: '#ff1e56',
            borderDash: [6, 4],
            borderWidth: 1.5,
            pointRadius: 0,
            fill: false,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 0 }, // fast real-time scroll
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#94a3b8',
              font: { family: 'JetBrains Mono', size: 9 },
              boxWidth: 10,
            }
          },
          tooltip: {
            backgroundColor: '#090e18',
            borderColor: '#00f0ff',
            borderWidth: 1,
            titleColor: '#00f0ff',
            bodyColor: '#e2e8f0',
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ${Number(ctx.raw).toFixed(4)}`
            }
          }
        },
        scales: {
          x: {
            display: false,
            grid: { display: false }
          },
          y: {
            min: 0,
            max: 0.25,
            grid: { color: 'rgba(0, 240, 255, 0.08)' },
            ticks: {
              color: '#94a3b8',
              font: { family: 'JetBrains Mono', size: 9 },
              callback: (val) => Number(val).toFixed(2)
            }
          }
        }
      }
    });

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, []);

  // Real-time Autoencoder inference interval
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isStreaming) {
      interval = setInterval(() => {
        // Run deep autoencoder calculation
        const result = runAutoencoderSecurityInference(rawVector, vehicle.isCyberAttackActive);
        setLatestResult(result);

        setHistoryMse((prev) => {
          const next = [...prev.slice(1), result.mse];

          // Update Chart.js dataset
          if (chartInstanceRef.current) {
            const chart = chartInstanceRef.current;
            chart.data.datasets[0].data = next;

            // Change chart line color if breached
            if (result.isAnomaly) {
              chart.data.datasets[0].borderColor = '#ff1e56';
              chart.data.datasets[0].backgroundColor = 'rgba(255, 30, 86, 0.25)';
            } else {
              chart.data.datasets[0].borderColor = '#00ff88';
              chart.data.datasets[0].backgroundColor = 'rgba(0, 255, 136, 0.1)';
            }

            chart.update('none');
          }

          return next;
        });
      }, 250);
    }

    return () => clearInterval(interval);
  }, [rawVector, vehicle.isCyberAttackActive, isStreaming]);

  const isAnomaly = latestResult?.isAnomaly ?? false;

  return (
    <div className={`cyber-card rounded-xl p-4 flex flex-col h-full transition-all duration-300 ${
      isAnomaly ? 'neon-border-red shadow-[0_0_35px_rgba(255,30,86,0.35)]' : ''
    }`}>
      {/* Module Title */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-cyan-500/20">
        <div className="flex items-center space-x-2">
          {isAnomaly ? (
            <ShieldAlert className="w-5 h-5 text-red-500 animate-bounce" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          )}
          <div>
            <h2 className="text-sm font-bold tracking-wider font-display uppercase text-white">
              Module 4: Central Cyber-Security Intrusion Guard
            </h2>
            <div className="text-[10px] text-cyan-400 font-mono">Topic: Autoencoders (Anomaly Detection)</div>
          </div>
        </div>
        <span className={`px-2 py-0.5 text-[10px] font-mono rounded font-bold ${
          isAnomaly
            ? 'bg-red-950 text-red-400 border border-red-500 animate-pulse'
            : 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
        }`}>
          {isAnomaly ? 'INTRUSION DETECTED' : 'FIREWALL NOMINAL'}
        </span>
      </div>

      {/* Flashing Alert or Safe Status Box */}
      {isAnomaly ? (
        <div className="mb-3 bg-red-950/80 border-2 border-red-500 p-2.5 rounded-lg flex items-center space-x-3 animate-pulse shadow-[0_0_20px_rgba(255,30,86,0.5)]">
          <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 animate-spin" />
          <div>
            <div className="text-xs font-bold font-mono text-red-200 uppercase">
              CRITICAL SYSTEM INTRUSION DETECTED - INITIATING EMERGENCY SAFETY PULLEVER
            </div>
            <div className="text-[10px] text-red-300 font-mono">
              Autoencoder MSE: {latestResult?.mse.toFixed(4)} breached threshold θ = 0.065. CAN-Bus isolated.
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-3 bg-emerald-950/40 border border-emerald-500/30 p-2 rounded-lg flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>CAN-Bus Telematics Verification: 100% Validated</span>
          </div>
          <span className="text-[11px] text-slate-400">
            MSE: <span className="text-emerald-300 font-bold">{latestResult?.mse.toFixed(4) || '0.0162'}</span> &lt; 0.065
          </span>
        </div>
      )}

      {/* Autoencoder Architectural Diagram (8 -> 4 -> 2 -> 4 -> 8) */}
      <div className="bg-[#090d16]/90 border border-cyan-500/20 rounded-lg p-2.5 mb-3 flex flex-col">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 mb-2">
          <span>Encoder → Latent Space (Bottleneck) → Decoder</span>
          <span className="text-[9px] text-cyan-400">8D → 4D → 2D → 4D → 8D</span>
        </div>

        {/* Visual Architecture Representation */}
        <div className="grid grid-cols-5 items-center gap-2 text-center text-[10px] font-mono py-1">
          {/* Layer 1: Input Vector */}
          <div className="bg-black/60 p-2 rounded border border-cyan-500/30">
            <div className="text-cyan-400 font-bold mb-1">Inputs</div>
            <div className="text-[9px] text-slate-400">8 Features</div>
            <div className="h-1.5 w-full bg-cyan-900 rounded mt-1 overflow-hidden">
              <div className="h-full bg-cyan-400 w-full animate-pulse" />
            </div>
          </div>

          {/* Layer 2: Encoder */}
          <div className="bg-black/60 p-2 rounded border border-purple-500/30">
            <div className="text-purple-400 font-bold mb-1">Encoder</div>
            <div className="text-[9px] text-slate-400">4 Neurons</div>
            <div className="text-[8px] text-purple-300">W_enc1</div>
          </div>

          {/* Layer 3: Bottleneck Latent Space */}
          <div className="bg-cyan-950/60 p-2 rounded border-2 border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.3)]">
            <div className="text-cyan-300 font-bold mb-1">Bottleneck</div>
            <div className="text-[9px] text-cyan-200">z ∈ ℝ²</div>
            {latestResult && (
              <div className="text-[8px] text-emerald-400 font-bold">
                [{latestResult.latentSpace[0]}, {latestResult.latentSpace[1]}]
              </div>
            )}
          </div>

          {/* Layer 4: Decoder */}
          <div className="bg-black/60 p-2 rounded border border-purple-500/30">
            <div className="text-purple-400 font-bold mb-1">Decoder</div>
            <div className="text-[9px] text-slate-400">4 Neurons</div>
            <div className="text-[8px] text-purple-300">W_dec1</div>
          </div>

          {/* Layer 5: Reconstructed Vector */}
          <div className={`p-2 rounded border ${
            isAnomaly ? 'bg-red-950/60 border-red-500' : 'bg-black/60 border-emerald-500/30'
          }`}>
            <div className={`font-bold mb-1 ${isAnomaly ? 'text-red-400' : 'text-emerald-400'}`}>
              Outputs
            </div>
            <div className="text-[9px] text-slate-400">8 Targets</div>
            <div className={`text-[8px] ${isAnomaly ? 'text-red-300' : 'text-emerald-300'}`}>
              x̂ ≈ x
            </div>
          </div>
        </div>
      </div>

      {/* Live Scrolling Line Chart: Reconstruction Error (MSE) */}
      <div className="bg-[#090d16]/90 border border-cyan-500/20 rounded-lg p-2.5 flex flex-col flex-grow min-h-[140px]">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 mb-1">
          <span className="flex items-center space-x-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reconstruction Error: MSE = (1/N) Σ(xᵢ - x̂ᵢ)²</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            Current: <span className={isAnomaly ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
              {latestResult ? latestResult.mse.toFixed(4) : '0.0162'}
            </span>
          </span>
        </div>

        <div className="relative flex-grow min-h-[110px]">
          <canvas ref={chartCanvasRef} />
        </div>
      </div>

    </div>
  );
};
