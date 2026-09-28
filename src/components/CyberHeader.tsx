import React from 'react';
import { ShieldAlert, Radio, Volume2, VolumeX, Download, RefreshCw, Cpu, Activity, Brain } from 'lucide-react';
import { CityCoordinates } from '../types/telematics';
import { KARNATAKA_CITIES } from '../services/openMeteoService';
import { cyberAudio } from '../utils/audioSynthesizer';

interface CyberHeaderProps {
  selectedCity: CityCoordinates;
  onSelectCity: (city: CityCoordinates) => void;
  isStreaming: boolean;
  onToggleStreaming: () => void;
  onRefreshWeather: () => void;
  isRefreshing: boolean;
  isCyberAttackActive: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenExportModal: () => void;
  activeTab: 'telemetry' | 'simulator';
  onChangeTab: (tab: 'telemetry' | 'simulator') => void;
}

export const CyberHeader: React.FC<CyberHeaderProps> = ({
  selectedCity,
  onSelectCity,
  isStreaming,
  onToggleStreaming,
  onRefreshWeather,
  isRefreshing,
  isCyberAttackActive,
  isMuted,
  onToggleMute,
  onOpenExportModal,
  activeTab,
  onChangeTab,
}) => {
  return (
    <header className="relative w-full z-30">
      {/* Critical Security Intrusion Banner if attack is active */}
      {isCyberAttackActive && (
        <div className="w-full bg-red-600/90 border-b-2 border-red-500 text-white px-4 py-2 flex items-center justify-between animate-pulse shadow-[0_0_30px_rgba(255,0,0,0.8)]">
          <div className="flex items-center space-x-3">
            <ShieldAlert className="w-6 h-6 animate-bounce text-amber-300" />
            <div>
              <span className="font-bold tracking-widest uppercase font-mono text-sm md:text-base text-amber-200">
                CRITICAL SYSTEM INTRUSION DETECTED:
              </span>
              <span className="ml-2 font-mono text-xs md:text-sm text-white">
                AUTOENCODER MSE RECONSTRUCTION ERROR BREACHED SAFETY THRESHOLD. CAN-BUS SPOOFING CONFIRMED.
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-black/60 rounded text-xs font-mono font-bold text-red-300 border border-red-400">
              SAFETY PULLEVER IN PROGRESS
            </span>
          </div>
        </div>
      )}

      {/* Main Top Bar */}
      <div className="bg-[#0b101c]/90 border-b border-cyan-500/30 backdrop-blur-md px-4 py-3">
        <div className="max-w-[1700px] mx-auto flex flex-col xl:flex-row items-center justify-between gap-4">
          
          {/* Logo & Project Title */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-400/50 flex items-center justify-center relative shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Cpu className="w-6 h-6 text-cyan-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg md:text-xl font-bold tracking-wider text-slate-100 uppercase font-display neon-glow-text-cyan">
                  Autonomous Vehicle Telematics & Cabin Safety System
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono tracking-widest bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 rounded">
                  KARNATAKA EDITION
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Multi-Modal Deep Learning: CNN • LSTM • Deep ANN • Autoencoder | Karnataka Live Operations
              </p>
            </div>
          </div>

          {/* Navigation Toggle System: [Live Telemetry] vs [DL Backend Simulator] */}
          <div className="flex items-center p-1 bg-[#070b14] rounded-xl border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            <button
              onClick={() => {
                onChangeTab('telemetry');
                cyberAudio.playTelemetryChirp();
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'telemetry'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_15px_rgba(0,240,255,0.5)]'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>📊 Live Operations Telemetry</span>
            </button>

            <button
              onClick={() => {
                onChangeTab('simulator');
                cyberAudio.playTelemetryChirp();
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                  : 'text-slate-400 hover:text-purple-300'
              }`}
            >
              <Brain className="w-4 h-4" />
              <span>🧠 Deep Learning Backend Simulator</span>
            </button>
          </div>

          {/* Center-Right Telemetry Feed Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Live Open-Meteo Feed Status */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#0e1726] border border-cyan-500/30 font-mono text-xs">
              <span className={`w-2.5 h-2.5 rounded-full ${isStreaming ? 'bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse' : 'bg-amber-400'}`} />
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-300">Karnataka Stream:</span>
              <span className={isStreaming ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                {isStreaming ? 'LIVE' : 'PAUSED'}
              </span>
            </div>

            {/* Karnataka City Target Selector */}
            <div className="flex items-center space-x-1.5 px-2 py-1 bg-[#0e1726] border border-cyan-500/30 rounded-lg text-xs font-mono">
              <span className="text-slate-400">Target Geo:</span>
              <select
                value={selectedCity.name}
                onChange={(e) => {
                  const city = KARNATAKA_CITIES.find(c => c.name === e.target.value);
                  if (city) {
                    onSelectCity(city);
                    cyberAudio.playTelemetryChirp();
                  }
                }}
                className="bg-slate-900 text-cyan-300 border border-cyan-500/40 rounded px-2 py-1 focus:outline-none focus:border-cyan-400 cursor-pointer font-bold"
              >
                {KARNATAKA_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.regionTag.split('/')[0].trim()})
                  </option>
                ))}
              </select>
            </div>

            {/* Refresh Live Telemetry Button */}
            <button
              onClick={() => {
                onRefreshWeather();
                cyberAudio.playTelemetryChirp();
              }}
              disabled={isRefreshing}
              title="Refresh live Karnataka weather telematics"
              className="p-1.5 rounded-lg bg-[#0e1726] border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-cyan-100 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleMute}
              title={isMuted ? 'Unmute HUD Audio SFX' : 'Mute HUD Audio SFX'}
              className="p-1.5 rounded-lg bg-[#0e1726] border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-cyan-100 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>

            {/* Export Standalone HTML Modal Button */}
            <button
              onClick={onOpenExportModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-black font-semibold text-xs rounded-lg transition-all shadow-[0_0_12px_rgba(0,240,255,0.3)] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Standalone HTML</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
