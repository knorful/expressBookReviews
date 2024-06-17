const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let doesExist = require("./auth_users.js").doesExist;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({
        username,
        password,
      });
      return res.status(200).json({ message: "User successfully registered." });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  res.send(books[isbn]);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let author = req.params.author;
  let filtered_book;
  for (let book in books) {
    let booksObj = books[book];
    if (booksObj.author === author) {
      filtered_book = booksObj;
    }
  }
  res.send(filtered_book);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let title = req.params.title;
  let filtered_book;
  for (let book in books) {
    let booksObj = books[book];
    if (booksObj.title === title) {
      filtered_book = booksObj;
    }
  }
  res.send(filtered_book);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  let filtered_reviews;
  for (let book in books) {
    let booksObj = books[book];

    if (book == isbn) {
      console.log("hey");
      filtered_reviews = booksObj.reviews;
    }
  }
  res.send(filtered_reviews);
});

module.exports.general = public_users;
