const express = require("express")

const router = express.Router()
const math = require("mathjs")

router.get("/calculus", (req, res) => {
  const { query } = req.query
  if (!query) {
    const resError = {
      error: true,
      message: "Request does not contain base64 encoded url parameter 'query'"
    }
    return res.status(400).send(resError)
  }

  const decodedQuery = Buffer.from(query, "base64")
    .toString("utf8")
    .replace(/\s/g, "")

  let evaluatedQuery
  try {
    evaluatedQuery = math.eval(decodedQuery)
  } catch (err) {
    const resError = { error: true, message: err.message }

    return res.status(200).send(resError)
  }

  const resSuccess = {
    error: false,
    result: evaluatedQuery
  }

  return res.status(200).send(resSuccess)
})

module.exports = router
