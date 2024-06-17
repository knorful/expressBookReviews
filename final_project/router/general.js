const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let doesExist = require("./auth_users.js").doesExist;
let getAllBooksFromDB = require("./auth_users.js").getAllBooksFromDB;
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
  getAllBooksFromDB()
    .then((books) => {
      res.send(books);
    })
    .catch((error) => res.status(500).send({ error: "Failed to fetch books" }));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  getAllBooksFromDB()
    .then((books) => {
      res.send(books[isbn]);
    })
    .catch((error) =>
      res
        .status(500)
        .send({ error: "Failed to fetch book details for this isbn" })
    );
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let author = req.params.author;
  let filtered_book;
  let booksByAuthor = {};
  let bookArr = [];
  getAllBooksFromDB()
    .then((books) => {
      for (let book in books) {
        let booksObj = books[book];
        if (booksObj.author === author) {
          delete booksObj.author;
          let formattedObj = {
            isbn: book,
            title: booksObj.title,
            reviews: booksObj.reviews,
          };
          bookArr.push(formattedObj);
          booksByAuthor["booksbyauthor"] = bookArr;
        }
      }
      res.send(booksByAuthor);
    })
    .catch((error) =>
      res
        .status(500)
        .send({ error: "Failed to fetch book details for this isbn" })
    );
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let title = req.params.title;
  let filtered_book;
  getAllBooksFromDB()
    .then((books) => {
      for (let book in books) {
        let booksObj = books[book];
        if (booksObj.title === title) {
          filtered_book = booksObj;
        }
      }
      res.send(filtered_book);
    })
    .catch((error) =>
      res
        .status(500)
        .send({ error: "Failed to fetch book details for this isbn" })
    );
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
