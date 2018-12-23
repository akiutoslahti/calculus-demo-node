// Expression validator(s)
const validate = (expression) => {
  checkParens(expression)
}

// Check that expression has balanced parentheses
const checkParens = (expression) => {
  const stack = []
  for (let i = 0; i < expression.length; i++) {
    const token = expression[i]
    if (token === "(") {
      stack.push(token)
    } else if (token === ")") {
      if (stack[stack.length - 1] === "(") {
        stack.pop()
      }
    }
  }
  if (stack.length > 0) {
    throw Error("Malformatted expression, parentheses are not balanced.")
  }
}

// Check whether a string token is a number
const isNumber = (token) => {
  return !isNaN(parseFloat(token)) && isFinite(token)
}

// Produce new array without empty indexes
const cleanArray = (array) => {
  const cleanedArray = []
  for (let i = 0; i < array.length; i++) {
    if (array[i] !== "") {
      cleanedArray.push(array[i])
    }
  }
  return cleanedArray
}

// Split expression on operators
const splitToArray = (expression) => {
  return expression.split(/([\+\-\*\/\(\)])/)
}

// Remove whitespace from expression
const removeWhiteSpace = (expression) => {
  return expression.replace(/\s+/g, "")
}

/* 
Replace unary minus operators with 'u'
Minus sign is unary operator if
1. It is the first operator of expression or
2. It is preceded by another operator
*/
const findUnaryOperators = (array) => {
  const arrayWithUnaries = []
  for (let i = 0; i < array.length; i++) {
    if (array[i] === "-" && (i === 0 || "(/*+-".indexOf(array[i - 1]) !== -1)) {
      arrayWithUnaries.push("u")
    } else {
      arrayWithUnaries.push(array[i])
    }
  }
  return arrayWithUnaries
}

// Precedences for operators
const precedences = { u: 6, "/": 5, "*": 5, "+": 4, "-": 4, "(": 0 }

// Shunting yard algorithm to conver mathematical expression from infix notation to postfix notation
const infixToPostfix = (infix) => {
  const queue = []
  const stack = []

  // Find unary operators, remove whitespace, split to array and remove empty indexes
  const cleanedInfix = findUnaryOperators(
    cleanArray(splitToArray(removeWhiteSpace(infix)))
  )

  // Convert to cleaned infix to postfix
  for (let i = 0; i < cleanedInfix.length; i++) {
    const token = cleanedInfix[i]

    /*
    1. If token is a number, push to queue
    2. If token is '(', push to stack
    3. If token is ')', pop operators from stack to queue until '(' is reached
    4. If token is operator, pop operators from stack to queue while current 
    tokens precedence is smaller than precedence of operator at the top of the stack.
    5. Finally empty stack to queue.
    */
    if (isNumber(token)) {
      queue.push(token)
    } else if (token === "(") {
      stack.push(token)
    } else if (token === ")") {
      while (stack[stack.length - 1] !== "(") {
        queue.push(stack.pop())
      }
      stack.pop()
    } else if ("u/*+-".indexOf(token) !== -1) {
      let operator = stack[stack.length - 1]
      while (
        "u/*+-".indexOf(operator) !== -1 &&
        precedences[token] <= precedences[operator]
      ) {
        queue.push(stack.pop())
        operator = stack[stack.length - 1]
      }
      stack.push(token)
    } else {
      throw new Error("Expression contains unsupported operator.")
    }
  }
  while (stack.length > 0) {
    queue.push(stack.pop())
  }
  return queue
}

// Return binary operation according to operator token
const binaryOperation = (operator) => {
  switch (operator) {
    case "+":
      return (operand1, operand2) => {
        return operand1 + operand2
      }
    case "-":
      return (operand1, operand2) => {
        return operand1 - operand2
      }
    case "*":
      return (operand1, operand2) => {
        return operand1 * operand2
      }
    case "/":
      return (operand1, operand2) => {
        return operand1 / operand2
      }
  }
}

// Return unary operation according to operator token
const unaryOperation = (operator) => {
  switch (operator) {
    case "u":
      return (operand1) => {
        return -1 * operand1
      }
  }
}

// Evaluate result of expression in postfix notation
const processPostfix = (postfix) => {
  const stack = []

  /*
  1. If token is a number, push it to stack
  2. If token is operator, pop two operands from stack and push result of operands and operation defined by token to stack
  3. After evaluating whole expression, result is left in stack.
  */
  for (let i = 0; i < postfix.length; i++) {
    const token = postfix[i]

    if (isNumber(token)) {
      stack.push(Number(token))
    } else if (token === "u") {
      const operand1 = stack.pop()
      const operation = unaryOperation(token)
      stack.push(operation(operand1))
    } else {
      const operand2 = stack.pop()
      const operand1 = stack.pop()
      const operation = binaryOperation(token)
      stack.push(operation(operand1, operand2))
    }
  }

  if (stack.length > 1 || isNaN(stack[stack.length - 1])) {
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
