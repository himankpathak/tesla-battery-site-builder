export interface BatteryType {
  id: string
  name: string
  length: number // in feet
  width: number // in feet
  energy: number // in MWh
  cost: number // in USD
  releaseDate?: string
  color: string
}

export interface TransformerType extends BatteryType {
  isTransformer: true
}

export const BATTERY_TYPES: BatteryType[] = [
  {
    id: "megapack-xl",
    name: "Megapack XL",
    length: 40,
    width: 10,
    energy: 4,
    cost: 120000,
    releaseDate: "2022",
    color: "bg-violet-400 dark:bg-violet-600",
  },
  {
    id: "megapack-2",
    name: "Megapack 2",
    length: 30,
    width: 10,
    energy: 3,
    cost: 80000,
    releaseDate: "2021",
    color: "bg-blue-400 dark:bg-blue-600",
  },
  {
    id: "megapack",
    name: "Megapack",
    length: 30,
    width: 10,
    energy: 2,
    cost: 50000,
    releaseDate: "2005",
    color: "bg-cyan-400 dark:bg-cyan-600",
  },
  {
    id: "powerpack",
    name: "PowerPack",
    length: 10,
    width: 10,
    energy: 1,
    cost: 10000,
    releaseDate: "2000",
    color: "bg-emerald-400 dark:bg-emerald-600",
  },
]

export const TRANSFORMER_TYPES: TransformerType[] = [
  {
    id: "transformer",
    name: "Transformer",
    length: 10,
    width: 10,
    energy: -0.5,
    cost: 10000,
    color: "bg-amber-400 dark:bg-amber-600",
    isTransformer: true,
  },
]

export const MAX_BATTERY_QTY_ALLOWED = 10000
export const MAX_ROW_WIDTH = 100 // ft
export const BATTERY_SCALE = 5 // pixels per ft
export const BATTERY_COL_GAP = 2 // ft between items
export const BATTERY_ROW_GAP = 2 // ft between rows
export const VIEWPORT_HEIGHT = 600
export const VIEWPORT_BUFFER = 200
