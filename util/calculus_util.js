const evaluateExpression = (expression) => {
  // Expression validator(s)
  const validate = (expression) => {
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

    checkParens(expression)
  }

  // Check whether a string token is a number
  function isNumber(token) {
    return !isNaN(parseFloat(token)) && isFinite(token)
  }

  // Shunting yard algorithm to conver mathematical expression from infix notation to postfix notation
  const infixToPostfix = (infix) => {
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
    const noWhiteSpace = (expression) => {
      return expression.replace(/\s+/g, "")
    }

    const queue = []
    const stack = []

    // Precedences for operators
    const precedences = { "/": 5, "*": 5, "+": 4, "-": 4, "(": 0 }

    // Remove whitespace, split to array and remove empty indexes
    const cleanedInfix = cleanArray(splitToArray(noWhiteSpace(infix)))

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
      } else if ("/*+-".indexOf(token) !== -1) {
        let operator = stack[stack.length - 1]
        while (
          "/*+-".indexOf(operator) !== -1 &&
          precedences[token] <= precedences[operator]
        ) {
          queue.push(stack.pop())
          operator = stack[stack.length - 1]
        }
        stack.push(token)
      }
    }
    while (stack.length > 0) {
      queue.push(stack.pop())
    }
    return queue
  }

  // Evaluate result of expression in postfix notation
  const evalPostfix = (postfix) => {
    // Operate according to operator with two tokens
    const operate = (operator, o1, o2) => {
      switch (operator) {
        case "+":
          return o1 + o2
        case "-":
          return o1 - o2
        case "*":
          return o1 * o2
        case "/":
          return o1 / o2
      }
    }

    const stack = []

    /*
    1. If token is a number, push it to stack
    2. If token is operator, pop two operands from stack and push result of operands and operation defined by token to stack
    3. After evaluating whole expression, result is left in stack.
    */
    for (let i = 0; i < postfix.length; i++) {
      const token = postfix[i]

      if (isNumber(token)) {
        stack.push(token)
      } else {
        const o2 = stack.pop()
        const o1 = stack.pop()
        stack.push(operate(token, o1, o2))
      }
    }

    if (stack.length > 1 || isNaN(stack[stack.length - 1])) {
      throw Error("Malformatted expression, incorrect count of operators.")
    }

    return stack.pop()
  }

  validate(expression)
  const postfixExpression = infixToPostfix(expression)
  const evaluationResult = evalPostfix(postfixExpression)

  return evaluationResult
}

module.exports = {
  evaluateExpression
}
