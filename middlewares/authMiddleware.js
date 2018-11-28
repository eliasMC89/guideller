'use strict';

const User = require('../models/user');
const bcrypt = require('bcrypt');

const authMiddleware = {};

// if user is logged in, can't login or sign up
authMiddleware.requireAnon = (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/activities');
  }
  next();
};

// if user is not logged in, can't log out
authMiddleware.requireUser = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  next();
};

// check if user exists already for signup
authMiddleware.checkUserAvailable = (req, res, next) => {
  const { username } = req.body;
  // Check if username exists
  User.findOne({ username })
    .then((user) => {
      if (user) {
        req.flash('validationError', 'User already exists!');
        return res.redirect('/auth/signup');
      }
      next();
    })
    .catch(next);
};

// check if user exist for login
authMiddleware.checkUserExists = (req, res, next) => {
  const { username } = req.body;
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        req.flash('validationError', "User doesn't exist!");
        return res.redirect('/');
      }
      next();
    })
    .catch(next);
};

// check user password
authMiddleware.checkPassword = (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then((user) => {
      if (!bcrypt.compareSync(password, user.password)) {
        req.flash('validationError', 'Wrong password!');
        res.redirect('/');
      }
      next();
    })
    .catch(next);
};

module.exports = authMiddleware;
