import { describe, expect, test } from "vitest"
import { chance2D10, chanceD10x10 } from "../../utilities/utilities"

describe("fire tests", () => {
  describe("probability checks", () => {
    test("chance2D10", () => {
      expect(chance2D10(0)).toBe(99)
      expect(chance2D10(3)).toBe(97)
      expect(chance2D10(18)).toBe(3)
      expect(chance2D10(19)).toBe(1)
      expect(chance2D10(20)).toBe(0)
      expect(chance2D10(25)).toBe(0)
    })

    test("chanceD10x10", () => {
      expect(chanceD10x10(0)).toBe(100)
      expect(chanceD10x10(1)).toBe(99)
      expect(chanceD10x10(2)).toBe(97)
      expect(chanceD10x10(23)).toBe(52)
      expect(chanceD10x10(24)).toBe(48)
      expect(chanceD10x10(89)).toBe(3)
      expect(chanceD10x10(90)).toBe(1)
      expect(chanceD10x10(99)).toBe(1)
      expect(chanceD10x10(100)).toBe(0)
      expect(chanceD10x10(111)).toBe(0)
    })
  })
})
