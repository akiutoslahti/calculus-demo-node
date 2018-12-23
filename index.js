const express = require("express")
const morgan = require("morgan")
const http = require("http")

const calculusRouter = require("./controller/calculus_api")

const app = express()
const port = process.env.PORT || 3000

app.use(morgan("dev"))
app.use(calculusRouter)
app.get("*", (req, res) => res.send("there is nothing to see here! :)"))

const server = http.createServer(app)

server.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = {
  app,
  server
}
