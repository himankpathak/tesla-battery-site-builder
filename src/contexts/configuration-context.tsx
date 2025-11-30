"use client"

import { BATTERY_TYPES, TRANSFORMER_TYPES } from "@/lib/constants"
import { Timestamp } from "firebase/firestore"
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
  id?: string
  name?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
  cost: number
  energyProduction: number
  batteryDetails: BatteryDetails
  lengthOccupied: number
  widthOccupied: number
  totalBatteries: number
  totalTransformers: number
  manualPackingEnabled?: boolean
  batterySequence?: Array<{ id: string; battery: { id: string } }>
}

interface ConfigurationContextType {
  config: SiteConfiguration
  updateBatteryDetails: (details: BatteryDetails) => void
  updateAreaOccupied: (length: number, width: number) => void
  resetConfig: () => void
  loadDesign: (design: SiteConfiguration) => void
  updateManualPackingState: (
    enabled: boolean,
    sequence?: Array<{ id: string; battery: { id: string } }>,
  ) => void
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
  const [designName, setDesignName] = useState<string | undefined>(undefined)
  const [manualPackingEnabled, setManualPackingEnabled] = useState<
    boolean | undefined
  >(undefined)
  const [batterySequence, setBatterySequence] = useState<
    Array<{ id: string; battery: { id: string } }> | undefined
  >(undefined)

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
    setDesignName(undefined)
    setManualPackingEnabled(undefined)
    setBatterySequence(undefined)
    setTotalBatteries(0)
    setTotalTransformers(0)
  }

  const loadDesign = (design: SiteConfiguration) => {
    setBatteryDetails(design.batteryDetails)
    setLengthOccupied(design.lengthOccupied)
    setWidthOccupied(design.widthOccupied)
    setTotalBatteries(design.totalBatteries)
    setTotalTransformers(design.totalTransformers)
    setDesignName(design.name)
    setManualPackingEnabled(design.manualPackingEnabled)
    setBatterySequence(design.batterySequence)
  }

  const updateManualPackingState = (
    enabled: boolean,
    sequence?: Array<{ id: string; battery: { id: string } }>,
  ) => {
    setManualPackingEnabled(enabled)
    setBatterySequence(sequence)
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
      name: designName,
      batteryDetails,
      cost: totalCost,
      energyProduction: totalEnergy,
      totalBatteries: totalBatteries,
      totalTransformers: totalTransformers,
      lengthOccupied,
      widthOccupied,
      manualPackingEnabled,
      batterySequence,
    }
  }, [
    batteryDetails,
    totalBatteries,
    totalTransformers,
    lengthOccupied,
    widthOccupied,
    designName,
    manualPackingEnabled,
    batterySequence,
  ])

  return (
    <ConfigurationContext.Provider
      value={{
        config,
        updateBatteryDetails,
        updateAreaOccupied,
        resetConfig,
        loadDesign,
        updateManualPackingState,
      }}
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
