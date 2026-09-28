/**
 * Module 3: Battery & Performance Optimizer (Topic: Deep ANNs / MLP)
 * Implements a Multi-Layer Perceptron with explicit feedforward weights,
 * biases, ReLU non-linearities, and layer activation tracking for UI pulsing.
 */

export interface AnnLayerActivations {
  inputLayer: number[]; // 7 neurons
  hiddenLayer1: number[]; // 6 neurons (ReLU)
  hiddenLayer2: number[]; // 4 neurons (ReLU)
  outputLayer: {
    predictedRangeKm: number;
    consumptionWhPerKm: number;
    efficiencyRating: string;
  };
}

// Weights: 6 x 7 (Hidden 1 <- Input)
const W1: number[][] = [
  [-0.35, -0.05, -0.42, 0.25, -0.75, -0.30, 1.20],
  [-0.40, -0.08, -0.38, 0.18, -0.65, -0.45, 1.15],
  [ 0.15, -0.02, -0.50, 0.32, -0.80, -0.25, 1.30],
  [-0.20, -0.12, -0.30, 0.15, -0.55, -0.35, 1.05],
  [-0.50, -0.04, -0.45, 0.28, -0.70, -0.28, 1.25],
  [ 0.10, -0.06, -0.22, 0.10, -0.60, -0.40, 1.10]
];
const b1: number[] = [0.12, 0.08, 0.15, 0.05, 0.10, 0.04];

// Weights: 4 x 6 (Hidden 2 <- Hidden 1)
const W2: number[][] = [
  [0.55, 0.48, 0.62, 0.40, 0.50, 0.35],
  [0.42, 0.60, 0.38, 0.52, 0.44, 0.48],
  [0.38, 0.35, 0.55, 0.42, 0.60, 0.30],
  [0.50, 0.45, 0.40, 0.38, 0.48, 0.55]
];
const b2: number[] = [0.05, 0.02, 0.04, 0.03];

// Weights: 2 x 4 (Output <- Hidden 2)
// Output 0: Scaled Range (Base ~450km)
// Output 1: Scaled Consumption (Base ~165 Wh/km)
const W3: number[][] = [
  [0.65, 0.70, 0.58, 0.62],
  [-0.45, -0.50, -0.40, -0.48]
];
const b3: number[] = [0.20, 0.85];

// ReLU activation
function relu(x: number): number {
  return Math.max(0, x);
}

export function runDeepAnnBatteryInference(
  temperatureC: number,
  humidityPct: number,
  windSpeedKmh: number,
  frictionMu: number,
  cruisingSpeedKmh: number,
  payloadKg: number,
  stateOfChargePct: number,
  batteryCapacityKwh: number = 78
): AnnLayerActivations {
  // 1. Normalize Tabular Inputs into Neural Domain [-1.0, 1.0] or [0, 1]
  // Temperature penalty is non-linear (cold < 10°C severely impacts lithium kinetics; hot > 35°C increases HVAC draw)
  const tempNorm = (temperatureC - 20) / 30; // 20°C is optimal
  const humidityNorm = humidityPct / 100;
  const windNorm = windSpeedKmh / 60;
  const frictionNorm = frictionMu; // 0.2 (ice) to 0.9 (dry)
  const speedNorm = cruisingSpeedKmh / 120;
  const payloadNorm = payloadKg / 500;
  const socNorm = stateOfChargePct / 100;

  const inputVector = [
    tempNorm,
    humidityNorm,
    windNorm,
    frictionNorm,
    speedNorm,
    payloadNorm,
    socNorm
  ];

  // 2. Hidden Layer 1: H1 = ReLU(W1 * X + b1)
  const h1Raw: number[] = [];
  const h1Activations: number[] = [];
  for (let r = 0; r < W1.length; r++) {
    let sum = b1[r];
    for (let c = 0; c < inputVector.length; c++) {
      sum += W1[r][c] * inputVector[c];
    }
    h1Raw.push(sum);
    h1Activations.push(Number(relu(sum).toFixed(3)));
  }

  // 3. Hidden Layer 2: H2 = ReLU(W2 * H1 + b2)
  const h2Activations: number[] = [];
  for (let r = 0; r < W2.length; r++) {
    let sum = b2[r];
    for (let c = 0; c < h1Activations.length; c++) {
      sum += W2[r][c] * h1Activations[c];
    }
    h2Activations.push(Number(relu(sum).toFixed(3)));
  }

  // 4. Output Layer: Y = W3 * H2 + b3
  let rangeOutputFactor = b3[0];
  let consumptionFactor = b3[1];
  for (let c = 0; c < h2Activations.length; c++) {
    rangeOutputFactor += W3[0][c] * h2Activations[c];
    consumptionFactor += W3[1][c] * h2Activations[c];
  }

  // Scale to physical automotive units
  // Ideal range at 100% SoC for a 78kWh pack is ~460 km
  const theoreticalMaxKm = (batteryCapacityKwh / 0.165); // ~472 km
  const socScale = stateOfChargePct / 100;

  // Temperature efficiency curve (Bell-shaped centered at 21.5°C)
  const tempEfficiency = Math.exp(-Math.pow(temperatureC - 21.5, 2) / 380);

  // Aerodynamic and rolling friction multipliers
  const speedAerodragPenalty = Math.pow(cruisingSpeedKmh / 80, 1.85);
  const rollingResistancePenalty = (1.0 - frictionMu * 0.15) * (1 + (payloadKg / 1800));

  // Compute final ANN-guided range
  const predictedRangeKm = Math.max(
    8,
    Math.round(
      theoreticalMaxKm * socScale * (0.4 + 0.6 * rangeOutputFactor) * (0.6 + 0.4 * tempEfficiency) /
      (0.6 + 0.25 * speedAerodragPenalty + 0.15 * rollingResistancePenalty)
    )
  );

  // Wh/km consumption
  const consumptionWhPerKm = Math.round(
    140 +
    (cruisingSpeedKmh * 0.75) +
    (payloadKg * 0.05) +
    (windSpeedKmh * 0.45) +
    ((1 - tempEfficiency) * 35) +
    (consumptionFactor * 10)
  );

  let efficiencyRating = 'A+ (Optimal)';
  if (consumptionWhPerKm > 210) efficiencyRating = 'C (High Drain)';
  else if (consumptionWhPerKm > 175) efficiencyRating = 'B (Nominal)';

  return {
    inputLayer: inputVector.map(v => Number(v.toFixed(3))),
    hiddenLayer1: h1Activations,
    hiddenLayer2: h2Activations,
    outputLayer: {
      predictedRangeKm,
      consumptionWhPerKm,
      efficiencyRating
    }
  };
}
