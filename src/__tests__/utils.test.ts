import { formatCurrency, cn, formatDate } from "@/lib/utils"

describe("Utils Tests", () => {
  describe("formatCurrency", () => {
    it("should format currency correctly", () => {
      expect(formatCurrency(1000)).toBe("$1.00K")
      expect(formatCurrency(50000)).toBe("$50.00K")
      expect(formatCurrency(1000000)).toBe("$1.00M")
    })

    it("should handle zero", () => {
      expect(formatCurrency(0)).toBe("$0.00")
    })

    it("should handle negative numbers", () => {
      expect(formatCurrency(-1000)).toBe("-$1.00K")
    })
  })

  describe("cn", () => {
    it("should merge class names", () => {
      const result = cn("class1", "class2")
      expect(result).toBe("class1 class2")
    })

    it("should handle empty input", () => {
      const result = cn()
      expect(result).toBe("")
    })

    it("should handle conditional classes", () => {
      const result = cn("base", true && "active", false && "disabled")
      expect(result).toBe("base active")
    })
  })

  describe("formatDate", () => {
    it("should format Date objects", () => {
      const date = new Date("2024-01-15T10:30:00")
      const result = formatDate(date)
      expect(result).toContain("Jan")
      expect(result).toContain("15")
      expect(result).toContain("2024")
    })

    it("should handle undefined", () => {
      expect(formatDate(undefined)).toBe("Unknown date")
    })

    it("should format string dates", () => {
      const result = formatDate("2024-01-15T10:30:00")
      expect(result).toContain("Jan")
      expect(result).toContain("15")
    })
  })
})
