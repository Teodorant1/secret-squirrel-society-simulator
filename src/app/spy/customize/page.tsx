import { CustomizeGroups } from "@/components/customize/customize-groups";

export default function CustomizePage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Customize Your Game</h1>
      <div className="grid gap-8">
        <CustomizeGroups />
      </div>
    </div>
  );
}
