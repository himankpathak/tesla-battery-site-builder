"use client"

import {
  BATTERY_TYPES,
  TRANSFORMER_TYPES,
  MAX_BATTERY_QTY_ALLOWED,
} from "@/lib/constants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useConfiguration } from "@/contexts/configuration-context"
import { cn } from "@/lib/utils"
import { Minus, Plus } from "lucide-react"

interface BatteryCardProps {
  batteryId: string
  isTransformer?: boolean
}
export function BatteryCard({
  batteryId,
  isTransformer = false,
}: BatteryCardProps) {
  const { config, updateBatteryDetails } = useConfiguration()
  const batteryCount = config.batteryDetails[batteryId] || 0

  const battery =
    BATTERY_TYPES.find((battery) => battery.id === batteryId) ||
    TRANSFORMER_TYPES.find((transformer) => transformer.id === batteryId)

  if (!battery) {
    return null
  }

  const onCountChange = (count: number) => {
    updateBatteryDetails({
      ...config.batteryDetails,
      [batteryId]: Math.min(MAX_BATTERY_QTY_ALLOWED, Math.max(0, count)),
    })
  }

  return (
    <Card className="w-full max-w-sm gap-3">
      <div className={cn("h-2", battery.color)}></div>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{battery.name}</span>
          {battery.releaseDate && (
            <Badge variant="outline">{battery.releaseDate}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Dimensions</p>
            <p className="font-medium">
              {battery.length}&apos; × {battery.width}&apos;
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Energy</p>
            {battery.energy >= 0 ? (
              <p className="font-medium text-green-600">
                +{battery.energy} MWh
              </p>
            ) : (
              <p className="font-medium text-red-500">{battery.energy} MWh</p>
            )}
          </div>
          <div>
            <p className="text-muted-foreground">Cost</p>
            <p className="font-medium">${battery.cost.toLocaleString()}</p>
          </div>

          <div className="flex flex-col gap-1">
            <Label
              className="text-muted-foreground"
              htmlFor={batteryId + "-qty"}
            >
              Quantity
            </Label>
            {isTransformer ? (
              <>
                <p className="flex items-baseline gap-1 font-medium">
                  <span className="text-xl font-bold">{batteryCount}</span>{" "}
                  units
                </p>
                <p className="text-muted-foreground text-xs">
                  Auto-calculated: 1 transformer per 2 batteries
                </p>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => onCountChange(Math.max(0, batteryCount - 1))}
                  disabled={batteryCount === 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id={batteryId + "-qty"}
                  type="number"
                  min={0}
                  max={100000}
                  value={batteryCount}
                  onChange={(e) => onCountChange(parseInt(e.target.value) || 0)}
                  className="bg-background text-center"
                />
                <Button
                  variant="outline"
                  onClick={() => onCountChange(batteryCount + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
