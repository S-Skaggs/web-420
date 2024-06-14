/*
  Developer Name:   Sheldon Skaggs
  Date:             6/14/2024
  File Name:        app.js
  Description:      Express application for the in-n-out-books site
*/

// Setup the Express application with the require statements
const express = require("express");
const bcrypt = require("bcryptjs");
const createError = require("http-errors");

// Create an Express application in a variable
const app = express(); // Creates an Express application

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