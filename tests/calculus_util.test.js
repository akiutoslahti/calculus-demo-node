const calculus = require("../util/calculus_util")

describe("calculus util", () => {
  test("Simple arithmetic", () => {
    simpleArithmetic.forEach((testCase) => {
      const result = calculus.evaluateExpression(testCase.expression)
      expect(result).toBe(testCase.result)
    })
  })

  test("More complex arithmetic", () => {
    complexArithmetic.forEach((testCase) => {
      const result = calculus.evaluateExpression(testCase.expression)
      expect(result).toBe(testCase.result)
    })
  })

  test("Arithmetic with decimals", () => {
    decimalArithmetic.forEach((testCase) => {
      const result = calculus.evaluateExpression(testCase.expression)
      expect(Math.abs(result - testCase.result)).toBeLessThan(0.000001)
    })
  })

  test("Arithmetic with negative numbers", () => {
    arithmeticWithNegatives.forEach((testCase) => {
      const result = calculus.evaluateExpression(testCase.expression)
      expect(result).toBe(testCase.result)
    })
  })
})

const simpleArithmetic = [
  { expression: "36 / 6", result: 6 },
  { expression: "38 - 21", result: 17 },
  { expression: "8 * 9", result: 72 },
  { expression: "5 + 4", result: 9 }
]

const complexArithmetic = [
  { expression: "(9 - 3) * (2 + 1)", result: 18 },
  { expression: "6 * 4 + 3 * 9", result: 51 },
  { expression: "2 * 1 - 21 / 7", result: -1 },
  { expression: "(4 + 22) / (1 - 2)", result: -26 }
]

const decimalArithmetic = [
  { expression: "2 * 1 - 17 / 7", result: -0.428571429 },
  { expression: "2 * (23/(3*3))- 23 * (2*3)", result: -132.888888889 }
]

const arithmeticWithNegatives = [
  { expression: "-(3)", result: -3 },
  { expression: "-(-3)", result: 3 },
  { expression: "-2 * 3", result: -6 },
  { expression: "2 * (-3)", result: -6 },
  { expression: "-2 * (-3)", result: 6 },
  { expression: "-2 - (-3)", result: 1 },
  { expression: "-2 + (-3)", result: -5 },
  { expression: "-2 * -(3 * -4)", result: -24 }
]
