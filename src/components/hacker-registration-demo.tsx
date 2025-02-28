"use client";

import { HackerRegistration } from "@/components/hacker-registration";
import { HackerError } from "@/components/hacker-error";
import { useState } from "react";

export function HackerRegistrationDemo() {
  const [showError, setShowError] = useState(false);

  const handleRegister = (data: {
    username: string;
    email: string;
    password: string;
  }) => {
    // Simulate random registration error
    if (Math.random() > 0.5) {
      setShowError(true);
    } else {
      console.log("Registration successful:", data);
    }
  };

  return (
    <div className="space-y-4">
      <HackerRegistration onRegister={handleRegister} />

      {showError && (
        <HackerError
          title="REGISTRATION_FAILED//"
          message="Unable to complete registration. Security protocols may have been compromised."
          severity="error"
          onRetry={() => setShowError(false)}
          onClose={() => setShowError(false)}
        />
      )}
    </div>
  );
}
