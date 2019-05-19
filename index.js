const express = require("express")
const morgan = require("morgan")
const http = require("http")

const calculusRouter = require("./controller/calculus_api")

const app = express()
const port = process.env.PORT || 8080

app.use(morgan("dev"))
app.use(calculusRouter)
app.get("*", (req, res) =>
  res.send(
    "Nothing to see here, try posting base64 encoded math expression to '/calculus?query=[expression]'!"
  )
)

const server = http.createServer(app)

server.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = {
  app,
  server
}
