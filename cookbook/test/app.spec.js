const app = require("../src/app"); // Require our app
const request = require("supertest"); // Require supertest

// Create a test suite for Chapter 3
describe("Chapter 3: API Tests", () => {
  // Test for get recipes
  it("should return an array of recipes", async () => {
    const res = await request(app).get("/api/recipes");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);

    res.body.forEach((recipe) => {
      expect(recipe).toHaveProperty("id");
      expect(recipe).toHaveProperty("name");
      expect(recipe).toHaveProperty("ingredients");
    });
  });

  // Test for a single recipe
  it("should return a single recipe", async () => {
    const res = await request(app).get("/api/recipes/1");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id", 1);
    expect(res.body).toHaveProperty("name", "Pancakes");
    expect(res.body).toHaveProperty("ingredients", ["flour", "milk", "eggs"]);
  });

  // Rest for status code 400 when id is not a Number
  it("should return a 400 error if the id is not a number", async () => {
    const res = await request(app).get("/api/recipes/foo");
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Input must be a number");
  });
});

// Create a test suite for Chapter 4
describe("Chapter 4: API Tests", () => {
  // Test to return 201 when inserting new recipe
  it("should return a 201 status code when adding a new recipe", async () => {
    // Call API to insert new recipe
    const res = await request(app).post("/api/recipes").send({
      id: 99,
      name: "Grilled Cheese",
      ingredients: ["bread", "cheese", "butter"]
    });

    expect(res.statusCode).toEqual(201);
  });

  // Test to return 400 Bad Request when attempting to add invalid data
  it("should return a 400 status code when adding a new recipe with missing name", async () => {
    const res = await request(app).post("/api/recipes").send({
      id: 100,
      ingredients: ["bread", "cheese", "butter"]
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Bad Request");
  });

  // Test to return 204 when deleting a recipe
  it("should return a 204 status code when deleting a recipe", async () => {
    const res = await request(app).delete("/api/recipes/99");

    expect(res.statusCode).toEqual(204);
  });
});