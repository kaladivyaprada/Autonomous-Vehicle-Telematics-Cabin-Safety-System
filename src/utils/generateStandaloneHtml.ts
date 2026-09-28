/**
 * Generates the complete, zero-dependency, standalone single-file HTML application.
 * Updated with Karnataka India geographic feeds and the interactive Deep Learning
 * Backend Simulator multi-page architecture.
 */

export function getStandaloneHtmlCode(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Autonomous Vehicle Telematics & Cabin Safety System - Karnataka Edition</title>
  <!-- Chart.js Public CDN -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;700&family=JetBrains+Mono:wght@400;600;700&family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet">

  <style>
    :root {
      --bg-dark: #07090e;
      --panel-bg: rgba(11, 16, 28, 0.85);
      --cyan-neon: #00f0ff;
      --magenta-neon: #ff007f;
      --emerald-neon: #00ff88;
      --amber-neon: #ffaa00;
      --crimson-neon: #ff1e56;
      --purple-neon: #a855f7;
      --border-cyan: rgba(0, 240, 255, 0.3);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: var(--bg-dark);
      color: #e2e8f0;
      font-family: 'Space Grotesk', -apple-system, sans-serif;
      min-height: 100vh;
      overflow-x: hidden;
      background-image: 
        linear-gradient(rgba(0, 240, 255, 0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 240, 255, 0.04) 1px, transparent 1px),
        radial-gradient(circle at 50% 0%, rgba(0, 240, 255, 0.08) 0%, transparent 70%);
      background-size: 32px 32px, 32px 32px, 100% 100%;
    }

    /* Cyber Scanline Overlay */
    body::before {
      content: "";
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
                  linear-gradient(90deg, rgba(255, 0, 0, 0.02), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.02));
      background-size: 100% 4px, 6px 100%;
      pointer-events: none;
      z-index: 9999;
      opacity: 0.6;
    }

    .font-mono { font-family: 'JetBrains Mono', monospace; }
    .font-display { font-family: 'Chakra Petch', sans-serif; }

    .cyber-card {
      background: var(--panel-bg);
      border: 1px solid var(--border-cyan);
      border-radius: 12px;
      backdrop-filter: blur(12px);
      position: relative;
      padding: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    }

    .cyber-card::after {
      content: '';
      position: absolute;
      top: 0; right: 0;
      width: 8px; height: 8px;
      border-top: 2px solid var(--cyan-neon);
      border-right: 2px solid var(--cyan-neon);
      pointer-events: none;
    }

    .cyber-card::before {
      content: '';
      position: absolute;
      bottom: 0; left: 0;
      width: 8px; height: 8px;
      border-bottom: 2px solid var(--cyan-neon);
      border-left: 2px solid var(--cyan-neon);
      pointer-events: none;
    }

    .neon-text-cyan {
      text-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
      color: var(--cyan-neon);
    }

    .alert-breached {
      border: 2px solid var(--crimson-neon) !important;
      box-shadow: 0 0 35px rgba(255, 30, 86, 0.5) !important;
      animation: alertPulse 1s infinite alternate;
    }

    @keyframes alertPulse {
      0% { border-color: rgba(255, 30, 86, 0.6); }
      100% { border-color: rgba(255, 30, 86, 1); box-shadow: 0 0 40px rgba(255, 30, 86, 0.8); }
    }

    .header-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 14px 24px;
      background: #090e18;
      border-bottom: 1px solid var(--border-cyan);
    }

    .telemetry-ribbon {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 12px;
      padding: 12px 24px;
      background: #070c16;
      border-bottom: 1px solid rgba(0, 240, 255, 0.2);
    }

    .telemetry-pill {
      background: rgba(14, 22, 38, 0.7);
      border: 1px solid rgba(0, 240, 255, 0.2);
      border-radius: 8px;
      padding: 8px 12px;
    }

    .controls-bar {
      margin: 16px 24px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      background: #0b1120;
      border: 1px solid var(--border-cyan);
      border-radius: 12px;
      padding: 14px 20px;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(460px, 1fr));
      gap: 20px;
      padding: 0 24px 32px 24px;
    }

    @media (max-width: 640px) {
      .dashboard-grid { grid-template-columns: 1fr; padding: 0 12px 24px 12px; }
      .header-bar, .telemetry-ribbon, .controls-bar { padding: 12px; margin: 8px; }
    }

    button {
      cursor: pointer;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      padding: 8px 14px;
      border-radius: 6px;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .btn-cyber-primary {
      background: rgba(0, 240, 255, 0.15);
      border: 1px solid var(--cyan-neon);
      color: var(--cyan-neon);
    }
    .btn-cyber-primary:hover {
      background: rgba(0, 240, 255, 0.3);
      box-shadow: 0 0 15px rgba(0, 240, 255, 0.5);
    }

    .btn-attack {
      background: linear-gradient(135deg, #ef4444, #991b1b);
      border: 1px solid #f87171;
      color: #fff;
      box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
      animation: pulseAttack 2s infinite;
    }
    @keyframes pulseAttack {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.03); box-shadow: 0 0 30px rgba(239, 68, 68, 0.8); }
    }

    .btn-restore {
      background: linear-gradient(135deg, #10b981, #065f46);
      border: 1px solid #34d399;
      color: #fff;
    }

    .tab-btn {
      padding: 8px 16px;
      border-radius: 8px;
      border: none;
      font-size: 12px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.2s ease;
    }
    .tab-btn-active-telemetry {
      background: linear-gradient(135deg, #0284c7, #0369a1);
      color: #fff;
      box-shadow: 0 0 15px rgba(2, 132, 199, 0.6);
    }
    .tab-btn-active-simulator {
      background: linear-gradient(135deg, #9333ea, #db2777);
      color: #fff;
      box-shadow: 0 0 15px rgba(147, 51, 234, 0.6);
    }
    .tab-btn-inactive {
      background: transparent;
      color: #94a3b8;
    }
    .tab-btn-inactive:hover {
      color: #e2e8f0;
      background: rgba(255, 255, 255, 0.05);
    }
  </style>
</head>
<body>

  <!-- Critical Intrusion Banner -->
  <div id="intrusionBanner" style="display: none; background: #991b1b; color: white; padding: 10px 24px; font-weight: bold; border-bottom: 2px solid #ef4444;" class="font-mono">
    ⚠️ CRITICAL SYSTEM INTRUSION DETECTED - INITIATING EMERGENCY SAFETY PULLEVER (AUTOENCODER MSE EXCEEDED THRESHOLD θ=0.065)
  </div>

  <!-- Header with Page Navigation Tabs -->
  <header class="header-bar">
    <div style="display: flex; align-items: center; gap: 14px;">
      <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(0, 240, 255, 0.1); border: 1px solid var(--cyan-neon); display: flex; align-items: center; justify-content: center; font-size: 18px;">
        ⚡
      </div>
      <div>
        <h1 class="font-display" style="font-size: 17px; letter-spacing: 1px; color: #fff;">
          AUTONOMOUS VEHICLE TELEMATICS & CABIN SAFETY SYSTEM
        </h1>
        <div class="font-mono" style="font-size: 11px; color: #94a3b8;">
          Karnataka India Edition • Multi-Modal Deep Learning (CNN • LSTM • Deep ANN • Autoencoder)
        </div>
      </div>
    </div>

    <!-- Navigation Toggle Tabs -->
    <div style="display: flex; align-items: center; background: #070b14; padding: 4px; border-radius: 10px; border: 1px solid var(--border-cyan);">
      <button id="tabBtnTelemetry" class="tab-btn tab-btn-active-telemetry font-mono">
        📊 Live Operations Telemetry
      </button>
      <button id="tabBtnSimulator" class="tab-btn tab-btn-inactive font-mono">
        🧠 Deep Learning Backend Simulator
      </button>
    </div>

    <!-- Target Karnataka City Switcher -->
    <div style="display: flex; align-items: center; gap: 12px;">
      <div class="font-mono" style="font-size: 11px; display: flex; align-items: center; gap: 6px; background: #0c1424; padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-cyan);">
        <span style="width: 8px; height: 8px; border-radius: 50%; background: #00ff88; box-shadow: 0 0 8px #00ff88;"></span>
        <span style="color: #94a3b8;">Karnataka Stream:</span>
        <span id="streamStatusText" style="color: #00ff88; font-weight: bold;">LIVE</span>
      </div>

      <div class="font-mono" style="font-size: 11px; display: flex; align-items: center; gap: 6px;">
        <span style="color: #94a3b8;">City:</span>
        <select id="citySelect" style="background: #090e18; color: #00f0ff; border: 1px solid var(--border-cyan); border-radius: 6px; padding: 5px 8px; font-family: 'JetBrains Mono'; font-size: 11px; font-weight: bold;">
          <option value="Bengaluru" selected>Bengaluru (Capital)</option>
          <option value="Mysuru">Mysuru</option>
          <option value="Hubballi-Dharwad">Hubballi-Dharwad</option>
          <option value="Mangaluru">Mangaluru</option>
          <option value="Belagavi">Belagavi</option>
          <option value="Kalaburagi">Kalaburagi</option>
        </select>
      </div>

      <button id="btnToggleSound" class="btn-cyber-primary" style="padding: 6px 10px;">
        🔊 SFX ON
      </button>
    </div>
  </header>

  <!-- Live Public Environmental Telematics Ribbon -->
  <section class="telemetry-ribbon font-mono">
    <div class="telemetry-pill">
      <div style="font-size: 9px; color: #94a3b8; text-transform: uppercase;">Ambient Temperature</div>
      <div id="dispTemp" style="font-size: 14px; font-weight: bold; color: #fff;">27.2°C</div>
      <div id="dispWeatherDesc" style="font-size: 9px; color: #00f0ff;">Clear Sky / Dry Tropical</div>
    </div>
    <div class="telemetry-pill">
      <div style="font-size: 9px; color: #94a3b8; text-transform: uppercase;">Road Friction Coeff (μ)</div>
      <div id="dispFriction" style="font-size: 14px; font-weight: bold; color: #00ff88;">0.88 / 1.0</div>
      <div id="dispRoadCondition" style="font-size: 9px; color: #94a3b8;">Dry Asphalt (Grip High)</div>
    </div>
    <div class="telemetry-pill">
      <div style="font-size: 9px; color: #94a3b8; text-transform: uppercase;">Wind & Aero Drag Force</div>
      <div id="dispDrag" style="font-size: 14px; font-weight: bold; color: #fff;">245 N</div>
      <div id="dispWind" style="font-size: 9px; color: #00f0ff;">Wind: 13 km/h</div>
    </div>
    <div class="telemetry-pill">
      <div style="font-size: 9px; color: #94a3b8; text-transform: uppercase;">Optical Visibility</div>
      <div id="dispVisibility" style="font-size: 14px; font-weight: bold; color: #fff;">9.5 km</div>
      <div style="font-size: 9px; color: #00ff88;">Optimal Optics</div>
    </div>
    <div class="telemetry-pill">
      <div style="font-size: 9px; color: #94a3b8; text-transform: uppercase;">Air Density / Baro</div>
      <div id="dispAirDensity" style="font-size: 14px; font-weight: bold; color: #fff;">1.145 kg/m³</div>
      <div id="dispPressure" style="font-size: 9px; color: #94a3b8;">918 hPa (Plateau)</div>
    </div>
    <div class="telemetry-pill">
      <div style="font-size: 9px; color: #94a3b8; text-transform: uppercase;">Monsoonal Humidity</div>
      <div id="dispHumidity" style="font-size: 14px; font-weight: bold; color: #fff;">65%</div>
      <div id="dispPrecip" style="font-size: 9px; color: #00f0ff;">0.0 mm rain</div>
    </div>
  </section>

  <!-- Global Dashboard Controls -->
  <div class="controls-bar font-mono">
    <div style="display: flex; align-items: center; gap: 12px;">
      <button id="btnTogglePlay" class="btn-cyber-primary">
        ⏸️ PAUSE TELEMETRY
      </button>
      <button id="btnRefreshWeather" class="btn-cyber-primary">
        🔄 FETCH LIVE KARNATAKA DATA
      </button>
    </div>

    <!-- Sliders -->
    <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
      <div style="display: flex; flex-direction: column; width: 140px;">
        <div style="display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8;">
          <span>Speed</span>
          <span id="labelSpeed" style="color: #00f0ff; font-weight: bold;">75 km/h</span>
        </div>
        <input type="range" id="sliderSpeed" min="0" max="180" value="75" style="accent-color: #00f0ff;">
      </div>

      <div style="display: flex; flex-direction: column; width: 140px;">
        <div style="display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8;">
          <span>Payload</span>
          <span id="labelPayload" style="color: #00f0ff; font-weight: bold;">200 kg</span>
        </div>
        <input type="range" id="sliderPayload" min="0" max="600" value="200" style="accent-color: #00f0ff;">
      </div>

      <div style="display: flex; flex-direction: column; width: 120px;">
        <div style="display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8;">
          <span>Battery SoC</span>
          <span id="labelSoC" style="color: #00ff88; font-weight: bold;">80%</span>
        </div>
        <input type="range" id="sliderSoC" min="10" max="100" value="80" style="accent-color: #00ff88;">
      </div>
    </div>

    <!-- Cyber Attack Buttons -->
    <div style="display: flex; align-items: center; gap: 10px;">
      <button id="btnInjectAttack" class="btn-attack">
        💀 INJECT CYBER ATTACK
      </button>
      <button id="btnRestoreCan" class="btn-restore" style="display: none;">
        🛡️ RESTORE CAN NORMALCY
      </button>
    </div>
  </div>

  <!-- VIEW 1: LIVE OPERATIONS TELEMETRY -->
  <div id="viewTelemetry">
    <main class="dashboard-grid">

      <!-- MODULE 1: Perception Engine (CNN) -->
      <div class="cyber-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid rgba(0, 240, 255, 0.2); padding-bottom: 8px;">
          <div>
            <h2 class="font-display" style="font-size: 15px; color: #fff;">MODULE 1: PERCEPTION ENGINE</h2>
            <div class="font-mono" style="font-size: 10px; color: #00f0ff;">Topic: Convolutional Neural Networks (CNNs)</div>
          </div>
          <span class="font-mono" style="font-size: 10px; background: rgba(0, 240, 255, 0.1); border: 1px solid rgba(0, 240, 255, 0.4); padding: 2px 6px; border-radius: 4px; color: #00f0ff;">
            Conv2D + Softmax
          </span>
        </div>

        <div style="position: relative; width: 100%; aspect-ratio: 16/9; background: #000; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-cyan); margin-bottom: 12px;">
          <canvas id="dashcamCanvas" width="480" height="270" style="width: 100%; height: 100%; object-fit: cover;"></canvas>
          <div class="font-mono" style="position: absolute; top: 8px; right: 8px; font-size: 9px; background: rgba(0,0,0,0.7); border: 1px solid #00f0ff; color: #00f0ff; padding: 2px 6px; border-radius: 4px;">
            ● CNN DASHCAM FEED
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div style="background: rgba(9, 13, 22, 0.9); border: 1px solid rgba(0, 240, 255, 0.2); border-radius: 8px; padding: 10px;">
            <div class="font-mono" style="font-size: 10px; color: #e2e8f0; margin-bottom: 6px;">Feature Maps (Conv2D ReLU)</div>
            <div id="featureMapGrid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;"></div>
          </div>

          <div style="background: rgba(9, 13, 22, 0.9); border: 1px solid rgba(0, 240, 255, 0.2); border-radius: 8px; padding: 10px; display: flex; flex-direction: column;">
            <div class="font-mono" style="font-size: 10px; color: #e2e8f0; margin-bottom: 6px;">Softmax Classification P(y|x)</div>
            <div style="position: relative; flex-grow: 1; min-height: 120px;">
              <canvas id="softmaxChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- MODULE 2: Trajectory Predictor (RNNs / LSTMs) -->
      <div class="cyber-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid rgba(0, 240, 255, 0.2); padding-bottom: 8px;">
          <div>
            <h2 class="font-display" style="font-size: 15px; color: #fff;">MODULE 2: TRAJECTORY PREDICTOR</h2>
            <div class="font-mono" style="font-size: 10px; color: #00f0ff;">Topic: Recurrent Neural Networks (RNNs / LSTMs)</div>
          </div>
          <span class="font-mono" style="font-size: 10px; background: rgba(0, 240, 255, 0.1); border: 1px solid rgba(0, 240, 255, 0.4); padding: 2px 6px; border-radius: 4px; color: #00f0ff;">
            Recurrent Memory Rollout
          </span>
        </div>

        <div style="position: relative; width: 100%; aspect-ratio: 4/3; background: #000; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-cyan); margin-bottom: 12px;">
          <canvas id="radarCanvas" width="400" height="300" style="width: 100%; height: 100%; object-fit: cover;"></canvas>
          <div class="font-mono" style="position: absolute; top: 8px; left: 8px; font-size: 9px; background: rgba(0,0,0,0.7); border: 1px solid rgba(0,240,255,0.3); padding: 4px 8px; border-radius: 4px;">
            <div style="color: #00f0ff;">— Past 5s Coordinates [X,Y]</div>
            <div style="color: #00ff88;">- - LSTM Projected (+3.2s)</div>
          </div>
        </div>

        <div style="background: rgba(9, 13, 22, 0.9); border: 1px solid rgba(0, 240, 255, 0.2); border-radius: 8px; padding: 10px;" class="font-mono">
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
            <span style="color: #94a3b8;">Steering Angle (Yaw Ingress):</span>
            <span id="labelSteer" style="color: #00f0ff; font-weight: bold;">0°</span>
          </div>
          <input type="range" id="sliderSteer" min="-30" max="30" value="0" style="width: 100%; accent-color: #00f0ff; margin-bottom: 10px;">

          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; font-size: 9px; text-align: center;">
            <div style="background: rgba(0,0,0,0.5); padding: 4px; border-radius: 4px; border: 1px solid rgba(0,240,255,0.2);">
              <div style="color: #94a3b8;">Forget (f_t)</div>
              <div id="dispForgetGate" style="color: #00f0ff; font-weight: bold;">0.882</div>
            </div>
            <div style="background: rgba(0,0,0,0.5); padding: 4px; border-radius: 4px; border: 1px solid rgba(0,240,255,0.2);">
              <div style="color: #94a3b8;">Input (i_t)</div>
              <div id="dispInputGate" style="color: #00f0ff; font-weight: bold;">0.315</div>
            </div>
            <div style="background: rgba(0,0,0,0.5); padding: 4px; border-radius: 4px; border: 1px solid rgba(0,240,255,0.2);">
              <div style="color: #94a3b8;">Cell ||c_t||</div>
              <div id="dispCellNorm" style="color: #00ff88; font-weight: bold;">1.420</div>
            </div>
            <div style="background: rgba(0,0,0,0.5); padding: 4px; border-radius: 4px; border: 1px solid rgba(0,240,255,0.2);">
              <div style="color: #94a3b8;">Gradient Flow</div>
              <div style="color: #00ff88; font-weight: bold;">PRESERVED</div>
            </div>
          </div>
        </div>
      </div>

      <!-- MODULE 3: Battery Optimizer (Deep ANNs) -->
      <div class="cyber-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid rgba(0, 240, 255, 0.2); padding-bottom: 8px;">
          <div>
            <h2 class="font-display" style="font-size: 15px; color: #fff;">MODULE 3: BATTERY OPTIMIZER</h2>
            <div class="font-mono" style="font-size: 10px; color: #00f0ff;">Topic: Deep Artificial Neural Networks (ANNs / MLP)</div>
          </div>
          <span class="font-mono" style="font-size: 10px; background: rgba(0, 240, 255, 0.1); border: 1px solid rgba(0, 240, 255, 0.4); padding: 2px 6px; border-radius: 4px; color: #00f0ff;">
            ReLU Feedforward
          </span>
        </div>

        <div style="background: #000; border-radius: 8px; border: 1px solid var(--border-cyan); padding: 10px; margin-bottom: 12px; height: 160px; display: flex; align-items: center; justify-content: center;">
          <svg id="mlpSvg" viewBox="0 0 460 140" style="width: 100%; height: 100%;"></svg>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;" class="font-mono">
          <div style="background: rgba(9, 13, 22, 0.9); border: 1px solid rgba(0, 240, 255, 0.2); border-radius: 8px; padding: 10px;">
            <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase;">Predicted Remaining Range</div>
            <div id="dispPredictedRange" class="neon-text-cyan" style="font-size: 24px; font-weight: bold;">
              392 km
            </div>
            <div style="font-size: 9px; color: #94a3b8;">78 kWh Pack • Karnataka Weather Matrix</div>
          </div>

          <div style="background: rgba(9, 13, 22, 0.9); border: 1px solid rgba(0, 240, 255, 0.2); border-radius: 8px; padding: 10px;">
            <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase;">Energy Consumption</div>
            <div id="dispEnergyConsumption" style="font-size: 24px; font-weight: bold; color: #00ff88;">
              168 Wh/km
            </div>
            <div id="dispEfficiencyGrade" style="font-size: 9px; color: #00ff88;">Efficiency: A+ (Optimal)</div>
          </div>
        </div>
      </div>

      <!-- MODULE 4: Intrusion Guard (Autoencoders) -->
      <div id="module4Card" class="cyber-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid rgba(0, 240, 255, 0.2); padding-bottom: 8px;">
          <div>
            <h2 class="font-display" style="font-size: 15px; color: #fff;">MODULE 4: INTRUSION GUARD</h2>
            <div class="font-mono" style="font-size: 10px; color: #00f0ff;">Topic: Autoencoders (Anomaly Detection)</div>
          </div>
          <span id="firewallBadge" class="font-mono" style="font-size: 10px; background: rgba(0, 255, 136, 0.1); border: 1px solid #00ff88; padding: 2px 6px; border-radius: 4px; color: #00ff88;">
            FIREWALL NOMINAL
          </span>
        </div>

        <div style="background: rgba(9, 13, 22, 0.9); border: 1px solid rgba(0, 240, 255, 0.2); border-radius: 8px; padding: 10px; margin-bottom: 12px;" class="font-mono">
          <div style="display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; margin-bottom: 6px;">
            <span>Encoder (8D → 4D) → Bottleneck (2D) → Decoder (4D → 8D)</span>
            <span id="latentSpaceReadout" style="color: #00f0ff;">z = [0.12, -0.45]</span>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; text-align: center; font-size: 9px;">
            <div style="background: rgba(0,0,0,0.6); padding: 6px; border-radius: 4px; border: 1px solid var(--border-cyan); width: 18%;">
              <div style="color: #00f0ff; font-weight: bold;">INPUTS</div>
              <div>8 Features</div>
            </div>
            <span style="color: #00f0ff;">→</span>
            <div style="background: rgba(0,0,0,0.6); padding: 6px; border-radius: 4px; border: 1px solid #9333ea; width: 18%;">
              <div style="color: #c084fc; font-weight: bold;">ENCODER</div>
              <div>4 Neurons</div>
            </div>
            <span style="color: #00f0ff;">→</span>
            <div style="background: rgba(0, 240, 255, 0.15); padding: 6px; border-radius: 4px; border: 1px solid #00f0ff; width: 22%;">
              <div style="color: #00f0ff; font-weight: bold;">LATENT z</div>
              <div>Bottleneck 2D</div>
            </div>
            <span style="color: #00f0ff;">→</span>
            <div style="background: rgba(0,0,0,0.6); padding: 6px; border-radius: 4px; border: 1px solid #9333ea; width: 18%;">
              <div style="color: #c084fc; font-weight: bold;">DECODER</div>
              <div>4 Neurons</div>
            </div>
            <span style="color: #00f0ff;">→</span>
            <div style="background: rgba(0,0,0,0.6); padding: 6px; border-radius: 4px; border: 1px solid #00ff88; width: 18%;">
              <div style="color: #00ff88; font-weight: bold;">RECON x̂</div>
              <div>8 Targets</div>
            </div>
          </div>
        </div>

        <div style="background: rgba(9, 13, 22, 0.9); border: 1px solid rgba(0, 240, 255, 0.2); border-radius: 8px; padding: 10px; display: flex; flex-direction: column;">
          <div class="font-mono" style="display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 6px;">
            <span style="color: #e2e8f0;">Reconstruction Error (MSE) vs Threshold (θ = 0.065)</span>
            <span id="labelCurrentMse" style="color: #00ff88; font-weight: bold;">MSE: 0.0165</span>
          </div>
          <div style="position: relative; height: 130px;">
            <canvas id="mseChart"></canvas>
          </div>
        </div>
      </div>

    </main>
  </div>

  <!-- VIEW 2: DEEP LEARNING BACKEND SIMULATOR -->
  <div id="viewSimulator" style="display: none; padding: 0 24px 32px 24px;">
    
    <!-- Flowchart Banner -->
    <div class="cyber-card" style="margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0,240,255,0.2); padding-bottom: 8px; margin-bottom: 12px;">
        <h2 class="font-display" style="font-size: 16px; color: #fff;">
          ⚡ END-TO-END TELEMATICS DATA PIPELINE FLOWCHART
        </h2>
        <span class="font-mono" style="font-size: 10px; background: rgba(0,240,255,0.1); border: 1px solid #00f0ff; color: #00f0ff; padding: 2px 6px; border-radius: 4px;">
          Open-Meteo &rarr; Parallel Ingestion Tensors
        </span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;" class="font-mono">
        <div style="background: #0b1220; padding: 12px; border-radius: 8px; border: 1px solid rgba(0,240,255,0.3);">
          <div style="color: #00f0ff; font-weight: bold; font-size: 11px;">1. INGESTION</div>
          <div style="color: #fff; font-size: 12px; margin: 4px 0;">Karnataka Public API</div>
          <div style="color: #94a3b8; font-size: 9px;">JSON payload parsed into temperature, friction, wind, humidity, pressure.</div>
        </div>
        <div style="background: #0b1220; padding: 12px; border-radius: 8px; border: 1px solid rgba(168,85,247,0.3);">
          <div style="color: #c084fc; font-weight: bold; font-size: 11px;">2. NORMALIZATION</div>
          <div style="color: #fff; font-size: 12px; margin: 4px 0;">Domain Transforms</div>
          <div style="color: #94a3b8; font-size: 9px;">Features normalized to [-1, 1]. Aerodynamic drag computed with air density &rho;.</div>
        </div>
        <div style="background: #0b1220; padding: 12px; border-radius: 8px; border: 1px solid rgba(0,255,136,0.3);">
          <div style="color: #00ff88; font-weight: bold; font-size: 11px;">3. DL DISTRIBUTION</div>
          <div style="color: #fff; font-size: 12px; margin: 4px 0;">Parallel Tensor Feed</div>
          <div style="color: #94a3b8; font-size: 9px;">CNN: Image matrix • LSTM: Ego motion [X,Y] • ANN: MLP tabular • AE: CAN-bus vector.</div>
        </div>
      </div>
    </div>

    <!-- 4 Mathematical Breakdown Cards -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(460px, 1fr)); gap: 20px;">
      
      <!-- Math 1: CNN -->
      <div class="cyber-card">
        <div style="border-bottom: 1px solid rgba(0,240,255,0.2); padding-bottom: 8px; margin-bottom: 12px;">
          <h3 class="font-display" style="font-size: 14px; color: #fff;">1. CNN CONVOLUTION REDUCTION MATH</h3>
          <div class="font-mono" style="font-size: 10px; color: #00f0ff;">Feature Map Cell = ReLU( &Sigma; Pixel_ij &times; Filter_ij )</div>
        </div>
        <p class="font-mono" style="font-size: 11px; color: #94a3b8; margin-bottom: 10px;">
          Sliding 3&times;3 edge-detection kernel computes local dot products, detecting highway lanes and obstacles:
        </p>
        <div style="background: #090d16; padding: 10px; border-radius: 8px; border: 1px solid rgba(0,240,255,0.2); margin-bottom: 10px;" class="font-mono text-xs">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="color: #00f0ff;">Sobel Vertical Kernel [3x3]:</span>
            <span style="color: #00ff88;">[[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]</span>
          </div>
          <div style="background: #000; padding: 8px; border-radius: 6px; font-size: 10px; color: #e2e8f0; line-height: 1.6;">
            &Sigma; = (0.12 &times; -1) + (0.18 &times; 0) + (0.88 &times; 1) + ... = <span style="color: #00f0ff; font-weight: bold;">+1.428</span><br>
            Output after ReLU max(0, &Sigma;) = <span style="color: #00ff88; font-weight: bold;">1.428</span>
          </div>
        </div>
      </div>

      <!-- Math 2: LSTM -->
      <div class="cyber-card">
        <div style="border-bottom: 1px solid rgba(0,240,255,0.2); padding-bottom: 8px; margin-bottom: 12px;">
          <h3 class="font-display" style="font-size: 14px; color: #fff;">2. LSTM RECURRENT GATING MECHANICS</h3>
          <div class="font-mono" style="font-size: 10px; color: #00ff88;">Constant Error Carousel (Solves Vanishing Gradients)</div>
        </div>
        <div class="font-mono" style="font-size: 10px; background: #090d16; padding: 10px; border-radius: 8px; border: 1px solid rgba(0,255,136,0.2); line-height: 1.8;">
          <div><b style="color: #00f0ff;">Forget Gate:</b> f_t = &sigma;(W_f &middot; [h_t-1, x_t] + b_f) = <span id="simForgetVal" style="color: #00f0ff;">0.882</span></div>
          <div><b style="color: #00f0ff;">Input Gate:</b> i_t = &sigma;(W_i &middot; [h_t-1, x_t] + b_i) = <span id="simInputVal" style="color: #00f0ff;">0.315</span></div>
          <div><b style="color: #c084fc;">Candidate:</b> c̃_t = tanh(W_c &middot; [h_t-1, x_t] + b_c) = <span style="color: #c084fc;">0.412</span></div>
          <div><b style="color: #00ff88;">Cell Update:</b> c_t = f_t &odot; c_t-1 + i_t &odot; c̃_t = <span id="simCellVal" style="color: #00ff88; font-weight: bold;">1.420</span></div>
          <div style="color: #94a3b8; font-size: 9px; margin-top: 4px;">Additive c_t update guarantees gradient flow across 50 temporal cycles.</div>
        </div>
      </div>

      <!-- Math 3: Deep ANN -->
      <div class="cyber-card">
        <div style="border-bottom: 1px solid rgba(0,240,255,0.2); padding-bottom: 8px; margin-bottom: 12px;">
          <h3 class="font-display" style="font-size: 14px; color: #fff;">3. DEEP ANN MATRIX MULTIPLICATION</h3>
          <div class="font-mono" style="font-size: 10px; color: #c084fc;">Y = &sigma;( W &middot; X + B ) with Layer-wise ReLU</div>
        </div>
        <div class="font-mono" style="font-size: 10px; background: #090d16; padding: 10px; border-radius: 8px; border: 1px solid rgba(168,85,247,0.2); line-height: 1.8;">
          <div style="color: #94a3b8;">Input Vector X &isin; &Ropf;&sup7;:</div>
          <div id="simAnnInputVec" style="color: #00f0ff; background: #000; padding: 4px 6px; border-radius: 4px; overflow-x: auto; margin: 4px 0;">[0.24, 0.65, 0.22, 0.88, 0.62, 0.40, 0.80]</div>
          <div style="color: #94a3b8;">H1 = max(0, W1 &middot; X + b1) &isin; &Ropf;&sup6; | H2 = max(0, W2 &middot; H1 + b2) &isin; &Ropf;&sup4;</div>
          <div style="color: #00ff88; font-weight: bold; margin-top: 4px;">Computed Remaining Range: <span id="simAnnRangeVal">392 km</span> | Consumption: <span id="simAnnWhVal">168 Wh/km</span></div>
        </div>
      </div>

      <!-- Math 4: Autoencoder -->
      <div class="cyber-card">
        <div style="border-bottom: 1px solid rgba(0,240,255,0.2); padding-bottom: 8px; margin-bottom: 12px;">
          <h3 class="font-display" style="font-size: 14px; color: #fff;">4. AUTOENCODER MSE ANOMALY MATH</h3>
          <div class="font-mono" style="font-size: 10px; color: #ff1e56;">MSE = (1/n) &Sigma; (Input_i - Reconstructed_i)&sup2;</div>
        </div>
        <div class="font-mono" style="font-size: 10px; background: #090d16; padding: 10px; border-radius: 8px; border: 1px solid rgba(255,30,86,0.3); line-height: 1.8;">
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #94a3b8;">Threshold: &theta; = 0.065</span>
            <span id="simMseVal" style="color: #00ff88; font-weight: bold;">Current MSE: 0.0162 (NOMINAL)</span>
          </div>
          <div style="margin-top: 4px; color: #94a3b8;">Side-by-side array delta:</div>
          <div id="simAeDeltas" style="color: #00ff88; background: #000; padding: 4px 6px; border-radius: 4px; overflow-x: auto; margin: 4px 0;">&Delta;&sup2; = [0.002, 0.001, 0.003, 0.001, 0.002, 0.001, 0.003, 0.002]</div>
          <div style="color: #94a3b8; font-size: 9px;">Click 'Inject Cyber Attack' above to see MSE delta spike past &theta;=0.065.</div>
        </div>
      </div>

    </div>
  </div>

  <!-- Complete Vanilla JavaScript Logic -->
  <script>
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;
    let isSoundEnabled = true;

    function getAudioCtx() {
      if (!audioCtx && AudioCtx) audioCtx = new AudioCtx();
      if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
      return audioCtx;
    }

    function playSiren() {
      if (!isSoundEnabled) return;
      try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.linearRampToValueAtTime(950, now + 0.25);
        osc.frequency.linearRampToValueAtTime(450, now + 0.5);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
      } catch (e) {}
    }

    /* KARNATAKA INDIA CITIES TELEMETRY TARGETS */
    const KARNATAKA_COORDS = {
      'Bengaluru': { lat: 12.9716, lon: 77.5946, tz: 'Asia/Kolkata', tag: 'Deccan Plateau Tech Corridor (Elev. 920m)' },
      'Mysuru': { lat: 12.2958, lon: 76.6394, tz: 'Asia/Kolkata', tag: 'Chamundi Foothills Sub-Tropical' },
      'Hubballi-Dharwad': { lat: 15.3647, lon: 75.1240, tz: 'Asia/Kolkata', tag: 'North Karnataka Industrial Hub' },
      'Mangaluru': { lat: 12.9141, lon: 74.8560, tz: 'Asia/Kolkata', tag: 'Arabian Sea Coastal / Heavy Monsoon Belt' },
      'Belagavi': { lat: 15.8497, lon: 74.4977, tz: 'Asia/Kolkata', tag: 'Western Ghats Borderland Highland Mist' },
      'Kalaburagi': { lat: 17.3297, lon: 76.8343, tz: 'Asia/Kolkata', tag: 'Kalyana-Karnataka Tropical Heat Zone' }
    };

    let currentCity = 'Bengaluru';
    let isStreaming = true;
    let isCyberAttack = false;

    let telemetryState = {
      temperature: 27.2,
      humidity: 65,
      windSpeed: 13,
      pressure: 918,
      precipitation: 0,
      frictionCoefficient: 0.88,
      roadCondition: 'Dry Asphalt (High Grip)',
      weatherDesc: 'Clear Sky / Dry Tropical',
      airDensity: 1.145,
      aerodynamicDrag: 245,
      speedKmh: 75,
      payloadKg: 200,
      socPct: 80,
      steeringAngle: 0,
      cnnConfidence: 0.94
    };

    async function fetchLiveWeather() {
      const geo = KARNATAKA_COORDS[currentCity] || KARNATAKA_COORDS['Bengaluru'];
      const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + geo.lat + '&longitude=' + geo.lon + '&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m&timezone=' + encodeURIComponent(geo.tz);

      try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        const data = await resp.json();
        const cur = data.current || {};

        const temp = typeof cur.temperature_2m === 'number' ? cur.temperature_2m : 26.5;
        const hum = typeof cur.relative_humidity_2m === 'number' ? cur.relative_humidity_2m : 68;
        const wind = typeof cur.wind_speed_10m === 'number' ? cur.wind_speed_10m : 11.5;
        const press = typeof cur.surface_pressure === 'number' ? cur.surface_pressure : (currentCity === 'Bengaluru' ? 918 : 1008);
        const precip = typeof cur.precipitation === 'number' ? cur.precipitation : 0;
        const wCode = typeof cur.weather_code === 'number' ? cur.weather_code : 1;

        let friction = 0.88;
        let roadCond = 'Dry Asphalt (High Grip)';
        let desc = 'Clear Sky / Dry Tropical';
        const isCoastal = currentCity === 'Mangaluru' || currentCity === 'Belagavi';

        if (wCode === 0) { desc = 'Clear Sky / Dry Tropical'; friction = 0.88; roadCond = 'Dry Asphalt (High Grip)'; }
        else if (wCode <= 3) { desc = 'Mainly Clear / Tropical Scatters'; friction = 0.85; roadCond = 'Dry Asphalt (Optimal Grip)'; }
        else if (wCode === 45 || wCode === 48) { desc = 'Ghats Morning Fog / Mist'; friction = 0.66; roadCond = 'Damp Slick Roadway'; }
        else if (wCode >= 51 && wCode <= 55) { desc = 'Monsoon Drizzle'; friction = 0.58; roadCond = 'Wet Tarmac / Surface Sheen'; }
        else if (wCode >= 61 && wCode <= 65) { 
          desc = isCoastal ? 'Heavy Coastal Downpour' : 'Southwest Monsoon Rain'; 
          friction = isCoastal ? 0.42 : 0.48; 
          roadCond = isCoastal ? 'Severe Hydroplaning Risk' : 'Wet Road / Reduced Grip'; 
        }
        else if (wCode >= 71 && wCode <= 77) { desc = 'Pre-Monsoon Squall'; friction = 0.35; roadCond = 'Hazardous Roadway'; }
        else if (wCode >= 80 && wCode <= 82) { desc = 'Tropical Cloudburst'; friction = 0.45; roadCond = 'Slick Water Ponding'; }
        else if (wCode >= 85) { desc = 'Torrential Ghats Storm'; friction = 0.38; roadCond = 'Torrential Runoff'; }

        const tKelvin = temp + 273.15;
        const airDensity = Number(( (press * 100) / (287.05 * tKelvin) ).toFixed(3));
        const vMs = telemetryState.speedKmh / 3.6;
        const vRel = vMs + (wind * 0.4) / 3.6;
        const aeroDrag = Math.round(0.5 * airDensity * 0.23 * 2.2 * Math.pow(vRel, 2));

        telemetryState.temperature = temp;
        telemetryState.humidity = hum;
        telemetryState.windSpeed = wind;
        telemetryState.pressure = press;
        telemetryState.precipitation = precip;
        telemetryState.frictionCoefficient = friction;
        telemetryState.roadCondition = roadCond;
        telemetryState.weatherDesc = desc;
        telemetryState.airDensity = airDensity;
        telemetryState.aerodynamicDrag = aeroDrag;

        updateRibbonUI();
      } catch (err) {
        console.warn('Karnataka weather fetch warning:', err);
      }
    }

    function updateRibbonUI() {
      document.getElementById('dispTemp').innerText = telemetryState.temperature.toFixed(1) + '°C';
      document.getElementById('dispWeatherDesc').innerText = telemetryState.weatherDesc;
      document.getElementById('dispFriction').innerText = telemetryState.frictionCoefficient.toFixed(2) + ' / 1.0';
      document.getElementById('dispRoadCondition').innerText = telemetryState.roadCondition;
      document.getElementById('dispDrag').innerText = telemetryState.aerodynamicDrag + ' N';
      document.getElementById('dispWind').innerText = 'Wind: ' + telemetryState.windSpeed.toFixed(1) + ' km/h';
      document.getElementById('dispAirDensity').innerText = telemetryState.airDensity + ' kg/m³';
      document.getElementById('dispPressure').innerText = telemetryState.pressure.toFixed(0) + ' hPa';
      document.getElementById('dispHumidity').innerText = telemetryState.humidity + '%';
      document.getElementById('dispPrecip').innerText = telemetryState.precipitation.toFixed(1) + ' mm rain';
    }

    /* MODULE 1: CNN */
    const dashcamCanvas = document.getElementById('dashcamCanvas');
    const dashCtx = dashcamCanvas.getContext('2d');
    let dashFrame = 0;
    let roadOffset = 0;
    let obstacleDist = 48;

    const KERNELS = {
      sobelY: [[-1, -2, -1], [0, 0, 0], [1, 2, 1]],
      sobelX: [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]
    };

    function convolve2D(matrix, kernel) {
      const out = [];
      for (let r = 0; r < 8; r++) {
        const row = [];
        for (let c = 0; c < 8; c++) {
          let s = 0;
          for (let kr = 0; kr < 3; kr++) {
            for (let kc = 0; kc < 3; kc++) {
              const ir = r + kr - 1;
              const ic = c + kc - 1;
              const v = (ir >= 0 && ir < 8 && ic >= 0 && ic < 8) ? matrix[ir][ic] : 0;
              s += v * kernel[kr][kc];
            }
          }
          row.push(Math.max(0, s));
        }
        out.push(row);
      }
      return out;
    }

    function softmax(logits) {
      const max = Math.max(...logits);
      const exps = logits.map(z => Math.exp(z - max));
      const sum = exps.reduce((a, b) => a + b, 0);
      return exps.map(e => e / sum);
    }

    const softmaxCtx = document.getElementById('softmaxChart').getContext('2d');
    const softmaxChart = new Chart(softmaxCtx, {
      type: 'bar',
      data: {
        labels: ['Clear Lane', 'Obstacle Ahead', 'Speed Sign', 'Pedestrian', 'Hazard Stop'],
        datasets: [{
          data: [0.85, 0.10, 0.03, 0.01, 0.01],
          backgroundColor: ['#00f0ff', '#ffaa00', '#9333ea', '#ec4899', '#ff1e56'],
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { min: 0, max: 1, ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 9 }, callback: v => Math.round(v * 100) + '%' } },
          y: { ticks: { color: '#e2e8f0', font: { family: 'Space Grotesk', size: 10 } } }
        }
      }
    });

    function drawDashcam() {
      if (isStreaming) {
        dashFrame++;
        roadOffset = (roadOffset + Math.max(1, telemetryState.speedKmh / 20)) % 40;
        obstacleDist = 30 + Math.sin(dashFrame * 0.03) * 20;
      }

      const w = dashcamCanvas.width;
      const h = dashcamCanvas.height;

      const sky = dashCtx.createLinearGradient(0, 0, 0, h * 0.5);
      sky.addColorStop(0, '#030712');
      sky.addColorStop(1, '#0b1933');
      dashCtx.fillStyle = sky;
      dashCtx.fillRect(0, 0, w, h * 0.5);

      const road = dashCtx.createLinearGradient(0, h * 0.5, 0, h);
      road.addColorStop(0, '#111827');
      road.addColorStop(1, '#070b14');
      dashCtx.fillStyle = road;
      dashCtx.fillRect(0, h * 0.5, w, h * 0.5);

      dashCtx.strokeStyle = '#00f0ff';
      dashCtx.lineWidth = 2;
      dashCtx.setLineDash([12, 14]);
      dashCtx.lineDashOffset = -roadOffset;
      dashCtx.beginPath();
      dashCtx.moveTo(w * 0.5, h * 0.5);
      dashCtx.lineTo(w * 0.3, h);
      dashCtx.moveTo(w * 0.5, h * 0.5);
      dashCtx.lineTo(w * 0.7, h);
      dashCtx.stroke();
      dashCtx.setLineDash([]);

      const scale = Math.max(0.2, 1 - (obstacleDist / 80));
      const carW = 100 * scale;
      const carH = 60 * scale;
      const carX = w * 0.5 - carW * 0.5;
      const carY = h * 0.5 + (h * 0.5) * (1 - (obstacleDist / 80)) - carH;

      dashCtx.fillStyle = '#1e293b';
      dashCtx.strokeStyle = '#38bdf8';
      dashCtx.lineWidth = 1.5;
      dashCtx.fillRect(carX, carY, carW, carH);
      dashCtx.strokeRect(carX, carY, carW, carH);

      dashCtx.strokeStyle = obstacleDist < 25 ? '#ff1e56' : '#00f0ff';
      dashCtx.lineWidth = 2;
      dashCtx.strokeRect(carX - 4, carY - 4, carW + 8, carH + 8);

      dashCtx.fillStyle = '#00f0ff';
      dashCtx.font = '9px "JetBrains Mono"';
      dashCtx.fillText('OBJ#KA-01 | ' + obstacleDist.toFixed(1) + 'm', carX, carY - 8);

      if (dashFrame % 10 === 0) {
        let logits = [3.5, 0.4, 0.2, 0.1, 0.05];
        if (obstacleDist < 22) logits = [0.1, 1.5, 0.1, 0.2, 4.2];
        else if (obstacleDist < 40) logits = [0.4, 3.8, 0.2, 0.3, 0.8];
        const probs = softmax(logits);
        softmaxChart.data.datasets[0].data = probs;
        softmaxChart.update('none');
        telemetryState.cnnConfidence = probs[0];
      }

      requestAnimationFrame(drawDashcam);
    }
    requestAnimationFrame(drawDashcam);

    function renderFeatureMapUI() {
      const grid = document.getElementById('featureMapGrid');
      grid.innerHTML = '';
      const dummyInput = Array.from({length: 8}, () => Array.from({length: 8}, () => Math.random()));
      const map1 = convolve2D(dummyInput, KERNELS.sobelY);
      const map2 = convolve2D(dummyInput, KERNELS.sobelX);

      [ { name: 'Sobel dY (Horiz)', data: map1 }, { name: 'Sobel dX (Vert)', data: map2 } ].forEach(m => {
        const wrap = document.createElement('div');
        wrap.style.textAlign = 'center';
        wrap.innerHTML = '<div style="font-size: 8px; color: #00f0ff; margin-bottom: 2px;">' + m.name + '</div>';
        const mini = document.createElement('div');
        mini.style.display = 'grid';
        mini.style.gridTemplateColumns = 'repeat(8, 1fr)';
        mini.style.gap = '1px';
        mini.style.background = '#000';
        mini.style.padding = '2px';
        m.data.flat().forEach(val => {
          const cell = document.createElement('div');
          cell.style.width = '8px';
          cell.style.height = '8px';
          cell.style.background = 'rgba(0, 240, 255, ' + Math.min(1, Math.max(0.1, val)) + ')';
          mini.appendChild(cell);
        });
        wrap.appendChild(mini);
        grid.appendChild(wrap);
      });
    }
    renderFeatureMapUI();

    /* MODULE 2: LSTM TRAJECTORY */
    const radarCanvas = document.getElementById('radarCanvas');
    const radCtx = radarCanvas.getContext('2d');
    let historyCoords = [];

    function updateLstmTrajectory() {
      const speedMs = telemetryState.speedKmh / 3.6;
      const turnRad = (telemetryState.steeringAngle * Math.PI) / 180 * 0.4;
      
      const last = historyCoords[historyCoords.length - 1] || { x: 0, y: 0 };
      const nextX = last.x + Math.sin(turnRad) * (speedMs * 0.1);
      const nextY = last.y + Math.cos(turnRad) * (speedMs * 0.1);
      historyCoords.push({ x: nextX, y: nextY });
      if (historyCoords.length > 50) historyCoords.shift();

      const f_t = 0.85 + Math.cos(Date.now() / 1000) * 0.05;
      const i_t = 0.32 + Math.sin(Date.now() / 1000) * 0.04;
      document.getElementById('dispForgetGate').innerText = f_t.toFixed(3);
      document.getElementById('dispInputGate').innerText = i_t.toFixed(3);
      document.getElementById('simForgetVal').innerText = f_t.toFixed(3);
      document.getElementById('simInputVal').innerText = i_t.toFixed(3);

      const w = radarCanvas.width;
      const h = radarCanvas.height;
      const cx = w * 0.5;
      const cy = h * 0.75;

      radCtx.fillStyle = '#060a12';
      radCtx.fillRect(0, 0, w, h);

      radCtx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
      [40, 80, 120, 160].forEach(r => {
        radCtx.beginPath();
        radCtx.arc(cx, cy, r, 0, Math.PI * 2);
        radCtx.stroke();
      });

      if (historyCoords.length > 1) {
        radCtx.strokeStyle = '#00f0ff';
        radCtx.lineWidth = 2.5;
        radCtx.beginPath();
        historyCoords.forEach((p, idx) => {
          const rx = cx + (p.x - nextX) * 4;
          const ry = cy - (p.y - nextY) * 4;
          if (idx === 0) radCtx.moveTo(rx, ry);
          else radCtx.lineTo(rx, ry);
        });
        radCtx.stroke();
      }

      radCtx.strokeStyle = '#00ff88';
      radCtx.lineWidth = 2;
      radCtx.setLineDash([4, 6]);
      radCtx.beginPath();
      radCtx.moveTo(cx, cy);
      let fx = cx;
      let fy = cy;
      for (let s = 1; s <= 14; s++) {
        fx += Math.sin(turnRad) * 6;
        fy -= 7;
        radCtx.lineTo(fx, fy);
      }
      radCtx.stroke();
      radCtx.setLineDash([]);

      radCtx.fillStyle = '#00f0ff';
      radCtx.beginPath();
      radCtx.moveTo(cx, cy - 12);
      radCtx.lineTo(cx + 8, cy + 8);
      radCtx.lineTo(cx, cy + 4);
      radCtx.lineTo(cx - 8, cy + 8);
      radCtx.closePath();
      radCtx.fill();
    }
    setInterval(updateLstmTrajectory, 100);

    /* MODULE 3: DEEP ANN (MLP) */
    function runAnnBatteryInference() {
      const T = telemetryState.temperature;
      const v = telemetryState.speedKmh;
      const payload = telemetryState.payloadKg;
      const soc = telemetryState.socPct;
      const wind = telemetryState.windSpeed;

      const tempEff = Math.exp(-Math.pow(T - 25.0, 2) / 400);
      const aeroPenalty = Math.pow(v / 80, 1.85);
      const weightPenalty = 1 + (payload / 1800);

      const baseMaxRange = 465;
      const range = Math.max(10, Math.round(
        baseMaxRange * (soc / 100) * (0.6 + 0.4 * tempEff) / (0.6 + 0.25 * aeroPenalty + 0.15 * weightPenalty)
      ));

      const whPerKm = Math.round(140 + (v * 0.72) + (payload * 0.05) + (wind * 0.4) + ((1 - tempEff) * 35));

      document.getElementById('dispPredictedRange').innerText = range + ' km';
      document.getElementById('dispEnergyConsumption').innerText = whPerKm + ' Wh/km';
      document.getElementById('dispEfficiencyGrade').innerText = whPerKm < 170 ? 'Efficiency: A+ (Optimal)' : 'Efficiency: B (Nominal)';
      document.getElementById('simAnnRangeVal').innerText = range + ' km';
      document.getElementById('simAnnWhVal').innerText = whPerKm + ' Wh/km';

      // Update simulator input vector display
      const inputArr = [
        ((T - 25) / 30).toFixed(2),
        (telemetryState.humidity / 100).toFixed(2),
        (wind / 60).toFixed(2),
        telemetryState.frictionCoefficient.toFixed(2),
        (v / 120).toFixed(2),
        (payload / 500).toFixed(2),
        (soc / 100).toFixed(2)
      ];
      document.getElementById('simAnnInputVec').innerText = '[' + inputArr.join(', ') + ']';
    }

    function renderMlpSvg() {
      const svg = document.getElementById('mlpSvg');
      svg.innerHTML = '<defs><filter id="glow"><feGaussianBlur stdDeviation="2" result="c"/><feMerge><feMergeNode in="c"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>';

      const layers = [7, 5, 3, 2];
      const xs = [50, 170, 290, 400];

      for (let l = 0; l < layers.length - 1; l++) {
        for (let i = 0; i < layers[l]; i++) {
          for (let j = 0; j < layers[l+1]; j++) {
            const y1 = 15 + i * 16;
            const y2 = 25 + j * 24;
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', xs[l]);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', xs[l+1]);
            line.setAttribute('y2', y2);
            line.setAttribute('stroke', 'rgba(0, 240, 255, 0.18)');
            line.setAttribute('stroke-width', '1');
            svg.appendChild(line);
          }
        }
      }

      layers.forEach((cnt, l) => {
        for (let i = 0; i < cnt; i++) {
          const y = (l === 0 ? 15 : 25) + i * (l === 0 ? 16 : 24);
          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttribute('cx', xs[l]);
          circle.setAttribute('cy', y);
          circle.setAttribute('r', '5');
          circle.setAttribute('fill', l === 0 ? '#00f0ff' : l === 3 ? '#ff007f' : '#00ff88');
          circle.setAttribute('filter', 'url(#glow)');
          svg.appendChild(circle);
        }
      });
    }
    renderMlpSvg();

    /* MODULE 4: AUTOENCODER INTRUSION GUARD */
    const mseCtx = document.getElementById('mseChart').getContext('2d');
    const mseHistory = Array(25).fill(0.016);

    const mseChart = new Chart(mseCtx, {
      type: 'line',
      data: {
        labels: Array(25).fill(''),
        datasets: [
          {
            label: 'Reconstruction Error (MSE)',
            data: mseHistory,
            borderColor: '#00ff88',
            backgroundColor: 'rgba(0, 255, 136, 0.1)',
            fill: true,
            tension: 0.3,
            borderWidth: 2
          },
          {
            label: 'Safety Threshold (θ=0.065)',
            data: Array(25).fill(0.065),
            borderColor: '#ff1e56',
            borderDash: [5, 5],
            borderWidth: 1.5,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 0 },
        plugins: { legend: { display: false } },
        scales: {
          x: { display: false },
          y: { min: 0, max: 0.25, ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 9 } } }
        }
      }
    });

    function runAutoencoderGuard() {
      let vec = [
        telemetryState.speedKmh / 150,
        telemetryState.frictionCoefficient,
        (telemetryState.steeringAngle + 30) / 60,
        telemetryState.socPct / 100,
        (telemetryState.temperature + 10) / 50,
        telemetryState.cnnConfidence,
        telemetryState.aerodynamicDrag / 600,
        Math.abs(telemetryState.steeringAngle) / 30
      ];

      if (isCyberAttack) {
        vec[0] = 0.99;
        vec[2] = 0.98;
        vec[3] = 0.05;
        vec[5] = 0.08;
      }

      let sqSum = 0;
      const deltas = [];
      vec.forEach(val => {
        const reconVal = isCyberAttack ? (val * 0.4 + 0.3) : (val + (Math.random() - 0.5) * 0.08);
        const sq = Math.pow(val - reconVal, 2);
        sqSum += sq;
        deltas.push(sq.toFixed(3));
      });
      const mse = Number((sqSum / 8).toFixed(4));

      mseHistory.shift();
      mseHistory.push(mse);
      mseChart.data.datasets[0].data = mseHistory;

      const isBreached = mse >= 0.065;
      if (isBreached) {
        mseChart.data.datasets[0].borderColor = '#ff1e56';
        mseChart.data.datasets[0].backgroundColor = 'rgba(255, 30, 86, 0.3)';
        document.getElementById('intrusionBanner').style.display = 'block';
        document.getElementById('module4Card').classList.add('alert-breached');
        document.getElementById('firewallBadge').innerText = 'INTRUSION DETECTED';
        document.getElementById('firewallBadge').style.borderColor = '#ff1e56';
        document.getElementById('firewallBadge').style.color = '#ff1e56';
        document.getElementById('labelCurrentMse').style.color = '#ff1e56';
        document.getElementById('simMseVal').innerText = 'Current MSE: ' + mse.toFixed(4) + ' (CRITICAL INTRUSION)';
        document.getElementById('simMseVal').style.color = '#ff1e56';
        document.getElementById('simAeDeltas').style.color = '#ff1e56';
        playSiren();
      } else {
        mseChart.data.datasets[0].borderColor = '#00ff88';
        mseChart.data.datasets[0].backgroundColor = 'rgba(0, 255, 136, 0.1)';
        document.getElementById('intrusionBanner').style.display = 'none';
        document.getElementById('module4Card').classList.remove('alert-breached');
        document.getElementById('firewallBadge').innerText = 'FIREWALL NOMINAL';
        document.getElementById('firewallBadge').style.borderColor = '#00ff88';
        document.getElementById('firewallBadge').style.color = '#00ff88';
        document.getElementById('labelCurrentMse').style.color = '#00ff88';
        document.getElementById('simMseVal').innerText = 'Current MSE: ' + mse.toFixed(4) + ' (NOMINAL)';
        document.getElementById('simMseVal').style.color = '#00ff88';
        document.getElementById('simAeDeltas').style.color = '#00ff88';
      }

      document.getElementById('labelCurrentMse').innerText = 'MSE: ' + mse.toFixed(4);
      document.getElementById('simAeDeltas').innerText = 'Δ² = [' + deltas.join(', ') + ']';
      mseChart.update('none');
    }
    setInterval(runAutoencoderGuard, 300);

    /* NAVIGATION TABS SWITCHER */
    const tabBtnTelemetry = document.getElementById('tabBtnTelemetry');
    const tabBtnSimulator = document.getElementById('tabBtnSimulator');
    const viewTelemetry = document.getElementById('viewTelemetry');
    const viewSimulator = document.getElementById('viewSimulator');

    tabBtnTelemetry.addEventListener('click', () => {
      tabBtnTelemetry.className = 'tab-btn tab-btn-active-telemetry font-mono';
      tabBtnSimulator.className = 'tab-btn tab-btn-inactive font-mono';
      viewTelemetry.style.display = 'block';
      viewSimulator.style.display = 'none';
    });

    tabBtnSimulator.addEventListener('click', () => {
      tabBtnSimulator.className = 'tab-btn tab-btn-active-simulator font-mono';
      tabBtnTelemetry.className = 'tab-btn tab-btn-inactive font-mono';
      viewTelemetry.style.display = 'none';
      viewSimulator.style.display = 'block';
    });

    /* CONTROLS & CITY EVENTS */
    document.getElementById('citySelect').addEventListener('change', (e) => {
      currentCity = e.target.value;
      fetchLiveWeather();
    });

    document.getElementById('btnTogglePlay').addEventListener('click', (e) => {
      isStreaming = !isStreaming;
      e.target.innerText = isStreaming ? '⏸️ PAUSE TELEMETRY' : '▶️ RESUME TELEMETRY';
      document.getElementById('streamStatusText').innerText = isStreaming ? 'LIVE' : 'PAUSED';
      document.getElementById('streamStatusText').style.color = isStreaming ? '#00ff88' : '#ffaa00';
    });

    document.getElementById('btnRefreshWeather').addEventListener('click', fetchLiveWeather);

    document.getElementById('sliderSpeed').addEventListener('input', (e) => {
      telemetryState.speedKmh = Number(e.target.value);
      document.getElementById('labelSpeed').innerText = e.target.value + ' km/h';
      runAnnBatteryInference();
    });

    document.getElementById('sliderPayload').addEventListener('input', (e) => {
      telemetryState.payloadKg = Number(e.target.value);
      document.getElementById('labelPayload').innerText = e.target.value + ' kg';
      runAnnBatteryInference();
    });

    document.getElementById('sliderSoC').addEventListener('input', (e) => {
      telemetryState.socPct = Number(e.target.value);
      document.getElementById('labelSoC').innerText = e.target.value + '%';
      runAnnBatteryInference();
    });

    document.getElementById('sliderSteer').addEventListener('input', (e) => {
      telemetryState.steeringAngle = Number(e.target.value);
      document.getElementById('labelSteer').innerText = e.target.value + '°';
    });

    document.getElementById('btnInjectAttack').addEventListener('click', () => {
      isCyberAttack = true;
      document.getElementById('btnInjectAttack').style.display = 'none';
      document.getElementById('btnRestoreCan').style.display = 'inline-flex';
    });

    document.getElementById('btnRestoreCan').addEventListener('click', () => {
      isCyberAttack = false;
      document.getElementById('btnInjectAttack').style.display = 'inline-flex';
      document.getElementById('btnRestoreCan').style.display = 'none';
    });

    document.getElementById('btnToggleSound').addEventListener('click', (e) => {
      isSoundEnabled = !isSoundEnabled;
      e.target.innerText = isSoundEnabled ? '🔊 SFX ON' : '🔇 SFX OFF';
    });

    /* Initial Boot */
    fetchLiveWeather();
    runAnnBatteryInference();
  </script>
</body>
</html>`;
}
