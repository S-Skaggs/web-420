/*
  Developer Name:   Sheldon Skaggs
  Date:             6/29/2024
  File Name:        app.spec.js
  Description:      Test file for the in-n-out-books site
*/

// Required modules
const app = require("../src/app");
const request = require("supertest");

// Create a test suite for in-n-out-book Chapter 3
describe("Chapter 3: API Tests", () => {
  // Test to return all books
  it("should return an array of books", async () => {
    const res = await request(app).get("/api/books");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);

    res.body.forEach((book) => {
      expect(book).toHaveProperty("id");
      expect(book).toHaveProperty("title");
      expect(book).toHaveProperty("author");
    });
  });

  // Test to return a single book
  it("should return a single book", async () => {
    const res = await request(app).get("/api/books/3");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id", 3);
    expect(res.body).toHaveProperty("title", "The Two Towers");
    expect(res.body).toHaveProperty("author", "J.R.R. Tolkien");
  });

  // Test status code is a 400 if id is not a number
  it("should return a 400 error if the id is not a number", async () => {
    const res = await request(app).get("/api/books/aBook");

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Input must be a number");
  });
});

// Test suite for Chapter 4: API Tests
describe("Chapter 4: API Tests", () => {
  // Test to return a 201 status code when inserting a new book
  it("should return a 201 status code when adding a new book", async () => {
    // Send a request and await the response
    const res = await request(app).post("/api/books").send({
      id: 100,
      title: "This Doesn't Happen in the Movies",
      author: "Renee Pawlish"
    });

    expect(res.statusCode).toEqual(201);
  });

  // Test to return 400 when trying to add a new book with a missing title
  it("should return a 400 status code when adding a new book with missing title", async () => {
    // Send a request and await the response
    const res = await request(app).post("/api/books/").send({
      id: 101,
      author: "Renee Pawlish"
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Bad Request");
  });

  // Test to return a 204 status code when deleting a book
  it("should return a 204 status code when deleting a book", async () => {
    // Send a request and await the response
    const res = await request(app).delete("/api/books/100");

    expect(res.statusCode).toEqual(204);
  });
});

// Test suite for Chapter 5: API Tests
describe("Chapter 5: API Tests", () => {
  // Test to return a 204 status code when a book is successfully updated
  it("should return a 204 status code when updating a book", async () => {
    const res = await request(app).put("/api/books/1").send({
      title: "The Fellowship of the Ring",
      author: "J.R.R. Tolkien"
    });

    expect(res.statusCode).toEqual(204);
  });

  // Test to return a 400 status code when id is not numeric
  it("should return a 400 status code when updating a book with a non-numeric id", async () => {
    const res = await request(app).put("/api/books/Test").send({
      name: "Test Book of Tests",
      author: "Test Author"
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Input must be a number");
  });

  // Test to return a 400 status code when missing keys
  it("should return a 400 status code when updating a book with missing keys", async () => {
    const res = await request(app).put("/api/books/1").send({
      name: "The Fellowship of the Ring"
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Bad Request");
  });

  // Test to return a 400 status code when too many keys
  it("should return a 400 status code when updating a book with too many keys", async () => {
    const res = await request(app).put("/api/books/1").send({
      name: "The Fellowship of the Ring",
      author: "J.R.R. Tolkien",
      foo: "BAR"
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Bad Request");
  });
});

// Test suite for Chapter 6: API Tests
describe("Chapter 6: API Tests", () => {
  // Test to return a 200 status code when successfully authenticated
  it("should return a status code of 200 and 'Authentication successful' message when user authenticates", async () => {
    const res = await request(app).post("/api/login").send({
      email: "ron@hogwarts.edu",
      password: "weasley"
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Authentication successful");
  });

  // Test to return a 401 status code when using incorrect credentials
  it("should return a 401 status code and 'Unauthorized' message when incorrect credentials are provided", async () => {
    const res = await request(app).post("/api/login").send({
      email: "ron@hogwarts.edu",
      password: "weasel"
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Unauthorized");
  });

  // Test to return a 400 status code when missing keys
  it("should return a 400 status code and 'Bad Request' message if missing email or password", async () => {
    const res = await request(app).post("/api/login").send({
      email: "ron@hogwarts.edu"
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Bad Request");
  });

  // Test to return a 400 status code when too many keys
  it("should return a 400 status code and 'Bad Request' message if too many keys provided", async () => {
    const res = await request(app).post("/api/login").send({
      email: "ron@hogwarts.edu",
      password: "weasley",
      extra: "A little something extra."
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Bad Request");
  });
});

// Test suite for Chapter 7: API Tests
describe("Chapter 7: API Tests", () => {
  // Test to return a 200 status code when security questions answered
  it("should return a 200 status code with a message of 'Security questions successfully answered' when security questions answered correctly", async () => {
    const res = await request(app).post("/api/users/ron@hogwarts.edu/verify-security-questions").send({
      securityQuestions: [
        {answer: "Scabbers"},
        {answer: "The Quibbler"},
        {answer: "Prewett"}
      ]
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Security questions successfully answered");
  });

  // Test to return a 400 status code when request fails ajv validation
  it("should return a 400 status code with a message of 'Bad Request' when the request fails ajv validation", async () => {
    const res = await request(app).post("/api/users/ron@hogwarts.edu/verify-security-questions").send({
      securityQuestions: [
        {answer: "Scabbers"},
        {someBook: "It's the Great Pumpkin, Charlie Brown"},
        {answer: "Prewett"}
      ]
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Bad Request");
  });

  // Test to return a 401 status code when security questions are incorrect
  it("should return a 401 status code with a message of 'Unauthorized' when the security questions are incorrect", async () => {
    const res = await request(app).post("/api/users/ron@hogwarts.edu/verify-security-questions").send({
      securityQuestions: [
        {answer: "Scabbers"},
        {answer: "It's the Great Pumpkin, Charlie Brown"},
        {answer: "Prewett"}
      ]
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Unauthorized");
  });
});