import {
  BATTERY_TYPES,
  TRANSFORMER_TYPES,
  MAX_ROW_WIDTH,
  BATTERY_SCALE,
} from "@/lib/constants"

describe("Constants Tests", () => {
  describe("BATTERY_TYPES", () => {
    it("should have at least one battery type", () => {
      expect(BATTERY_TYPES.length).toBeGreaterThan(0)
    })

    it("should have valid battery properties", () => {
      BATTERY_TYPES.forEach((battery) => {
        expect(battery.id).toBeDefined()
        expect(battery.name).toBeDefined()
        expect(battery.length).toBeGreaterThan(0)
        expect(battery.width).toBeGreaterThan(0)
        expect(battery.energy).toBeGreaterThan(0)
        expect(battery.cost).toBeGreaterThan(0)
      })
    })

    it("should include Megapack XL", () => {
      const megapackXL = BATTERY_TYPES.find((b) => b.id === "megapack-xl")
      expect(megapackXL).toBeDefined()
      expect(megapackXL?.name).toBe("Megapack XL")
    })
  })

  describe("TRANSFORMER_TYPES", () => {
    it("should have at least one transformer type", () => {
      expect(TRANSFORMER_TYPES.length).toBeGreaterThan(0)
    })

    it("should have isTransformer property", () => {
      TRANSFORMER_TYPES.forEach((transformer) => {
        expect(transformer.isTransformer).toBe(true)
      })
    })
  })

  describe("Layout Constants", () => {
    it("should have valid MAX_ROW_WIDTH", () => {
      expect(MAX_ROW_WIDTH).toBeGreaterThan(0)
      expect(typeof MAX_ROW_WIDTH).toBe("number")
    })

    it("should have valid BATTERY_SCALE", () => {
      expect(BATTERY_SCALE).toBeGreaterThan(0)
      expect(typeof BATTERY_SCALE).toBe("number")
    })
  })
})
