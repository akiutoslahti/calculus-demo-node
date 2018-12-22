const supertest = require("supertest")
const { app, server } = require("../index")

const api = supertest(app)

describe("calculus api", () => {
  test("GET /calculus returns 400 without url parameter 'query'", async () => {
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

  test("GET /calculus return 200 with url parameter 'query'", async () => {
    const testQuery = Buffer.from("test", "utf8")
    const encodedQuery = testQuery.toString("base64")
    const response = await api
      .get(`/calculus?query=${encodedQuery}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)
    const { error, message, decodedQuery } = response.body
    expect(error).toBe(false)
    expect(message).toEqual("Calculus function not yet implemented")
    expect(decodedQuery).toEqual(testQuery.toString("utf8").replace(/\s/g, ""))
  })
})

afterAll(() => {
  server.close()
})
