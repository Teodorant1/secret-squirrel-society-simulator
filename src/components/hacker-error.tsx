import { Card } from "@/components/ui/card";
import { GlitchText } from "@/components/effects/glitch-text";
import { TerminalText } from "@/components/effects/terminal-text";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Skull, Zap } from "lucide-react";

const errorStyles = [
  { icon: AlertTriangle, border: "border-yellow-500", text: "text-yellow-300" },
  { icon: Skull, border: "border-red-500", text: "text-red-300" },
  { icon: Zap, border: "border-purple-500", text: "text-purple-300" },
] as const;

export function HackerError({
  message,
  onClose,
  className = "",
}: {
  message: string;
  onClose?: () => void;
  className?: string;
}) {
  const index = Math.floor(Math.random() * errorStyles.length);
  const currentStyle = errorStyles[index] ?? errorStyles[0];
  const Icon = currentStyle.icon;

  return (
    <div className={`pointer-events-none relative z-10 ${className}`}>
      <Card
        className={`pointer-events-auto relative z-20 mb-4 border-2 ${currentStyle.border} bg-black/80 p-6 backdrop-blur-sm`}
      >
        <div className="mb-2 flex items-center gap-3">
          <Icon className={`h-6 w-6 ${currentStyle.text}`} />
          <GlitchText
            text="FATAL_ERROR//"
            as="h3"
            className={`text-xl font-bold ${currentStyle.text}`}
            glitchFactor={1.3}
          />
        </div>

        <TerminalText
          text={message}
          className={`font-mono text-sm ${currentStyle.text}`}
          typingSpeed={20}
        />

        {onClose && (
          <div className="mt-4 text-right">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className={`border ${currentStyle.border} ${currentStyle.text} hover:bg-white/10`}
            >
              CLOSE//
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
