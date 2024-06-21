/*
  Developer Name:   Sheldon Skaggs
  Date:             6/21/2024
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