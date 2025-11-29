import { BATTERY_TYPES } from "@/lib/constants"
import { BatteryCard } from "./battery-card"
import { LayoutDisplay } from "./layout-display"

export function SiteLayoutBuilder() {
  return (
    <div className="flex flex-col gap-4 pb-8">
      <h2 className="mt-4 text-2xl font-medium">Battery Units</h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(225px,1fr))] gap-4">
        {BATTERY_TYPES.map((battery) => (
          <BatteryCard key={battery.id} batteryId={battery.id} />
        ))}
        <BatteryCard key="transformer" batteryId="transformer" isTransformer />
      </div>
      <h2 className="mt-4 text-2xl font-medium">Site Layout Preview</h2>
      <LayoutDisplay />
    </div>
  )
}
