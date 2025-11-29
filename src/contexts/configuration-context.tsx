"use client"

import { BATTERY_TYPES, TRANSFORMER_TYPES } from "@/lib/constants"
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react"

export interface BatteryDetails {
  [batteryId: string]: number
}

export interface SiteConfiguration {
  cost: number
  energyProduction: number
  batteryDetails: BatteryDetails
  lengthOccupied: number
  widthOccupied: number
  totalBatteries: number
  totalTransformers: number
}

interface ConfigurationContextType {
  config: SiteConfiguration
  updateBatteryDetails: (details: BatteryDetails) => void
  updateAreaOccupied: (length: number, width: number) => void
  resetConfig: () => void
}

const defaultConfig: SiteConfiguration = {
  cost: 0,
  energyProduction: 0,
  batteryDetails: {},
  lengthOccupied: 0,
  widthOccupied: 0,
  totalBatteries: 0,
  totalTransformers: 0,
}

const ConfigurationContext = createContext<
  ConfigurationContextType | undefined
>(undefined)

export function ConfigurationProvider({ children }: { children: ReactNode }) {
  const [totalBatteries, setTotalBatteries] = useState(0)
  const [totalTransformers, setTotalTransformers] = useState(0)
  const [batteryDetails, setBatteryDetails] = useState<BatteryDetails>({})
  const [lengthOccupied, setLengthOccupied] = useState(0)
  const [widthOccupied, setWidthOccupied] = useState(0)

  const updateBatteryDetails = (details: BatteryDetails) => {
    const totalBatteries = BATTERY_TYPES.reduce((sum, battery) => {
      const count = details[battery.id] || 0
      return sum + count
    }, 0)
    // Each transformer can support 2 batteries
    const totalTransformers = Math.floor(totalBatteries / 2)

    setTotalBatteries(totalBatteries)
    setTotalTransformers(totalTransformers)
    setBatteryDetails({
      ...details,
      [TRANSFORMER_TYPES[0].id]: totalTransformers,
    })
  }

  const updateAreaOccupied = (length: number, width: number) => {
    setLengthOccupied(length)
    setWidthOccupied(width)
  }

  const resetConfig = () => {
    setBatteryDetails({})
  }

  const config: SiteConfiguration = useMemo(() => {
    let totalCost = 0
    let totalEnergy = 0

    for (const battery of [...BATTERY_TYPES, ...TRANSFORMER_TYPES]) {
      const count = batteryDetails[battery.id] || 0
      totalCost += count * battery.cost
      totalEnergy += count * battery.energy
    }

    return {
      ...defaultConfig,
      batteryDetails,
      cost: totalCost,
      energyProduction: totalEnergy,
      totalBatteries: totalBatteries,
      totalTransformers: totalTransformers,
      lengthOccupied,
      widthOccupied,
    }
  }, [
    batteryDetails,
    totalBatteries,
    totalTransformers,
    lengthOccupied,
    widthOccupied,
  ])

  return (
    <ConfigurationContext.Provider
      value={{ config, updateBatteryDetails, updateAreaOccupied, resetConfig }}
    >
      {children}
    </ConfigurationContext.Provider>
  )
}

export function useConfiguration() {
  const context = useContext(ConfigurationContext)
  if (context === undefined) {
    throw new Error(
      "useConfiguration must be used within a ConfigurationProvider",
    )
  }
  return context
}
