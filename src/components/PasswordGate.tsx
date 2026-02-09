import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

const APP_PASSWORD = "predict2024"; // Change this password

interface PasswordGateProps {
  onAuthenticated: () => void;
}

export default function PasswordGate({ onAuthenticated }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === APP_PASSWORD) {
      onAuthenticated();
    } else {
      setError(true);
      setPassword("");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-lg"
      >
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h1 className="font-heading text-xl font-semibold text-card-foreground">
            Clinical Prediction Tool
          </h1>
          <p className="text-center text-sm text-muted-foreground">
            Enter the access password to continue
          </p>
        </div>

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          className={error ? "border-destructive" : ""}
          autoFocus
        />
        {error && (
          <p className="mt-2 text-sm text-destructive">Incorrect password</p>
        )}

        <Button type="submit" className="mt-4 w-full">
          Access
        </Button>
      </form>
    </div>
  );
}
