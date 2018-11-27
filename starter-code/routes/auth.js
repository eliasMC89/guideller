'use strict';

const express = require('express');
const router = express.Router();

const User = require('../models/user');
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware
const formMiddleware = require('../middlewares/formMiddleware');

const bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET sign up page */
router.get('/signup', authMiddleware.requireAnon, (req, res, next) => {
  const data = {
    messages: req.flash('validationError')
  };
  res.render('auth/signup', data);
});

/* POST sign up user data */
router.post('/signup', authMiddleware.requireAnon, authMiddleware.checkUserAvailable, formMiddleware.requireSignUpFields, (req, res, next) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);
  User.create({
    username,
    password: hashedPassword
  })
    .then((newUser) => {
      req.session.currentUser = newUser;
      res.redirect('/activities');
    })
    .catch(next);
});

/* Post user log in data */
router.post('/login', authMiddleware.requireAnon, formMiddleware.requireLoginFields, authMiddleware.checkUserExists, authMiddleware.checkPassword, (req, res, next) => {
  const { username } = req.body;
  User.findOne({ username })
    .then((user) => {
      req.session.currentUser = user;
      res.redirect('/activities');
    })
    .catch(next);
});

/* POST logout */
router.post('/logout', authMiddleware.requireUser, (req, res, next) => {
  delete req.session.currentUser;
  res.redirect('/');
});

module.exports = router;
