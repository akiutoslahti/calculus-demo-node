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

  test("GET /calculus returns 400 and error message when url parameter 'query' has unbalanced parentheses", async () => {
    const query = Buffer.from(
      "2 * (23 / (3 * 3) - 23 * (2 * 3)",
      "UTF-8"
    ).toString("base64")
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

  test("GET /calculus returns 400 and error message when url parameter 'query' has too many operators", async () => {
    const query = Buffer.from(
      "2 * (*23 / (3 * 3)) - 23 * (2 * 3)",
      "UTF-8"
    ).toString("base64")
    const response = await api
      .get(`/calculus?query=${query}`)
      .expect(400)
      .expect("Content-Type", /application\/json/)
    const { error, message } = response.body
    expect(error).toBe(true)
    expect(message).toEqual(
      "Malformatted expression, incorrect count of operators."
    )
  })

  test("GET /calculus returns 400 and error message when url parameter 'query' has too few operators", async () => {
    const query = Buffer.from(
      "2 * (23 (3 * 3)) - 23 * (2 * 3)",
      "UTF-8"
    ).toString("base64")
    const response = await api
      .get(`/calculus?query=${query}`)
      .expect(400)
      .expect("Content-Type", /application\/json/)
    const { error, message } = response.body
    expect(error).toBe(true)
    expect(message).toEqual(
      "Malformatted expression, incorrect count of operators."
    )
  })

  test("GET /calculus returns 400 and error message when url parameter 'query' has unsupported operator", async () => {
    const query = Buffer.from("2 ^ 3", "UTF-8").toString("base64")
    const response = await api
      .get(`/calculus?query=${query}`)
      .expect(400)
      .expect("Content-Type", /application\/json/)
    const { error, message } = response.body
    expect(error).toBe(true)
    expect(message).toEqual("Expression contains unsupported operator.")
  })

  test("GET /calculus returns 200 when url parameter 'query' is a simple math expression", async () => {
    const query = Buffer.from("5 + 3 * 3", "UTF-8").toString("base64")
    const response = await api
      .get(`/calculus?query=${query}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)
    const { error, result } = response.body
    expect(error).toBe(false)
    expect(result).toBe(14)
  })

  test("GET /calculus returns 200 when url parameter 'query' is a simple math expression with negative operand", async () => {
    const query = Buffer.from("5 + -3 * 3", "UTF-8").toString("base64")
    const response = await api
      .get(`/calculus?query=${query}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)
    const { error, result } = response.body
    expect(error).toBe(false)
    expect(result).toBe(14)
  })

  test("GET /calculus returns 200 when url parameter 'query' is more complex math expression", async () => {
    const query = Buffer.from("2 * (23/(3*3))- 23 * (2*3)", "UTF-8").toString(
      "base64"
    )
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
