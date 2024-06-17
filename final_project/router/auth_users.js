const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const getAllBooksFromDB = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 1000);
  });
};

const getBookDetailsByISBN = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve;
    });
  });
};

const doesExist = (username) => {
  let foundUser = users.filter((user) => user.username === username);
  if (foundUser.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  let validUser = users.filter(
    (user) => user.username === username && user.password === password
  );
  return validUser.length > 0 ? true : false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let reviews = req.body.reviews;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
      reviews,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let username = req.body.username;
  let reviews = req.body.reviews;
  let isbn = req.params.isbn;
  let booksObj = books[isbn];

  if (booksObj) {
    if (booksObj.reviews.username) {
      booksObj.reviews[username] = reviews.review;
    } else {
      booksObj.reviews[username] = reviews;
    }
    res
      .status(200)
      .send({ message: `${booksObj.title} review has been added` });
  } else {
    res
      .status(404)
      .send({ message: `The provided isbn ${isbn} was not found.` });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let username = req.session.authorization.username;
  let booksObj = books[isbn];

  if (!booksObj) {
    return res.status(404).send("Book not found");
  }

  if (booksObj.reviews.hasOwnProperty(username)) {
    delete booksObj.reviews[username];
    res.status(200).send(`User ${username}'s review has been deleted`);
  } else {
    res.status(404).send("User was not found");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.doesExist = doesExist;
module.exports.getAllBooksFromDB = getAllBooksFromDB;
