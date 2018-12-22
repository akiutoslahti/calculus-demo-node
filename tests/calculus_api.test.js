const supertest = require("supertest")
const { app, server } = require("../index")

const api = supertest(app)

describe("calculus api", () => {
  test("GET /calculus returns 400 and error message when url parameter 'query' is missing", async () => {
    const response = await api
      .get("/calculus")
      .expect(400)
      .expect("Content-Type", /application\/json/)
    const { error, message } = response.body
    expect(error).toBe(true)
    expect(message).toEqual(
      "Request does not contain base64 encoded url parameter 'query'"
    )
  })

  test("GET /calculus returns 400 and error message when url parameter 'query' is not a proper math expression", async () => {
    const query = "MiAqICgyMy8oMyozKSktIDIzICogKDIqMy"
    const response = await api
      .get(`/calculus?query=${query}`)
      .expect(400)
      .expect("Content-Type", /application\/json/)
    const { error, message } = response.body
    expect(error).toBe(true)
    expect(message).toEqual(
      "Malformatted expression, parentheses are not balanced."
    )
  })

  test("GET /calculus returns 200 when url parameter 'query' is a proper math expression", async () => {
    const query = "MiAqICgyMy8oMyozKSktIDIzICogKDIqMyk"
    const response = await api
      .get(`/calculus?query=${query}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)
    const { error, result } = response.body
    expect(error).toBe(false)
    expect(result).toBe(-132.88888888888889)
  })
})

afterAll(() => {
  server.close()
})
