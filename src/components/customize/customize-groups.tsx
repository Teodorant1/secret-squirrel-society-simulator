"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/image-upload";

export function CustomizeGroups() {
  const [faction1Name, setFaction1Name] = useState("Liberals");
  const [faction2Name, setFaction2Name] = useState("Fascists");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customize Factions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="faction1">Faction 1 Name</Label>
          <Input
            id="faction1"
            value={faction1Name}
            onChange={(e) => setFaction1Name(e.target.value)}
          />
          <ImageUpload label="Faction 1 Symbol" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="faction2">Faction 2 Name</Label>
          <Input
            id="faction2"
            value={faction2Name}
            onChange={(e) => setFaction2Name(e.target.value)}
          />
          <ImageUpload label="Faction 2 Symbol" />
        </div>
        <Button className="w-full">Save Changes</Button>
      </CardContent>
    </Card>
  );
}
