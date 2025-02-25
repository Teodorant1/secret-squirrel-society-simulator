import { CustomizeGroups } from "@/components/customize/customize-groups"
import { CustomizeTheme } from "@/components/customize/customize-theme"
import { ThemePresets } from "@/components/customize/theme-presets"

export default function CustomizePage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Customize Your Game</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <CustomizeGroups />
        <CustomizeTheme />
      </div>
      <ThemePresets />
    </div>
  )
}

