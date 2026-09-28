/**
 * Module 4: Central Cyber-Security Intrusion Guard (Topic: Autoencoders)
 * Implements an 8 -> 4 -> 2 -> 4 -> 8 Deep Autoencoder with Bottleneck Latent Space
 * and genuine Mean Squared Error (MSE) calculation.
 */

export interface AutoencoderResult {
  inputVector: number[];
  latentSpace: number[]; // 2-dimensional bottleneck representation
  reconstructedVector: number[];
  featureErrors: number[]; // (x_i - x̂_i)^2 for each dimension
  mse: number; // Mean Squared Error
  threshold: number; // e.g. 0.065
  isAnomaly: boolean;
  featureNames: string[];
}

export const AUTOENCODER_FEATURE_NAMES = [
  'Speed (v)',
  'Road Friction (μ)',
  'Steering / Yaw',
  'Batt Discharge',
  'Ambient Temp',
  'Vision Conf',
  'Aero Drag',
  'Curvature κ'
];

// Encoder 1: 4 x 8
const W_enc1: number[][] = [
  [0.32, 0.15, -0.08, 0.28, 0.10, -0.05, 0.35, -0.02],
  [0.10, 0.42, 0.12, 0.18, 0.35, 0.14, 0.08, 0.20],
  [-0.15, 0.08, 0.55, -0.10, 0.04, 0.22, -0.05, 0.48],
  [0.25, -0.12, 0.05, 0.45, -0.15, 0.18, 0.38, 0.05]
];
const b_enc1 = [0.05, 0.02, 0.08, 0.01];

// Encoder 2 (to Bottleneck 2D): 2 x 4
const W_enc2: number[][] = [
  [0.65, 0.45, -0.35, 0.55],
  [-0.30, 0.60, 0.70, -0.25]
];
const b_enc2 = [0.0, 0.0];

// Decoder 1: 4 x 2
const W_dec1: number[][] = [
  [0.62, -0.28],
  [0.42, 0.58],
  [-0.32, 0.68],
  [0.52, -0.22]
];
const b_dec1 = [0.03, 0.01, 0.04, 0.02];

// Decoder 2 (to Reconstructed 8D): 8 x 4
const W_dec2: number[][] = [
  [0.35, 0.08, -0.12, 0.26],
  [0.12, 0.44, 0.06, -0.10],
  [-0.05, 0.10, 0.52, 0.04],
  [0.26, 0.16, -0.08, 0.42],
  [0.08, 0.36, 0.02, -0.14],
  [-0.02, 0.12, 0.20, 0.16],
  [0.34, 0.06, -0.04, 0.36],
  [-0.01, 0.18, 0.46, 0.04]
];
const b_dec2 = [0.04, 0.05, 0.02, 0.03, 0.04, 0.06, 0.02, 0.01];

function relu(val: number): number {
  return Math.max(0, val);
}

function sigmoid(val: number): number {
  return 1 / (1 + Math.exp(-val));
}

export function runAutoencoderSecurityInference(
  rawFeatures: number[],
  isCyberAttackInjected: boolean = false
): AutoencoderResult {
  const threshold = 0.065;
  const N = rawFeatures.length;

  // 1. Prepare normalized feature vector in [0.0, 1.0] range
  let inputVector = rawFeatures.map(v => Math.max(0, Math.min(1, v)));

  // If attack is injected, simulate hostile adversarial perturbation / CAN-bus frame spoofing
  if (isCyberAttackInjected) {
    inputVector = inputVector.map((v, idx) => {
      // Severe out-of-distribution anomaly injection on critical steering, speed, and telemetry
      if (idx === 0) return 0.98; // Speed spoofed to max
      if (idx === 2) return 0.99; // Yaw/steering extreme erratic deflection
      if (idx === 3) return 0.02; // Battery telemetry cut
      if (idx === 5) return 0.10; // Vision sensor blinded / spoofed
      return (v + 0.45 + Math.random() * 0.4) % 1.0;
    });
  }

  // 2. Forward pass through Encoder 1: H_enc = ReLU(W_enc1 * X + b_enc1)
  const hEnc: number[] = [];
  for (let r = 0; r < W_enc1.length; r++) {
    let sum = b_enc1[r];
    for (let c = 0; c < N; c++) {
      sum += W_enc1[r][c] * inputVector[c];
    }
    hEnc.push(relu(sum));
  }

  // 3. Bottleneck Latent Space (2D): z = W_enc2 * H_enc + b_enc2
  const latent: number[] = [];
  for (let r = 0; r < W_enc2.length; r++) {
    let sum = b_enc2[r];
    for (let c = 0; c < hEnc.length; c++) {
      sum += W_enc2[r][c] * hEnc[c];
    }
    latent.push(Number(sum.toFixed(3)));
  }

  // 4. Decoder 1: H_dec = ReLU(W_dec1 * z + b_dec1)
  const hDec: number[] = [];
  for (let r = 0; r < W_dec1.length; r++) {
    let sum = b_dec1[r];
    for (let c = 0; c < latent.length; c++) {
      sum += W_dec1[r][c] * latent[c];
    }
    hDec.push(relu(sum));
  }

  // 5. Decoder 2: X_reconstructed = Sigmoid(W_dec2 * H_dec + b_dec2)
  const reconstructed: number[] = [];
  for (let r = 0; r < W_dec2.length; r++) {
    let sum = b_dec2[r];
    for (let c = 0; c < hDec.length; c++) {
      sum += W_dec2[r][c] * hDec[c];
    }
    reconstructed.push(Number(sigmoid(sum).toFixed(3)));
  }

  // 6. Compute Genuine Mean Squared Error (MSE)
  // MSE = (1 / N) * sum((x_i - x̂_i)^2)
  const featureErrors: number[] = [];
  let sumSquaredErrors = 0;

  for (let i = 0; i < N; i++) {
    const diff = inputVector[i] - reconstructed[i];
    const sqErr = Math.pow(diff, 2);
    featureErrors.push(Number(sqErr.toFixed(4)));
    sumSquaredErrors += sqErr;
  }

  const mse = Number((sumSquaredErrors / N).toFixed(4));
  const isAnomaly = mse > threshold;

  return {
    inputVector: inputVector.map(v => Number(v.toFixed(3))),
    latentSpace: latent,
    reconstructedVector: reconstructed,
    featureErrors,
    mse,
    threshold,
    isAnomaly,
    featureNames: AUTOENCODER_FEATURE_NAMES
  };
}
