/*
  Developer Name:   Sheldon Skaggs
  Date:             6/29/2024
  File Name:        app.js
  Description:      Express application for the in-n-out-books site
*/

// Setup the Express application with the require statements
const express = require("express");
const bcrypt = require("bcryptjs");
const createError = require("http-errors");

// Create an Express application in a variable
const app = express(); // Creates an Express application
const books = require("../database/books"); // require books mock database

// Tell Express to parse incoming requests as JSON payloads
app.use(express.json());

// Tell Express to parse incoming urlencoded payloads
app.use(express.urlencoded({ extended: true }));

// Add Routes
app.get('/', async (req, res, next) => {
  // HTML content for the landing page
  const html = `
  <html>
  <head>
    <title>In-N-Out-Books</title>
    <style>
      body, h1, h2, h3 { margin: 0; padding: 0; border: 0; }
      body {
        background: #FAF0E6;
        color: #000;
        margin: 1.25rem;
        font-size: 1.25rem;
      }
      h1, h2, h3 { color: #008000; font-family: 'Papyrus', fantasy; }
      h1, h2 { text-align: center; }
      h3 { color: #000; }
      .container { width: 50%; margin: 0 auto; font-family: 'Georgia', serif; }
      .book { border: 1px solid #008000; padding: 1rem; margin: 1rem 0; }
      .book h3 { margin-top: 0; }
    </style>
  </head>
  <body>
    <div class="container">
      <header>
        <h1>In-N-Out-Books</h1>
        <h2>Your Next Adventure is Just a Page Away</h2>
      </header>

      <br />

      <main>
        <p>The idea of the "In-N-Out-Books" was inspired by the love of books and the desire to create a platform where users can manage their own collection of books.</p>
        <p>Whether you are an avid reader who wants to keep track of the books you've read, or a book club organizer who needs to manage a shared collection, "In-N-Out-Books" is designed to cater to your needs.</p>
      </main>
    </div>
  </body>
  </html>
  `; //End content for the landing page

  res.send(html); // Sends the HTML content to the client
});

// Route to get a list of all books
app.get("/api/books", async (req, res, next) => {
  try {
    // Get an array of all books
    const allBooks = await books.find();

    // Send the array in the response
    res.send(allBooks);
  } catch (err) {
    // Log any error message
    console.error("Error: ", err.message);

    // Pass error to the next middleware
    next(err);
  }
});

// Route to get a single book by id
app.get("/api/books/:id", async (req, res, next) => {
  try {
    // Create a variable to hold the id parameter
    let { id} = req.params;
    id = parseInt(id);

    // Check that the id is a number
    if(isNaN(id)) {
      // Return a 400 error, id should be a number
      return next(createError(400, "Input must be a number"));
    }

    // Get a book using the id parameter
    const book = await books.findOne({ id: id });

    // Send the book in the response
    res.send(book);
  } catch (err) {
    // Log any error message
    console.error("Error: ", err.message);

    // Pass error to the next middleware
    next(err);
  }
});

// Post a new book
app.post("/api/books", async (req, res, next) => {
  try {
    // Assign request body, which should be a new book, to a variable
    const newBook = req.body;

    // Create array of expected keys and actual keys for validation
    const expectedKeys = ["id", "title", "author"];
    const actualKeys = Object.keys(newBook);

    // Validate keys
    if(!actualKeys.every(key => expectedKeys.includes(key)) || actualKeys.length !== expectedKeys.length){
      // Log an error
      console.error("Bad Request: Missing keys or extra keys", actualKeys);
      // Pass new error object to next middleware
      return next(createError(400, "Bad Request"));
    }

    // Insert the new book
    const result = await books.insertOne(newBook);
    res.status(201).send({id: result.ops[0].id});
  } catch (err) {
    // Log the error
    console.error("Error: ", err.message);
    // Pass the error to the next middleware
    next(err);
  }
});

// Delete a book
app.delete("/api/books/:id", async (req, res, next) => {
  try {
    // Get the id from the parameters
    const { id } = req.params;

    // Delete the book for the given id
    const result = await books.deleteOne({ id: parseInt(id) });
    res.status(204).send();
  } catch (err) {
    // Check for no matching book found
    if(err.message === "No matching item found") {
      return next(createError(404, "Book not found"));
    }

    // Log error
    console.error("Error: ", err.message);
    // Pass the error to the next middleware
    next(err);
  }
});

// Update a book using PUT
app.put("/api/books/:id", async (req, res, next) => {
  try {
    // Create variables to hold the id and the book updates
    let { id } = req.params;
    let bookUpdates = req.body;

    // Convert the supplied id to an int using parseInt
    id = parseInt(id);

    // Check that the id is a number
    if(isNaN(id)) {
      // Return a 400 error, id should be a number
      return next(createError(400, "Input must be a number"));
    }

    // Create variables for expected and actual keys for validation
    const expectedKeys = ["title", "author"];
    const actualKeys = Object.keys(bookUpdates);

    if(!actualKeys.every(key => expectedKeys.includes(key)) || expectedKeys.length !== actualKeys.length) {
      // Pass a new 400 error to the next middleware
      next(createError(400, "Bad Request"));
    }

    // Update the book
    const result = await books.updateOne({ id: id }, bookUpdates);
    res.status(204).send();
  } catch (err) {
    if(err.message === "No matching item found") {
      // Pass a new 404 error to the next middleware
      return next(createError(404, "Book not found"));
    }

    // Pass error to the next middleware
    next(err);
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // Set status code to 500 if no status code was provided in the error
  res.status(err.status || 500);

  res.json({
    type: 'error',
    status: err.status,
    message: err.message,
    stack: req.app.get('env') === 'development' ? err.stack : undefined
  });
});

module.exports = app;