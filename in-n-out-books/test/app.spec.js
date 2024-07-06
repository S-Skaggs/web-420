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