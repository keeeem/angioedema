// ============================================================
// PLACEHOLDER COEFFICIENTS — Replace with your actual model values
// Extract from your .pkl file using:
//   import pickle, json
//   model = pickle.load(open("logistic_regression_10_features.pkl","rb"))
//   print(json.dumps({"coefficients": model.coef_[0].tolist(), "intercept": model.intercept_[0]}))
// ============================================================

const MODEL = {
  coefficients: [
    -1.175866714988405,    // family_history
    0.03222911351845014,   // attack_freq3_in
    0.12457521316485665,   // age_onset
    -0.03532015107395068,  // attack_length
    0.650914247063809,     // flare_facial
    0.3483792255730186,    // flare_tongue
    -0.21876758694743917,  // flare_throat
    -1.6924839931100457,   // flare_GI
    1.3431167375934083,    // flare_lip
    1.1946976436576557,    // angio_sx_pruritus
  ],
  intercept: -0.8853938752537898,
};

export interface PredictionInput {
  family_history: number;
  attack_freq3_in: number;
  age_onset: number;
  attack_length: number;
  flare_facial: number;
  flare_tongue: number;
  flare_throat: number;
  flare_GI: number;
  flare_lip: number;
  angio_sx_pruritus: number;
}

export interface PredictionResult {
  probability: number;
  prediction: 0 | 1;
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

export function predict(input: PredictionInput): PredictionResult {
  const features = [
    input.family_history,
    input.attack_freq3_in,
    input.age_onset,
    input.attack_length,
    input.flare_facial,
    input.flare_tongue,
    input.flare_throat,
    input.flare_GI,
    input.flare_lip,
    input.angio_sx_pruritus,
  ];

  const logit = features.reduce(
    (sum, val, i) => sum + val * MODEL.coefficients[i],
    MODEL.intercept
  );

  const probability = sigmoid(logit);
  return {
    probability,
    prediction: probability >= 0.5 ? 1 : 0,
  };
}

export const FEATURE_LABELS: Record<keyof PredictionInput, string> = {
  family_history: "Family history of angioedema",
  attack_freq3_in: "Attack frequency (≥3 in past year)",
  age_onset: "Age at onset (years)",
  attack_length: "Typical attack length (hours)",
  flare_facial: "Facial flares",
  flare_tongue: "Tongue flares",
  flare_throat: "Throat flares",
  flare_GI: "GI flares",
  flare_lip: "Lip flares",
  angio_sx_pruritus: "Pruritus (itching) with angioedema",
};

export const FEATURE_KEYS = Object.keys(FEATURE_LABELS) as (keyof PredictionInput)[];

export function isNumericFeature(key: keyof PredictionInput): boolean {
  return key === "age_onset" || key === "attack_length";
}

export function generateCSV(input: PredictionInput, result: PredictionResult): string {
  const header = [...FEATURE_KEYS, "probability", "prediction"].join(",");
  const values = [
    ...FEATURE_KEYS.map((k) => input[k]),
    result.probability.toFixed(4),
    result.prediction,
  ].join(",");
  return `${header}\n${values}`;
}
