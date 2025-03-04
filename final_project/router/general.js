const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required"});
    }

    // Check if username already exists
    if (users.find(user => user.username === username)) {
        return res.status(409).json({message: "Username already exists"});
    }

    // Create new user
    const newUser = {
        username: username,
        password: password
    };

    // Add user to users array
    users.push(newUser);

    return res.status(201).json({
        message: "User registered successfully",
        username: username
    });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    }
    return res.status(404).json({message: "Book not found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let filtered_books = Object.values(books).filter((book) => book.author === author);
  if (filtered_books.length > 0) {
    return res.status(200).json(filtered_books);
  }
  return res.status(404).json({message: "No author found"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let filtered_books = Object.values(books).filter((book) => book.title === title);
  if (filtered_books.length > 0) {
    return res.status(200).json(filtered_books)
  }
  return res.status(404).json({message: "Title Not Found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn] && books[isbn].reviews) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({message: "No reviews found"});
});

module.exports.general = public_users;
