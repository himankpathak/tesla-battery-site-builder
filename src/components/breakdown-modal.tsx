"use client"

import { useConfiguration } from "@/contexts/configuration-context"
import { BATTERY_TYPES, TRANSFORMER_TYPES } from "@/lib/constants"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatCurrency } from "@/lib/utils"

interface BreakdownModalProps {
  isOpen: boolean
  onClose: () => void
  type: "cost" | "energy"
}

export function BreakdownModal({ isOpen, onClose, type }: BreakdownModalProps) {
  const { config } = useConfiguration()

  const allBatteries = [...BATTERY_TYPES, ...TRANSFORMER_TYPES]

  const breakdownItems = allBatteries
    .map((battery) => {
      const count = config.batteryDetails[battery.id] || 0
      if (count === 0) return

      const totalCost = count * battery.cost
      const totalEnergy = count * battery.energy

      return {
        name: battery.name,
        count,
        unitValue: type === "cost" ? battery.cost : battery.energy,
        totalValue: type === "cost" ? totalCost : totalEnergy,
        color: battery.color,
      }
    })
    .filter((item) => !!item)

  const totalValue = type === "cost" ? config.cost : config.energyProduction

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {type === "cost" ? "Cost Breakdown" : "Energy Production Breakdown"}
          </DialogTitle>
          <DialogDescription>
            Detailed breakdown by battery type
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {breakdownItems.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">
              No batteries added yet
            </p>
          ) : (
            <>
              {breakdownItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-card flex items-center justify-between gap-4 rounded-lg border p-4"
                >
                  <div className="flex flex-1 items-center gap-3">
                    <div className={`h-12 w-2 rounded ${item.color}`}></div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        Quantity: {item.count} units
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {type === "cost" ? (
                      <>
                        <p className="text-muted-foreground text-sm">
                          {formatCurrency(item.unitValue)} each
                        </p>
                        <p className="text-lg font-bold">
                          {formatCurrency(item.totalValue)}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-muted-foreground text-sm">
                          {item.unitValue >= 0 ? "+" : ""}
                          {item.unitValue} MWh each
                        </p>
                        <p
                          className={`text-lg font-bold ${
                            item.totalValue >= 0
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {item.totalValue >= 0 ? "+" : ""}
                          {item.totalValue} MWh
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="bg-primary/10 flex items-center justify-between rounded-lg p-4">
                  <div>
                    <h3 className="text-lg font-bold">Total</h3>
                    <p className="text-muted-foreground text-sm">
                      {config.totalBatteries} batteries
                      {config.totalTransformers > 0 &&
                        `, ${config.totalTransformers} transformers`}
                    </p>
                  </div>
                  <div className="text-right">
                    {type === "cost" ? (
                      <p className="text-2xl font-bold">
                        {formatCurrency(totalValue)}
                      </p>
                    ) : (
                      <p
                        className={`text-2xl font-bold ${
                          totalValue >= 0 ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {totalValue >= 0 ? "+" : ""}
                        {totalValue.toLocaleString()} MWh
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
