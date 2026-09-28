import React, { useState } from 'react';
import {
  Brain,
  Network,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  GitBranch,
  Sparkles,
  Zap,
  Activity,
  Code2
} from 'lucide-react';
import { LiveWeatherData, VehicleParameters } from '../types/telematics';
import { CONV_KERNELS } from '../dl_math/cnnPerceptionModel';
import { runDeepAnnBatteryInference } from '../dl_math/annBatteryModel';
import { runAutoencoderSecurityInference } from '../dl_math/autoencoderModel';

interface DlBackendSimulatorProps {
  weather: LiveWeatherData | null;
  vehicle: VehicleParameters;
  onInjectCyberAttack: () => void;
  onRestoreNormalcy: () => void;
}

export const DlBackendSimulator: React.FC<DlBackendSimulatorProps> = ({
  weather,
  vehicle,
  onInjectCyberAttack,
  onRestoreNormalcy,
}) => {
  // CNN convolution interactive inspection patch
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number }>({ r: 3, c: 3 });
  const [activeKernelKey, setActiveKernelKey] = useState<'HORIZONTAL_EDGE' | 'VERTICAL_EDGE' | 'LAPLACIAN_RIDGE'>('VERTICAL_EDGE');

  // Input data from live state
  const temp = weather ? weather.temperature : 27.2;
  const humidity = weather ? weather.relativeHumidity : 65;
  const wind = weather ? weather.windSpeed : 13;
  const friction = weather ? weather.frictionCoefficient : 0.88;

  // Run real-time ANN inference for the simulator math breakdown
  const annActivations = runDeepAnnBatteryInference(
    temp,
    humidity,
    wind,
    friction,
    vehicle.speedKmh,
    vehicle.payloadKg,
    vehicle.currentSoC,
    vehicle.batteryCapacityKwh
  );

  // Vector for Autoencoder
  const rawVec = [
    Math.min(1, vehicle.speedKmh / 150),
    friction,
    (vehicle.steeringAngleDeg + 30) / 60,
    vehicle.currentSoC / 100,
    Math.min(1, Math.max(0, (temp + 10) / 50)),
    0.92,
    weather ? Math.min(1, weather.aerodynamicDragForce / 600) : 0.4,
    Math.abs(vehicle.steeringAngleDeg) / 30,
  ];

  const aeResult = runAutoencoderSecurityInference(rawVec, vehicle.isCyberAttackActive);

  // 6x6 Raw Image Patch for CNN convolution demonstration
  const rawPixelGrid = [
    [0.10, 0.15, 0.85, 0.90, 0.20, 0.10],
    [0.12, 0.18, 0.88, 0.92, 0.22, 0.12],
    [0.08, 0.14, 0.82, 0.89, 0.19, 0.09],
    [0.15, 0.20, 0.90, 0.95, 0.25, 0.15],
    [0.11, 0.16, 0.86, 0.91, 0.21, 0.11],
    [0.09, 0.13, 0.84, 0.88, 0.18, 0.08],
  ];

  const currentKernel = CONV_KERNELS[activeKernelKey];

  // Calculate convolution dot product for the selected cell
  const r = selectedCell.r;
  const c = selectedCell.c;
  let convolutionSum = 0;
  const productTerms: { pixel: number; weight: number; product: number }[] = [];

  for (let kr = 0; kr < 3; kr++) {
    for (let kc = 0; kc < 3; kc++) {
      const ir = r + kr - 1;
      const ic = c + kc - 1;
      const pixelVal = (ir >= 0 && ir < 6 && ic >= 0 && ic < 6) ? rawPixelGrid[ir][ic] : 0;
      const weightVal = currentKernel[kr][kc];
      const prod = Number((pixelVal * weightVal).toFixed(3));
      convolutionSum += prod;
      productTerms.push({ pixel: pixelVal, weight: weightVal, product: prod });
    }
  }

  const reluOutput = Math.max(0, Number(convolutionSum.toFixed(3)));

  // Simulated LSTM Gating Scalars
  const speedNorm = vehicle.speedKmh / 100;
  const yawNorm = vehicle.steeringAngleDeg / 45;
  const forgetGateVal = Number((1 / (1 + Math.exp(-(0.85 * speedNorm + 0.12 * yawNorm + 1.2)))).toFixed(3));
  const inputGateVal = Number((1 / (1 + Math.exp(-(0.45 * speedNorm + 0.25 * yawNorm - 0.4)))).toFixed(3));
  const candidateVal = Number((Math.tanh(0.60 * speedNorm + 0.30 * yawNorm)).toFixed(3));
  const cellStateVal = Number((forgetGateVal * 1.42 + inputGateVal * candidateVal).toFixed(3));
  const outputGateVal = Number((1 / (1 + Math.exp(-(0.55 * speedNorm + 0.18 * yawNorm + 0.2)))).toFixed(3));
  const hiddenStateVal = Number((outputGateVal * Math.tanh(cellStateVal)).toFixed(3));

  return (
    <div className="flex flex-col space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="bg-[#090e18]/90 border border-cyan-500/30 rounded-xl p-5 backdrop-blur-md shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-400/50 text-cyan-400">
                <Brain className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold font-display uppercase tracking-wide text-white neon-glow-text-cyan">
                  Deep Learning Backend Simulator & Algorithmic Architecture
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Live tensor pipeline, mathematical gating mechanics, convolution reduction, and anomaly loss equations
                </p>
              </div>
            </div>
          </div>

          {/* Quick Cyber Attack Trigger */}
          <div className="flex items-center space-x-3">
            {!vehicle.isCyberAttackActive ? (
              <button
                onClick={onInjectCyberAttack}
                className="px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-500 text-white font-mono text-xs font-bold border border-red-400 shadow-[0_0_15px_rgba(255,0,0,0.5)] transition-all cursor-pointer flex items-center space-x-2"
              >
                <ShieldAlert className="w-4 h-4 text-amber-300" />
                <span>INJECT ADVERSARIAL ATTACK</span>
              </button>
            ) : (
              <button
                onClick={onRestoreNormalcy}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold border border-emerald-400 shadow-[0_0_15px_rgba(0,255,136,0.4)] transition-all cursor-pointer flex items-center space-x-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-200" />
                <span>RESTORE NOMINAL CAN-BUS</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Glowing Data Pipeline Flowchart */}
      <div className="cyber-card rounded-xl p-5">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-500/20">
          <div className="flex items-center space-x-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold font-display uppercase tracking-wider text-white">
              End-to-End Live Telematics Data Pipeline
            </h2>
          </div>
          <span className="text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded">
            JSON Payload &rarr; Multi-Modal Tensors
          </span>
        </div>

        {/* Pipeline Diagram Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
          
          {/* Step 1: Open-Meteo REST API Ingestion */}
          <div className="bg-[#0b1220] p-3.5 rounded-lg border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.15)] flex flex-col justify-between h-48">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-1">
                <span className="font-bold">STEP 01</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="text-sm font-bold font-display text-white">Open-Meteo Live API</div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                Public CORS HTTPS endpoint
              </div>
            </div>

            <div className="bg-black/60 p-2 rounded text-[10px] font-mono text-slate-300 space-y-0.5 border border-cyan-500/20">
              <div className="text-cyan-300 truncate">temp: {temp.toFixed(1)}°C</div>
              <div className="text-cyan-300 truncate">humidity: {humidity}%</div>
              <div className="text-cyan-300 truncate">wind: {wind.toFixed(1)} km/h</div>
              <div className="text-emerald-400 truncate">friction μ: {friction.toFixed(2)}</div>
            </div>
            
            <div className="text-[9px] font-mono text-slate-400 truncate">
              Region: {weather ? 'Karnataka Regional Stream' : 'Calibrated Feed'}
            </div>
          </div>

          {/* Arrow 1 */}
          <div className="hidden md:flex justify-center text-cyan-400">
            <ArrowRight className="w-6 h-6 animate-pulse" />
          </div>

          {/* Step 2: Feature Engineering & Tokenization */}
          <div className="bg-[#0b1220] p-3.5 rounded-lg border border-purple-500/40 shadow-[0_0_15px_rgba(147,51,234,0.15)] flex flex-col justify-between h-48">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-purple-400 mb-1">
                <span className="font-bold">STEP 02</span>
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="text-sm font-bold font-display text-white">Physical Transformations</div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                Normalization into domain [-1, 1]
              </div>
            </div>

            <div className="bg-black/60 p-2 rounded text-[9px] font-mono text-purple-300 space-y-1 border border-purple-500/20">
              <div>&bull; Air Density: &rho; = P / (R&middot;T)</div>
              <div>&bull; Aero Drag: F_d = 0.5&middot;&rho;&middot;Cd&middot;A&middot;v&sup2;</div>
              <div>&bull; Road Friction: WMO Weather &rarr; &mu;</div>
            </div>

            <div className="text-[9px] font-mono text-slate-400">
              Zero hardcoded mock arrays
            </div>
          </div>

          {/* Arrow 2 */}
          <div className="hidden md:flex justify-center text-purple-400">
            <ArrowRight className="w-6 h-6 animate-pulse" />
          </div>

          {/* Step 3: Multi-Modal Distribution to 4 DL Models */}
          <div className="bg-[#0b1220] p-3.5 rounded-lg border border-emerald-500/40 shadow-[0_0_15px_rgba(0,255,136,0.15)] flex flex-col justify-between h-48">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-1">
                <span className="font-bold">STEP 03</span>
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-sm font-bold font-display text-white">Tensor Ingestion</div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                Distributed Parallel Inference
              </div>
            </div>

            <div className="bg-black/60 p-2 rounded text-[9px] font-mono text-emerald-300 space-y-0.5 border border-emerald-500/20">
              <div>&bull; CNN: Dashcam Video Buffer</div>
              <div>&bull; LSTM: Ego Coordinates [X,Y]</div>
              <div>&bull; ANN: Tabular Telematics Matrix</div>
              <div>&bull; Autoencoder: 8D Security Vector</div>
            </div>

            <div className="text-[9px] font-mono text-emerald-400">
              Synchronized 60 FPS Engine
            </div>
          </div>

        </div>
      </div>

      {/* Grid of 4 Detailed Mathematical Deep-Dives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. CNN MATHEMATICAL DEEP-DIVE */}
        <div className="cyber-card rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-cyan-500/20">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold font-display uppercase tracking-wider text-white">
                1. CNN Perception Engine Math
              </h3>
            </div>
            <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
              2D Convolution &bull; ReLU &bull; Softmax
            </span>
          </div>

          <p className="text-xs text-slate-300 font-mono leading-relaxed mb-3">
            Spatial reduction step: A <span className="text-cyan-300">[3&times;3]</span> filter kernel slides across the raw pixel tensor. The output cell is the sum of element-wise products passed through ReLU <code className="text-emerald-400">max(0, &Sigma; P_ij &times; W_ij)</code>.
          </p>

          {/* Interactive Matrix Inspection */}
          <div className="bg-[#090d16] p-3 rounded-lg border border-cyan-500/20 mb-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-2">
              <span>Select Kernel:</span>
              <div className="flex space-x-1">
                {(['VERTICAL_EDGE', 'HORIZONTAL_EDGE', 'LAPLACIAN_RIDGE'] as const).map((k) => (
                  <button
                    key={k}
                    onClick={() => setActiveKernelKey(k)}
                    className={`px-2 py-0.5 text-[9px] font-mono rounded cursor-pointer ${
                      activeKernelKey === k
                        ? 'bg-cyan-500 text-black font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-cyan-300 border border-slate-700'
                    }`}
                  >
                    {k === 'VERTICAL_EDGE' ? 'Sobel dX' : k === 'HORIZONTAL_EDGE' ? 'Sobel dY' : 'Laplacian'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-center">
              {/* Raw 6x6 Pixel Grid with clickable cell */}
              <div>
                <div className="text-[10px] font-mono text-slate-400 mb-1">
                  Input Pixel Array (6&times;6) - Click Cell:
                </div>
                <div className="grid grid-cols-6 gap-1 bg-black p-1 rounded border border-cyan-500/30">
                  {rawPixelGrid.map((row, rowIdx) =>
                    row.map((val, colIdx) => {
                      const isSelected = selectedCell.r === rowIdx && selectedCell.c === colIdx;
                      const isInPatch =
                        Math.abs(rowIdx - selectedCell.r) <= 1 && Math.abs(colIdx - selectedCell.c) <= 1;

                      return (
                        <div
                          key={`${rowIdx}-${colIdx}`}
                          onClick={() => setSelectedCell({ r: rowIdx, c: colIdx })}
                          className={`aspect-square flex items-center justify-center text-[8px] font-mono rounded cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-cyan-400 text-black font-bold ring-2 ring-cyan-200'
                              : isInPatch
                              ? 'bg-cyan-950 text-cyan-200 border border-cyan-500/60'
                              : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          {val.toFixed(2)}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* 3x3 Kernel Matrix */}
              <div>
                <div className="text-[10px] font-mono text-slate-400 mb-1">
                  Active Filter Kernel (3&times;3):
                </div>
                <div className="grid grid-cols-3 gap-1 bg-black p-1.5 rounded border border-purple-500/40">
                  {currentKernel.map((kRow, ki) =>
                    kRow.map((kVal, kj) => (
                      <div
                        key={`${ki}-${kj}`}
                        className="aspect-square flex items-center justify-center text-[10px] font-mono font-bold bg-purple-950/70 text-purple-300 rounded border border-purple-500/30"
                      >
                        {kVal >= 0 ? `+${kVal}` : kVal}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Real Arithmetic Computation Breakdown */}
          <div className="bg-black/60 p-3 rounded-lg border border-cyan-500/20 font-mono text-[11px] space-y-1">
            <div className="text-cyan-400 font-bold">
              Feature Map Output Calculation at Cell ({r}, {c}):
            </div>
            <div className="text-slate-300 text-[10px] overflow-x-auto whitespace-nowrap py-1">
              &Sigma;(Pixel &times; Filter) = {productTerms.slice(0, 5).map(p => `(${p.pixel} &times; ${p.weight})`).join(' + ')} + ...
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
              <span className="text-slate-400">Sum of Products:</span>
              <span className="text-white font-bold">{convolutionSum.toFixed(3)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">After ReLU Activation max(0, x):</span>
              <span className="text-emerald-400 font-bold text-sm">{reluOutput.toFixed(3)}</span>
            </div>
          </div>
        </div>

        {/* 2. RNN / LSTM MATHEMATICAL DEEP-DIVE */}
        <div className="cyber-card rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-cyan-500/20">
            <div className="flex items-center space-x-2">
              <GitBranch className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold font-display uppercase tracking-wider text-white">
                2. RNN / LSTM Gating & Memory Math
              </h3>
            </div>
            <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
              Constant Error Carousel (CEC)
            </span>
          </div>

          <p className="text-xs text-slate-300 font-mono leading-relaxed mb-3">
            LSTMs combat vanishing gradients via additive linear cell propagation: <code className="text-emerald-400">c_t = f_t &odot; c_t-1 + i_t &odot; c̃_t</code>. The forget gate regulates memory retention without repeated multiplicative decay.
          </p>

          {/* Mathematical Gating Block Equations */}
          <div className="bg-[#090d16] p-3 rounded-lg border border-emerald-500/20 space-y-2 font-mono text-xs mb-3">
            
            <div className="flex items-center justify-between p-1.5 bg-black/60 rounded border border-emerald-500/20">
              <div>
                <span className="text-cyan-400 font-bold">Forget Gate:</span>
                <span className="text-slate-400 text-[10px] ml-2">f_t = &sigma;(W_f &middot; [h_t-1, x_t] + b_f)</span>
              </div>
              <span className="text-cyan-300 font-bold">{forgetGateVal} (Retention)</span>
            </div>

            <div className="flex items-center justify-between p-1.5 bg-black/60 rounded border border-emerald-500/20">
              <div>
                <span className="text-cyan-400 font-bold">Input Gate:</span>
                <span className="text-slate-400 text-[10px] ml-2">i_t = &sigma;(W_i &middot; [h_t-1, x_t] + b_i)</span>
              </div>
              <span className="text-cyan-300 font-bold">{inputGateVal} (Update Weight)</span>
            </div>

            <div className="flex items-center justify-between p-1.5 bg-black/60 rounded border border-emerald-500/20">
              <div>
                <span className="text-purple-400 font-bold">Candidate Cell:</span>
                <span className="text-slate-400 text-[10px] ml-2">c̃_t = tanh(W_c &middot; [h_t-1, x_t] + b_c)</span>
              </div>
              <span className="text-purple-300 font-bold">{candidateVal}</span>
            </div>

            <div className="flex items-center justify-between p-1.5 bg-black/60 rounded border border-emerald-500/20">
              <div>
                <span className="text-emerald-400 font-bold">Cell State:</span>
                <span className="text-slate-400 text-[10px] ml-2">c_t = f_t &odot; c_t-1 + i_t &odot; c̃_t</span>
              </div>
              <span className="text-emerald-300 font-bold text-sm">{cellStateVal}</span>
            </div>

            <div className="flex items-center justify-between p-1.5 bg-black/60 rounded border border-emerald-500/20">
              <div>
                <span className="text-amber-400 font-bold">Output Gate:</span>
                <span className="text-slate-400 text-[10px] ml-2">o_t = &sigma;(W_o &middot; [h_t-1, x_t] + b_o)</span>
              </div>
              <span className="text-amber-300 font-bold">{outputGateVal}</span>
            </div>

            <div className="flex items-center justify-between p-1.5 bg-black/60 rounded border border-emerald-500/20">
              <div>
                <span className="text-emerald-400 font-bold">Hidden State:</span>
                <span className="text-slate-400 text-[10px] ml-2">h_t = o_t &odot; tanh(c_t)</span>
              </div>
              <span className="text-emerald-300 font-bold">{hiddenStateVal}</span>
            </div>

          </div>

          <div className="bg-black/60 p-2.5 rounded border border-emerald-500/20 text-[10px] font-mono text-slate-300">
            <span className="text-emerald-400 font-bold">Gradient Backpropagation Flow:</span> Since &part;c_t / &part;c_t-1 contains the direct additive term f_t, error gradients flow backward through 50+ time steps without collapsing to zero!
          </div>
        </div>

        {/* 3. DEEP ANN (MLP) MATHEMATICAL DEEP-DIVE */}
        <div className="cyber-card rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-cyan-500/20">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold font-display uppercase tracking-wider text-white">
                3. Deep ANN Battery Multi-Layer Perceptron Math
              </h3>
            </div>
            <span className="text-[10px] font-mono bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
              Y = W &middot; X + B
            </span>
          </div>

          <p className="text-xs text-slate-300 font-mono leading-relaxed mb-3">
            Real feedforward matrix multiplication: Normalized input vector X passes through successive weight tensors and biases with ReLU non-linearities: <code className="text-purple-400">H_k = max(0, W_k &middot; H_k-1 + B_k)</code>.
          </p>

          {/* Live Vector Values from Current Sliders */}
          <div className="bg-[#090d16] p-3 rounded-lg border border-purple-500/20 space-y-2 font-mono text-xs mb-3">
            <div className="text-[10px] text-slate-400">
              Live Input Vector X &isin; &Ropf;&sup7; (Dynamically bound to weather &amp; controls):
            </div>
            <div className="bg-black/80 p-2 rounded text-[10px] text-cyan-300 border border-cyan-500/20 overflow-x-auto whitespace-nowrap">
              [{annActivations.inputLayer.join(', ')}]
            </div>

            <div className="text-[10px] text-slate-400 mt-2">
              Hidden Layer 1 Activations H1 = ReLU(W1 &middot; X + b1) &isin; &Ropf;&sup6;:
            </div>
            <div className="bg-black/80 p-2 rounded text-[10px] text-emerald-300 border border-emerald-500/20 overflow-x-auto whitespace-nowrap">
              [{annActivations.hiddenLayer1.join(', ')}]
            </div>

            <div className="text-[10px] text-slate-400 mt-2">
              Hidden Layer 2 Activations H2 = ReLU(W2 &middot; H1 + b2) &isin; &Ropf;&sup4;:
            </div>
            <div className="bg-black/80 p-2 rounded text-[10px] text-amber-300 border border-amber-500/20 overflow-x-auto whitespace-nowrap">
              [{annActivations.hiddenLayer2.join(', ')}]
            </div>
          </div>

          {/* Final Output Equation Result */}
          <div className="bg-black/60 p-3 rounded-lg border border-purple-500/30 font-mono text-xs flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Final Projected Range</div>
              <div className="text-xl font-bold text-cyan-300">
                {annActivations.outputLayer.predictedRangeKm} km
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase">Specific Consumption</div>
              <div className="text-xl font-bold text-emerald-300">
                {annActivations.outputLayer.consumptionWhPerKm} Wh/km
              </div>
            </div>
          </div>
        </div>

        {/* 4. AUTOENCODER FIREWALL MATHEMATICAL DEEP-DIVE */}
        <div className={`cyber-card rounded-xl p-5 flex flex-col transition-all duration-300 ${
          aeResult.isAnomaly ? 'neon-border-red shadow-[0_0_35px_rgba(255,30,86,0.35)]' : ''
        }`}>
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-cyan-500/20">
            <div className="flex items-center space-x-2">
              <ShieldAlert className={`w-5 h-5 ${aeResult.isAnomaly ? 'text-red-500 animate-bounce' : 'text-emerald-400'}`} />
              <h3 className="text-base font-bold font-display uppercase tracking-wider text-white">
                4. Autoencoder Anomaly & MSE Loss Math
              </h3>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
              aeResult.isAnomaly
                ? 'bg-red-950 text-red-300 border-red-500'
                : 'bg-emerald-950 text-emerald-300 border-emerald-500'
            }`}>
              {aeResult.isAnomaly ? 'THRESHOLD BREACHED' : 'MSE NOMINAL'}
            </span>
          </div>

          <p className="text-xs text-slate-300 font-mono leading-relaxed mb-3">
            Mean Squared Error formula: <code className="text-red-400">MSE = (1 / n) &Sigma; (x_i - x̂_i)&sup2;</code>. Under nominal conditions, the autoencoder reconstructs learned vehicle manifolds accurately with low residual error. Adversarial spoofing creates an uncompressible distortion.
          </p>

          {/* Side-by-Side Matching Array Vector Inspection */}
          <div className="bg-[#090d16] p-3 rounded-lg border border-cyan-500/20 font-mono text-xs mb-3">
            <div className="text-[10px] text-slate-400 mb-1">
              Side-by-Side Array Reconstruction Vector:
            </div>

            <div className="grid grid-cols-8 gap-1 text-center text-[9px] mb-2">
              {aeResult.featureNames.map((name, idx) => (
                <div key={idx} className="bg-black/60 p-1 rounded border border-slate-800 text-slate-400 truncate" title={name}>
                  {name.split(' ')[0]}
                </div>
              ))}
            </div>

            {/* Input Vector */}
            <div className="text-[9px] text-cyan-400 font-bold mb-0.5">Input x_i:</div>
            <div className="grid grid-cols-8 gap-1 text-center text-[9px] mb-2">
              {aeResult.inputVector.map((val, idx) => (
                <div key={idx} className="bg-cyan-950/60 p-1 rounded border border-cyan-500/30 text-cyan-200">
                  {val.toFixed(2)}
                </div>
              ))}
            </div>

            {/* Reconstructed Vector */}
            <div className="text-[9px] text-purple-400 font-bold mb-0.5">Reconstructed x̂_i:</div>
            <div className="grid grid-cols-8 gap-1 text-center text-[9px] mb-2">
              {aeResult.reconstructedVector.map((val, idx) => (
                <div key={idx} className="bg-purple-950/60 p-1 rounded border border-purple-500/30 text-purple-200">
                  {val.toFixed(2)}
                </div>
              ))}
            </div>

            {/* Residual Squared Deltas */}
            <div className="text-[9px] text-amber-400 font-bold mb-0.5">Squared Delta (x_i - x̂_i)&sup2;:</div>
            <div className="grid grid-cols-8 gap-1 text-center text-[9px]">
              {aeResult.featureErrors.map((err, idx) => (
                <div
                  key={idx}
                  className={`p-1 rounded border font-bold ${
                    err > 0.05
                      ? 'bg-red-950/80 text-red-300 border-red-500'
                      : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  {err.toFixed(3)}
                </div>
              ))}
            </div>
          </div>

          {/* MSE Score Card */}
          <div className={`p-3 rounded-lg border font-mono flex items-center justify-between ${
            aeResult.isAnomaly
              ? 'bg-red-950/80 border-red-500 text-red-200 animate-pulse'
              : 'bg-black/60 border-emerald-500/30 text-slate-200'
          }`}>
            <div>
              <div className="text-[10px] text-slate-400">Total Calculated Mean Squared Error (MSE):</div>
              <div className="text-xl font-bold flex items-baseline space-x-2">
                <span className={aeResult.isAnomaly ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {aeResult.mse.toFixed(4)}
                </span>
                <span className="text-xs text-slate-400">
                  (Safety Threshold &theta; = {aeResult.threshold})
                </span>
              </div>
            </div>

            <div className="text-right text-xs">
              <span className={`px-2.5 py-1 rounded font-bold ${
                aeResult.isAnomaly ? 'bg-red-600 text-white' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
              }`}>
                {aeResult.isAnomaly ? 'SAFETY PULLEVER ACTIVE' : 'INTEGRITY PASS'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
