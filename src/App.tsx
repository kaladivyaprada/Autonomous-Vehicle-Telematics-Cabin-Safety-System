/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { CyberHeader } from './components/CyberHeader';
import { LiveWeatherTelemetryBar } from './components/LiveWeatherTelemetryBar';
import { GlobalControls } from './components/GlobalControls';
import { ModuleCnnPerception } from './components/ModuleCnnPerception';
import { ModuleLstmTrajectory } from './components/ModuleLstmTrajectory';
import { ModuleAnnBattery } from './components/ModuleAnnBattery';
import { ModuleAutoencoderGuard } from './components/ModuleAutoencoderGuard';
import { DlBackendSimulator } from './components/DlBackendSimulator';
import { StandaloneExportModal } from './components/StandaloneExportModal';
import { CityCoordinates, LiveWeatherData, VehicleParameters } from './types/telematics';
import { KARNATAKA_CITIES, fetchLiveCityWeather } from './services/openMeteoService';
import { cyberAudio } from './utils/audioSynthesizer';
import { Binary, Shield, Database, Sparkles, MapPin } from 'lucide-react';

export default function App() {
  const [selectedCity, setSelectedCity] = useState<CityCoordinates>(KARNATAKA_CITIES[0]);
  const [weather, setWeather] = useState<LiveWeatherData | null>(null);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [cnnConfidence, setCnnConfidence] = useState<number>(0.92);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'telemetry' | 'simulator'>('telemetry');

  // Vehicle Telematics State
  const [vehicle, setVehicle] = useState<VehicleParameters>({
    speedKmh: 75,
    payloadKg: 200,
    batteryCapacityKwh: 78,
    currentSoC: 80,
    cabinTargetTemp: 22.0,
    driveMode: 'AUTONOMOUS',
    steeringAngleDeg: 0,
    isCyberAttackActive: false,
  });

  // Fetch real-world live public telemetry from Open-Meteo for Karnataka
  const loadLiveWeather = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchLiveCityWeather(selectedCity, vehicle.speedKmh);
      setWeather(data);
    } catch (err) {
      console.error('Failed to load weather:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedCity, vehicle.speedKmh]);

  // Initial fetch and city change effect
  useEffect(() => {
    loadLiveWeather();
    const interval = setInterval(() => {
      if (isStreaming) {
        loadLiveWeather();
      }
    }, 45000);
    return () => clearInterval(interval);
  }, [loadLiveWeather, isStreaming]);

  // Audio mute handler
  const handleToggleMute = () => {
    cyberAudio.isMuted = !cyberAudio.isMuted;
    setIsMuted(cyberAudio.isMuted);
  };

  // Cyber Attack Trigger
  const handleInjectCyberAttack = () => {
    setVehicle((prev) => ({ ...prev, isCyberAttackActive: true }));
  };

  // Cyber Attack Restoral
  const handleRestoreNormalcy = () => {
    setVehicle((prev) => ({ ...prev, isCyberAttackActive: false }));
  };

  return (
    <div className={`min-h-screen flex flex-col cyber-bg scanlines text-slate-100 transition-colors duration-300 ${
      vehicle.isCyberAttackActive ? 'bg-[#150508]' : 'bg-[#07090e]'
    }`}>
      
      {/* Cyber Header Navigation & Global Status with Multi-Page Tabs */}
      <CyberHeader
        selectedCity={selectedCity}
        onSelectCity={(city) => {
          setSelectedCity(city);
          loadLiveWeather();
        }}
        isStreaming={isStreaming}
        onToggleStreaming={() => setIsStreaming((prev) => !prev)}
        onRefreshWeather={loadLiveWeather}
        isRefreshing={isRefreshing}
        isCyberAttackActive={vehicle.isCyberAttackActive}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />

      {/* Live Environmental Telematics Ribbon (Real Open-Meteo Karnataka Data) */}
      <LiveWeatherTelemetryBar weather={weather} speedKmh={vehicle.speedKmh} />

      {/* Karnataka Regional Context Sub-bar */}
      <div className="w-full bg-[#080d17]/80 border-b border-cyan-500/20 px-4 py-1.5 backdrop-blur-md">
        <div className="max-w-[1700px] mx-auto flex flex-wrap items-center justify-between text-[11px] font-mono">
          <div className="flex items-center space-x-2 text-cyan-300">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold">{selectedCity.name}, {selectedCity.state}</span>
            <span className="text-slate-400">&bull; {selectedCity.regionTag}</span>
          </div>
          <div className="text-slate-400">
            GPS: <span className="text-cyan-400">{selectedCity.latitude}° N, {selectedCity.longitude}° E</span> | Timezone: <span className="text-emerald-400">IST (UTC+5:30)</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Workspace Container */}
      <div className="flex-grow max-w-[1700px] w-full mx-auto px-4 py-4 flex flex-col">
        
        {/* Global Controls (Always accessible across both pages) */}
        <GlobalControls
          vehicle={vehicle}
          onUpdateVehicle={setVehicle}
          isStreaming={isStreaming}
          onToggleStreaming={() => setIsStreaming((prev) => !prev)}
          onInjectCyberAttack={handleInjectCyberAttack}
          onRestoreNormalcy={handleRestoreNormalcy}
        />

        {/* PAGE 1: LIVE OPERATIONS TELEMETRY */}
        {activeTab === 'telemetry' && (
          <div className="space-y-6 flex-grow flex flex-col">
            {/* 4 Deep Learning Modules Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-grow">
              
              {/* Module 1: Perception Engine (CNN) */}
              <div className="flex flex-col">
                <ModuleCnnPerception
                  speedKmh={vehicle.speedKmh}
                  isStreaming={isStreaming}
                  onSoftmaxUpdate={setCnnConfidence}
                />
              </div>

              {/* Module 2: Trajectory & Navigation Predictor (RNNs / LSTMs) */}
              <div className="flex flex-col">
                <ModuleLstmTrajectory
                  speedKmh={vehicle.speedKmh}
                  isStreaming={isStreaming}
                  onSteerUpdate={(angle) => setVehicle((v) => ({ ...v, steeringAngleDeg: angle }))}
                />
              </div>

              {/* Module 3: Battery & Performance Optimizer (Deep ANNs) */}
              <div className="flex flex-col">
                <ModuleAnnBattery
                  weather={weather}
                  vehicle={vehicle}
                  isStreaming={isStreaming}
                />
              </div>

              {/* Module 4: Central Cyber-Security Intrusion Guard (Autoencoders) */}
              <div className="flex flex-col">
                <ModuleAutoencoderGuard
                  weather={weather}
                  vehicle={vehicle}
                  isStreaming={isStreaming}
                  cnnConfidence={cnnConfidence}
                />
              </div>

            </div>

            {/* Architecture Overview Footer */}
            <div className="bg-[#080d1a]/80 border border-cyan-500/20 rounded-xl p-4 backdrop-blur-md">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
                
                <div className="bg-black/40 p-3 rounded-lg border border-cyan-500/20">
                  <div className="flex items-center space-x-2 text-cyan-400 font-bold mb-1">
                    <Binary className="w-4 h-4" />
                    <span>1. CNN Vision</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    2D spatial convolution on Karnataka highway dashcam feed. Real-time Conv2D feature activations + categorical Softmax probabilities.
                  </p>
                </div>

                <div className="bg-black/40 p-3 rounded-lg border border-cyan-500/20">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold mb-1">
                    <Database className="w-4 h-4" />
                    <span>2. LSTM Navigation</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Traces past 5s ego coordinates [X,Y]. Recurrent gating mechanisms project future trajectory horizon without vanishing gradient.
                  </p>
                </div>

                <div className="bg-black/40 p-3 rounded-lg border border-purple-500/20">
                  <div className="flex items-center space-x-2 text-purple-400 font-bold mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>3. Deep ANN (MLP)</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Ingests regional Karnataka temperature, monsoonal moisture & payload to compute exact remaining battery range (km) via ReLU feedforward.
                  </p>
                </div>

                <div className="bg-black/40 p-3 rounded-lg border border-red-400/30">
                  <div className="flex items-center space-x-2 text-red-400 font-bold mb-1">
                    <Shield className="w-4 h-4" />
                    <span>4. Autoencoder Guard</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    8D multi-modal telematics vector compressed into 2D bottleneck latent space. Triggers emergency safety pullover when MSE &ge; 0.065.
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* PAGE 2: DEEP LEARNING BACKEND SIMULATOR */}
        {activeTab === 'simulator' && (
          <DlBackendSimulator
            weather={weather}
            vehicle={vehicle}
            onInjectCyberAttack={handleInjectCyberAttack}
            onRestoreNormalcy={handleRestoreNormalcy}
          />
        )}

      </div>

      {/* Standalone Single-File HTML Export Modal */}
      <StandaloneExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

    </div>
  );
}
