import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Activity, RotateCcw } from "lucide-react";
import {
  predict,
  generateCSV,
  FEATURE_KEYS,
  FEATURE_LABELS,
  isNumericFeature,
  type PredictionInput,
  type PredictionResult,
} from "@/lib/predict";

export default function PredictionForm() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<PredictionResult | null>(null);

  const allAnswered = FEATURE_KEYS.every((k) => answers[k] !== undefined && answers[k] !== "");

  const buildInput = (): PredictionInput => {
    const obj: Record<string, number> = {};
    for (const key of FEATURE_KEYS) {
      obj[key] = parseFloat(answers[key]);
    }
    return obj as unknown as PredictionInput;
  };

  const handlePredict = () => {
    setResult(predict(buildInput()));
  };

  const handleDownload = () => {
    if (!result) return;
    const input = buildInput();
    const csv = generateCSV(input, result);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prediction_result.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Activity className="h-6 w-6 text-primary" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Clinical Prediction Tool
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Answer the questions below to generate a binary prediction with probability
        </p>
      </div>

      {/* Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Patient Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {FEATURE_KEYS.map((key) => (
            <div key={key} className="space-y-1.5">
              <Label htmlFor={key} className="text-sm font-medium">
                {FEATURE_LABELS[key]}
              </Label>
              {isNumericFeature(key) ? (
                <Input
                  id={key}
                  type="number"
                  min={0}
                  step={key === "age_onset" ? 1 : key === "attack_freq3_in" ? 1 : 0.5}
                  placeholder={key === "age_onset" ? "e.g. 25" : key === "attack_freq3_in" ? "e.g. 3" : "e.g. 12"}
                  value={answers[key] ?? ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                />
              ) : key === "family_history" ? (
                <Select
                  value={answers[key]}
                  onValueChange={(val) =>
                    setAnswers((prev) => ({ ...prev, [key]: val }))
                  }
                >
                  <SelectTrigger id={key}>
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">None</SelectItem>
                    <SelectItem value="1">Yes – Weak</SelectItem>
                    <SelectItem value="2">Yes – Strong</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Select
                  value={answers[key]}
                  onValueChange={(val) =>
                    setAnswers((prev) => ({ ...prev, [key]: val }))
                  }
                >
                  <SelectTrigger id={key}>
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Yes</SelectItem>
                    <SelectItem value="0">No</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handlePredict} disabled={!allAnswered} className="flex-1">
          Generate Prediction
        </Button>
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>

      {/* Result */}
      {result && (
        <Card className="mt-6 border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Prediction</p>
                <p className="mt-1 font-heading text-3xl font-bold text-foreground">
                  {result.prediction === 1 ? "Positive" : "Negative"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground">Probability</p>
                <p className="mt-1 font-heading text-3xl font-bold text-primary">
                  {(result.probability * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleDownload}
              className="mt-5 w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Results as CSV
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
