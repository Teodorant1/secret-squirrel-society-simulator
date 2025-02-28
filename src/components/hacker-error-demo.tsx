"use client";

import { useState } from "react";
import { HackerError } from "@/components/hacker-error";
import { Button } from "@/components/ui/button";

export function HackerErrorDemo() {
  const [showError, setShowError] = useState(false);
  const [severity, setSeverity] = useState<"warning" | "error" | "critical">(
    "error",
  );

  const handleRetry = () => {
    setShowError(false);
    setTimeout(() => setShowError(true), 500);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => {
            setSeverity("warning");
            setShowError(true);
          }}
        >
          Show Warning
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setSeverity("error");
            setShowError(true);
          }}
        >
          Show Error
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setSeverity("critical");
            setShowError(true);
          }}
        >
          Show Critical
        </Button>
      </div>

      {showError && (
        <HackerError
          title={`${severity.toUpperCase()}_DETECTED//`}
          message={
            severity === "warning"
              ? "System performance degradation detected. Non-critical systems affected."
              : severity === "error"
                ? "System error detected. Some functionality may be impaired."
                : "Critical system failure. Immediate attention required."
          }
          severity={severity}
          onRetry={handleRetry}
          onClose={() => setShowError(false)}
        />
      )}
    </div>
  );
}
