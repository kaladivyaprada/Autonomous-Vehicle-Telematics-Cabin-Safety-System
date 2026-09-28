import React from 'react';
import { Play, Pause, Skull, ShieldCheck, Gauge, Zap, Car } from 'lucide-react';
import { VehicleParameters } from '../types/telematics';
import { cyberAudio } from '../utils/audioSynthesizer';

interface GlobalControlsProps {
  vehicle: VehicleParameters;
  onUpdateVehicle: (updater: (prev: VehicleParameters) => VehicleParameters) => void;
  isStreaming: boolean;
  onToggleStreaming: () => void;
  onInjectCyberAttack: () => void;
  onRestoreNormalcy: () => void;
}

export const GlobalControls: React.FC<GlobalControlsProps> = ({
  vehicle,
  onUpdateVehicle,
  isStreaming,
  onToggleStreaming,
  onInjectCyberAttack,
  onRestoreNormalcy,
}) => {
  return (
    <div className="w-full bg-[#0a0f1d]/90 border border-cyan-500/30 rounded-xl p-3 md:p-4 mb-4 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        {/* Play/Pause & Drive Mode */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onToggleStreaming}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all shadow-md cursor-pointer ${
              isStreaming
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/30'
            }`}
          >
            {isStreaming ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isStreaming ? 'PAUSE TELEMETRY' : 'START TELEMETRY'}</span>
          </button>

          {/* Drive Modes */}
          <div className="flex items-center bg-[#070b14] p-1 rounded-lg border border-cyan-500/30">
            {(['ECO', 'AUTONOMOUS', 'PERFORMANCE'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  onUpdateVehicle((v) => ({ ...v, driveMode: mode }));
                  cyberAudio.playTelemetryChirp();
                }}
                className={`px-3 py-1 text-xs font-mono rounded transition-all cursor-pointer ${
                  vehicle.driveMode === mode
                    ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                    : 'text-slate-400 hover:text-cyan-300'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders: Cruising Speed & Payload */}
        <div className="flex flex-wrap items-center gap-6">
          {/* Speed Slider */}
          <div className="flex items-center space-x-3">
            <Gauge className="w-4 h-4 text-cyan-400" />
            <div className="w-36 sm:w-44">
              <div className="flex justify-between text-[11px] font-mono text-slate-300 mb-1">
                <span>Cruising Speed</span>
                <span className="text-cyan-400 font-bold">{vehicle.speedKmh} km/h</span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                step="5"
                value={vehicle.speedKmh}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onUpdateVehicle((v) => ({ ...v, speedKmh: val }));
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>

          {/* Payload Slider */}
          <div className="flex items-center space-x-3">
            <Car className="w-4 h-4 text-cyan-400" />
            <div className="w-36 sm:w-44">
              <div className="flex justify-between text-[11px] font-mono text-slate-300 mb-1">
                <span>Load Weight</span>
                <span className="text-cyan-400 font-bold">{vehicle.payloadKg} kg</span>
              </div>
              <input
                type="range"
                min="0"
                max="600"
                step="25"
                value={vehicle.payloadKg}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onUpdateVehicle((v) => ({ ...v, payloadKg: val }));
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>

          {/* Battery State of Charge */}
          <div className="flex items-center space-x-3">
            <Zap className="w-4 h-4 text-emerald-400" />
            <div className="w-32 sm:w-36">
              <div className="flex justify-between text-[11px] font-mono text-slate-300 mb-1">
                <span>Battery SoC</span>
                <span className="text-emerald-400 font-bold">{vehicle.currentSoC}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={vehicle.currentSoC}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onUpdateVehicle((v) => ({ ...v, currentSoC: val }));
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>
          </div>
        </div>

        {/* Cyber Intrusion Injection / Restoral Controls */}
        <div className="flex items-center space-x-3">
          {!vehicle.isCyberAttackActive ? (
            <button
              onClick={() => {
                onInjectCyberAttack();
                cyberAudio.playAlarmSiren();
              }}
              className="group relative flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-mono text-xs font-bold tracking-wider shadow-[0_0_20px_rgba(255,0,50,0.6)] hover:shadow-[0_0_30px_rgba(255,0,50,0.9)] border border-red-400/80 transition-all cursor-pointer animate-pulse"
            >
              <Skull className="w-4 h-4 animate-bounce text-amber-300" />
              <span>INJECT CYBER ATTACK</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onRestoreNormalcy();
                cyberAudio.playRestoreTone();
              }}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold tracking-wider shadow-[0_0_20px_rgba(0,255,136,0.5)] border border-emerald-400 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
              <span>PURGE ATTACK / RESTORE CAN</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
