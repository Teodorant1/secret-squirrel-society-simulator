"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

export function CustomizeTheme() {
  const [primaryColor, setPrimaryColor] = useState("#000000")
  const [spacing, setSpacing] = useState(4)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customize Theme</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="primary-color">Primary Color</Label>
          <Input
            id="primary-color"
            type="color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Base Spacing</Label>
          <Slider value={[spacing]} onValueChange={(value) => setSpacing(value[0])} max={8} step={1} />
          <span className="text-sm text-muted-foreground">Current: {spacing * 4}px</span>
        </div>
        <Button className="w-full">Apply Theme</Button>
      </CardContent>
    </Card>
  )
}

