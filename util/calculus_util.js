// Check that expression has balanced parentheses
const checkParens = (expression) => {
  const stack = []

  expression.split("").forEach((token) => {
    if (token === "(") {
      stack.push(token)
    } else if (token === ")") {
      if (stack.slice(-1).pop() === "(") {
        stack.pop()
      }
    }
  })

  if (stack.length > 0) {
    throw Error("Malformatted expression, parentheses are not balanced.")
  }
}

// Expression validator(s)
const validate = (expression) => {
  checkParens(expression)
}

// Check whether a string token is a number
const isNumber = (token) =>
  !Number.isNaN(parseFloat(token)) && Number.isFinite(Number(token))

// Produce new array without empty indexes
const cleanArray = (array) => array.filter((token) => token !== "")

// Split expression on operators
const splitToArray = (expression) => expression.split(/([+\-*/()])/)

// Remove whitespace from expression
const removeWhiteSpace = (expression) => expression.replace(/\s+/g, "")

/* 
Replace unary minus operators with 'u'
Minus sign is unary operator if
1. It is the first operator of expression or
2. It is preceded by another operator
*/
const findUnaryOperators = (array) => {
  const arrayWithUnaries = array.map((token, index, arr) => {
    if (
      token === "-" &&
      (index === 0 || "(/*+-".indexOf(arr[index - 1]) !== -1)
    ) {
      return "u"
    }
    return token
  })

  return arrayWithUnaries
}

// Precedences for operators
const precedences = { u: 3, "/": 2, "*": 2, "+": 1, "-": 1, "(": 0 }

// Shunting yard algorithm to convert mathematical expression from infix notation to postfix notation
const infixToPostfix = (infix) => {
  const queue = []
  const stack = []

  // Find unary operators, remove whitespace, split to array and remove empty indexes
  const cleanedInfix = findUnaryOperators(
    cleanArray(splitToArray(removeWhiteSpace(infix)))
  )

  /*
  Convert to cleaned infix to postfix
  1. If token is a number, push to queue
  2. If token is '(', push to stack
  3. If token is ')', pop operators from stack to queue until '(' is reached
  4. If token is operator, pop operators from stack to queue while current
  tokens precedence is smaller than precedence of operator at the top of the stack.
  5. Finally empty stack to queue.
  */
  cleanedInfix.forEach((token) => {
    if (isNumber(token)) {
      queue.push(token)
    } else if (token === "(") {
      stack.push(token)
    } else if (token === ")") {
      while (stack.slice(-1).pop() !== "(") {
        queue.push(stack.pop())
      }
      stack.pop()
    } else if ("u/*+-".indexOf(token) !== -1) {
      let operator = stack.slice(-1).pop()
      while (
        "u/*+-".indexOf(operator) !== -1 &&
        precedences[token] <= precedences[operator]
      ) {
        queue.push(stack.pop())
        operator = stack.slice(-1).pop()
      }
      stack.push(token)
    } else {
      throw new Error("Expression contains unsupported operator.")
    }
  })

  while (stack.length > 0) {
    queue.push(stack.pop())
  }

  return queue
}

// Binary operation functions corresponding to operator
const binaryOperation = {
  "+": (operand1, operand2) => operand1 + operand2,
  "-": (operand1, operand2) => operand1 - operand2,
  "*": (operand1, operand2) => operand1 * operand2,
  "/": (operand1, operand2) => operand1 / operand2
}

// Unary operation functions corresponding to operator
const unaryOperation = {
  u: (operand1) => operand1 * -1
}

// Evaluate result of expression in postfix notation
const processPostfix = (postfix) => {
  const stack = []

  /*
  1. If token is a number, push it to stack
  2. If token is operator, pop two operands from stack and push result of operands and operation defined by token to stack
  3. After evaluating whole expression, result is left in stack.
  */
  postfix.forEach((token) => {
    if (isNumber(token)) {
      stack.push(Number(token))
    } else if (token === "u") {
      const operand1 = stack.pop()
      const operation = unaryOperation[token]
      stack.push(operation(operand1))
    } else {
      const operand2 = stack.pop()
      const operand1 = stack.pop()
      const operation = binaryOperation[token]
      stack.push(operation(operand1, operand2))
    }
  })

  if (stack.length > 1 || Number.isNaN(stack.slice(-1).pop())) {
    throw Error("Malformatted expression, incorrect count of operators.")
  }

  return stack.pop()
}

// Validate, convert and evaluate expression
const evaluateExpression = (expression) => {
  validate(expression)
  const postfixExpression = infixToPostfix(expression)
  const evaluationResult = processPostfix(postfixExpression)

  return evaluationResult
}

module.exports = {
  evaluateExpression
}
