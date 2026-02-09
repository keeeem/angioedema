import { useState } from "react";
import PasswordGate from "@/components/PasswordGate";
import PredictionForm from "@/components/PredictionForm";

const Index = () => {
  const [authenticated, setAuthenticated] = useState(false);

  if (!authenticated) {
    return <PasswordGate onAuthenticated={() => setAuthenticated(true)} />;
  }

  return <PredictionForm />;
};

export default Index;
