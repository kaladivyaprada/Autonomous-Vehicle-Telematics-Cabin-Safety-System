import React, { useEffect, useRef, useState } from 'react';
import { Navigation, GitBranch, Cpu, Compass } from 'lucide-react';
import { LstmTrajectoryPredictor, TrajectoryInferenceResult } from '../dl_math/lstmTrajectoryModel';

interface ModuleLstmTrajectoryProps {
  speedKmh: number;
  isStreaming: boolean;
  onSteerUpdate?: (angle: number) => void;
}

export const ModuleLstmTrajectory: React.FC<ModuleLstmTrajectoryProps> = ({
  speedKmh,
  isStreaming,
  onSteerUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const predictorRef = useRef<LstmTrajectoryPredictor>(new LstmTrajectoryPredictor());

  const [steeringAngle, setSteeringAngle] = useState<number>(0); // -25° to +25°
  const [trajectoryData, setTrajectoryData] = useState<TrajectoryInferenceResult | null>(null);

  // Vehicle coordinate tracking
  const vehiclePosRef = useRef({ x: 0, y: 0, heading: 0, stepCount: 0 });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isStreaming) {
      interval = setInterval(() => {
        const v = vehiclePosRef.current;
        v.stepCount++;

        // Calculate delta ego-motion
        const speedMs = speedKmh / 3.6;
        const dt = 0.1; // 100ms
        const turnRateRad = (steeringAngle * Math.PI) / 180 * 0.4;

        v.heading += turnRateRad * dt;
        v.x += Math.sin(v.heading) * speedMs * dt;
        v.y += Math.cos(v.heading) * speedMs * dt;

        predictorRef.current.addCoordinate(v.x, v.y, Date.now());

        const inference = predictorRef.current.predictFutureTrajectory(speedKmh, steeringAngle, 16);
        setTrajectoryData(inference);
      }, 100);
    }

    return () => clearInterval(interval);
  }, [speedKmh, steeringAngle, isStreaming]);

  // Canvas radar render loop
  useEffect(() => {
    let animId: number;

    const drawRadar = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h * 0.72; // vehicle positioned near lower-center

      // Background
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, w, h);

      // Radar rings
      const radii = [40, 80, 120, 160, 200];
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
      ctx.lineWidth = 1;

      radii.forEach((r, idx) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        // Distance text
        ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText(`${(idx + 1) * 10}m`, cx + r + 3, cy - 3);
      });

      // Azimuth radial crosshairs
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, h);
      ctx.moveTo(0, cy);
      ctx.lineTo(w, cy);
      ctx.stroke();

      // Sweeping radar scanner line
      const sweepAngle = (Date.now() / 1200) % (Math.PI * 2);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(sweepAngle);
      const sweepGrad = ctx.createLinearGradient(0, 0, 180, 0);
      sweepGrad.addColorStop(0, 'rgba(0, 240, 255, 0.25)');
      sweepGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.fillStyle = sweepGrad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 190, 0, 0.35);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Current ego-vehicle heading transform
      const curX = vehiclePosRef.current.x;
      const curY = vehiclePosRef.current.y;
      const heading = vehiclePosRef.current.heading;

      // Draw Past 5 Seconds Historical Path (Relative to current position & heading)
      if (trajectoryData && trajectoryData.historicalPath.length > 1) {
        ctx.save();
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 8;
        ctx.beginPath();

        const history = trajectoryData.historicalPath;
        for (let i = 0; i < history.length; i++) {
          const pt = history[i];
          // Transform relative to vehicle center
          const dx = pt.x - curX;
          const dy = pt.y - curY;

          // Rotate to ego frame
          const rx = dx * Math.cos(-heading) - dy * Math.sin(-heading);
          const ry = dx * Math.sin(-heading) + dy * Math.cos(-heading);

          const scale = 5.2; // pixels per meter
          const px = cx + rx * scale;
          const py = cy - ry * scale;

          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.restore();
      }

      // Draw LSTM Predicted Future Path (Glowing Dotted Path)
      if (trajectoryData && trajectoryData.predictedWaypoints.length > 0) {
        ctx.save();
        const waypoints = trajectoryData.predictedWaypoints;

        // Draw confidence corridor
        ctx.fillStyle = 'rgba(0, 255, 136, 0.08)';
        ctx.beginPath();
        for (let i = 0; i < waypoints.length; i++) {
          const pt = waypoints[i];
          const dx = pt.x - curX;
          const dy = pt.y - curY;
          const rx = dx * Math.cos(-heading) - dy * Math.sin(-heading);
          const ry = dx * Math.sin(-heading) + dy * Math.cos(-heading);
          const scale = 5.2;
          const px = cx + rx * scale;
          const py = cy - ry * scale;
          const r = trajectoryData.confidenceRadius[i] * 3.5;

          ctx.arc(px, py, r, 0, Math.PI * 2);
        }
        ctx.fill();

        // Draw dotted glowing path
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([4, 6]);
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 12;

        ctx.beginPath();
        ctx.moveTo(cx, cy);

        for (let i = 0; i < waypoints.length; i++) {
          const pt = waypoints[i];
          const dx = pt.x - curX;
          const dy = pt.y - curY;
          const rx = dx * Math.cos(-heading) - dy * Math.sin(-heading);
          const ry = dx * Math.sin(-heading) + dy * Math.cos(-heading);

          const scale = 5.2;
          const px = cx + rx * scale;
          const py = cy - ry * scale;

          ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.shadowBlur = 0;

        // Draw waypoint nodes
        waypoints.forEach((pt, i) => {
          if (i % 3 === 0) {
            const dx = pt.x - curX;
            const dy = pt.y - curY;
            const rx = dx * Math.cos(-heading) - dy * Math.sin(-heading);
            const ry = dx * Math.sin(-heading) + dy * Math.cos(-heading);
            const scale = 5.2;
            const px = cx + rx * scale;
            const py = cy - ry * scale;

            ctx.fillStyle = '#00ff88';
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fill();

            // Label step
            ctx.fillStyle = 'rgba(0, 255, 136, 0.7)';
            ctx.font = '8px "JetBrains Mono", monospace';
            ctx.fillText(`+${((i + 1) * 0.2).toFixed(1)}s`, px + 5, py);
          }
        });

        ctx.restore();
      }

      // Draw Ego-Vehicle (Cyber Triangle at cx, cy)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 14;

      ctx.beginPath();
      ctx.moveTo(0, -14); // tip forward
      ctx.lineTo(9, 10);
      ctx.lineTo(0, 5);
      ctx.lineTo(-9, 10);
      ctx.closePath();
      ctx.fill();

      // Heading beam
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(0, -45);
      ctx.stroke();

      ctx.restore();

      animId = requestAnimationFrame(drawRadar);
    };

    animId = requestAnimationFrame(drawRadar);
    return () => cancelAnimationFrame(animId);
  }, [trajectoryData]);

  const handleSteerChange = (val: number) => {
    setSteeringAngle(val);
    if (onSteerUpdate) onSteerUpdate(val);
  };

  return (
    <div className="cyber-card rounded-xl p-4 flex flex-col h-full">
      {/* Module Title */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-cyan-500/20">
        <div className="flex items-center space-x-2">
          <Navigation className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="text-sm font-bold tracking-wider font-display uppercase text-white">
              Module 2: Trajectory & Navigation Predictor
            </h2>
            <div className="text-[10px] text-cyan-400 font-mono">Topic: Recurrent Neural Networks (RNNs / LSTMs)</div>
          </div>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 rounded">
          Recurrent Cell Rollout
        </span>
      </div>

      {/* 2D Canvas Radar Grid */}
      <div className="relative w-full aspect-[4/3] bg-black rounded-lg overflow-hidden border border-cyan-500/30 mb-3 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="w-full h-full object-cover"
        />

        {/* Legend overlays */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1 bg-black/75 p-2 rounded border border-cyan-500/20 text-[10px] font-mono">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-0.5 bg-cyan-400" />
            <span className="text-slate-300">Historical [X,Y] (Past 5s)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-emerald-400" />
            <span className="text-emerald-300">LSTM Projected (+3.2s)</span>
          </div>
        </div>

        {/* Steering Quick Selectors */}
        <div className="absolute bottom-2 right-2 flex items-center space-x-1 bg-black/80 p-1 rounded border border-cyan-500/30">
          <button
            onClick={() => handleSteerChange(-15)}
            className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer ${steeringAngle === -15 ? 'bg-cyan-500 text-black font-bold' : 'text-slate-300'}`}
          >
            ← Left Lane
          </button>
          <button
            onClick={() => handleSteerChange(0)}
            className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer ${steeringAngle === 0 ? 'bg-cyan-500 text-black font-bold' : 'text-slate-300'}`}
          >
            Center
          </button>
          <button
            onClick={() => handleSteerChange(15)}
            className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer ${steeringAngle === 15 ? 'bg-cyan-500 text-black font-bold' : 'text-slate-300'}`}
          >
            Right Lane →
          </button>
        </div>
      </div>

      {/* LSTM Internal Gate Diagnostics & Steering Control */}
      <div className="bg-[#090d16]/90 border border-cyan-500/20 rounded-lg p-3 flex flex-col space-y-2 flex-grow">
        
        {/* Steering Slider */}
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 flex items-center space-x-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Steering Angle (Yaw Ingress):</span>
          </span>
          <span className="text-cyan-400 font-bold">{steeringAngle}°</span>
        </div>
        <input
          type="range"
          min="-30"
          max="30"
          value={steeringAngle}
          onChange={(e) => handleSteerChange(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />

        {/* LSTM Diagnostics Readouts */}
        {trajectoryData && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-cyan-500/20 text-[10px] font-mono">
            <div className="bg-slate-900/80 p-1.5 rounded border border-cyan-500/20">
              <div className="text-slate-400">Forget Gate (ft)</div>
              <div className="text-cyan-300 font-bold">{trajectoryData.diagnostics.forgetGateMean}</div>
              <div className="text-[8px] text-emerald-400">Memory Retained</div>
            </div>

            <div className="bg-slate-900/80 p-1.5 rounded border border-cyan-500/20">
              <div className="text-slate-400">Input Gate (it)</div>
              <div className="text-cyan-300 font-bold">{trajectoryData.diagnostics.inputGateMean}</div>
              <div className="text-[8px] text-slate-400">Candidate Update</div>
            </div>

            <div className="bg-slate-900/80 p-1.5 rounded border border-cyan-500/20">
              <div className="text-slate-400">Cell Norm ||ct||</div>
              <div className="text-cyan-300 font-bold">{trajectoryData.diagnostics.cellStateNorm}</div>
              <div className="text-[8px] text-emerald-400">Gradient Maintained</div>
            </div>

            <div className="bg-slate-900/80 p-1.5 rounded border border-cyan-500/20">
              <div className="text-slate-400">Hidden Norm ||ht||</div>
              <div className="text-cyan-300 font-bold">{trajectoryData.diagnostics.hiddenStateNorm}</div>
              <div className="text-[8px] text-cyan-400">Autoregressive Out</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
