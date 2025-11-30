import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  BATTERY_TYPES,
  BatteryType,
  BATTERY_COL_GAP,
  MAX_ROW_WIDTH,
  BATTERY_ROW_GAP,
} from "./constants"
import { Timestamp } from "firebase/firestore"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
    notation: "compact",
  }).format(amount)
}

export interface PlacedBattery {
  id: string
  battery: BatteryType
  x: number
  y: number
  row: number
}

export interface Row {
  batteries: PlacedBattery[]
  usedWidth: number
}

export function calculateAutoPackedLayout(
  items: Array<{ id: string; battery: BatteryType }>,
): PlacedBattery[] {
  const rows: Row[] = []
  const placedBatteries: PlacedBattery[] = []

  // Sort items by battery length
  const sortedItems = [...items].sort((a, b) => {
    if (b.battery.length !== a.battery.length) {
      return b.battery.length - a.battery.length
    }
    return b.battery.width - a.battery.width
  })

  sortedItems.forEach((item) => {
    const batteryLength = item.battery.length

    // Find the first row that can fit this battery
    let targetRow = rows.find(
      (row) => row.usedWidth + batteryLength + BATTERY_COL_GAP <= MAX_ROW_WIDTH,
    )

    // If none, create a new row
    if (!targetRow) {
      targetRow = { batteries: [], usedWidth: 0 }
      rows.push(targetRow)
    }

    const rowIndex = rows.indexOf(targetRow)
    const x = targetRow.usedWidth
    const y =
      rowIndex *
      (Math.max(...BATTERY_TYPES.map((b) => b.width)) + BATTERY_ROW_GAP)

    const placedBattery: PlacedBattery = {
      id: item.id,
      battery: item.battery,
      x,
      y,
      row: rowIndex,
    }

    placedBatteries.push(placedBattery)
    targetRow.batteries.push(placedBattery)
    targetRow.usedWidth += batteryLength + BATTERY_COL_GAP
  })

  return placedBatteries
}

// Calculate layout in order
export function calculateManualLayout(
  items: Array<{ id: string; battery: BatteryType }>,
): PlacedBattery[] {
  const placedBatteries: PlacedBattery[] = []
  let currentX = 0
  let currentY = 0
  let currentRow = 0

  items.forEach((item) => {
    const batteryLength = item.battery.length

    // Check if battery fits in current row
    if (currentX + batteryLength > MAX_ROW_WIDTH && currentX > 0) {
      currentRow++
      currentX = 0
      currentY =
        currentRow *
        (Math.max(...BATTERY_TYPES.map((b) => b.width)) + BATTERY_ROW_GAP)
    }

    const placedBattery: PlacedBattery = {
      id: item.id,
      battery: item.battery,
      x: currentX,
      y: currentY,
      row: currentRow,
    }

    placedBatteries.push(placedBattery)
    currentX += batteryLength + BATTERY_COL_GAP
  })

  return placedBatteries
}

export const formatDate = (
  timestamp: Timestamp | Date | string | undefined,
) => {
  if (!timestamp) return "Unknown date"
  try {
    let date: Date
    if (timestamp instanceof Timestamp) {
      date = timestamp.toDate()
    } else if (timestamp instanceof Date) {
      date = timestamp
    } else {
      date = new Date(timestamp)
    }

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Unknown date"
  }
}
