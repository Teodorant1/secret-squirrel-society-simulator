/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CRTScanlines } from "@/components/effects/crt-scanlines";
import { GlitchText } from "@/components/effects/glitch-text";
import { TerminalText } from "@/components/effects/terminal-text";
import { Crown, Scroll, Users } from "lucide-react";

export default function GamePage() {
  const [gamePhase, setGamePhase] = useState<"lobby" | "playing" | "ended">(
    "lobby",
  );
  const [seed] = useState(Math.random() * 1000);

  return (
    <div className="container max-w-5xl py-8">
      <CRTScanlines seed={seed} />
      <Card>
        {gamePhase === "lobby" && (
          <>
            <GlitchText text={"Waiting for players..."} />
            <div className="mt-4 flex gap-2">
              <Button variant="outline">Start Game</Button>
              <Button variant="outline">Leave Game</Button>
            </div>
          </>
        )}
        {gamePhase === "playing" && (
          <>
            <TerminalText text={"Game in progress..."} />
            <div className="mt-4 flex gap-2">
              <Button>Next Round</Button>
              <Button variant="destructive">End Game</Button>
            </div>
          </>
        )}
        {gamePhase === "ended" && (
          <>
            <GlitchText text={"Game Over!"} />
            <div className="mt-4 flex gap-2">
              <Button>Play Again</Button>
              <Button>Main Menu</Button>
            </div>
          </>
        )}
      </Card>
      <div className="mt-8 flex items-center justify-center gap-4">
        <Card className="w-24">
          <div className="flex items-center justify-center p-2">
            <Crown className="h-6 w-6" />
            <span className="ml-2">100</span>
          </div>
        </Card>
        <Card className="w-24">
          <div className="flex items-center justify-center p-2">
            <Scroll className="h-6 w-6" />
            <span className="ml-2">5</span>
          </div>
        </Card>
        <Card className="w-24">
          <div className="flex items-center justify-center p-2">
            <Users className="h-6 w-6" />
            <span className="ml-2">2/4</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
