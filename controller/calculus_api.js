const express = require("express")

const router = express.Router()
const calculus = require("../util/calculus_util")

router.get("/calculus", (req, res) => {
  const { query } = req.query

  // If request does not contain parameter 'query',
  // respond with error message
  if (!query) {
    const resError = {
      error: true,
      message: "Request does not contain base64 encoded url parameter 'query'"
    }
    return res.status(400).send(resError)
  }

  // Decoder base64 and remove all whitespace
  const decodedQuery = Buffer.from(query, "base64")
    .toString("utf8")
    .replace(/\s/g, "")

  // If there are errors in parsing or evaluating math expression,
  // respond with error message
  let evaluatedQuery
  try {
    evaluatedQuery = calculus.evaluateExpression(decodedQuery)
  } catch (err) {
    const resError = { error: true, message: err.message }
    return res.status(400).send(resError)
  }

  // All succesfull, return with result
  const resSuccess = {
    error: false,
    result: evaluatedQuery
  }
  return res.status(200).send(resSuccess)
})

module.exports = router
