'use strict';

const User = require('../models/user');

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
    return res.redirect('/auth/login');
  }
  next();
};

// check if user exists
authMiddleware.checkUserExists = (req, res, next) => {
  const { username } = req.body;
  // Check if username exists
  User.findOne({ username })
    .then((user) => {
      if (user) {
        req.flash('validationError', 'User already exists!');
        return res.redirect('/auth/signup');
      }
    })
    .catch(next);
  next();
};

module.exports = authMiddleware;
