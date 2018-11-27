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
router.post('/signup', authMiddleware.requireAnon, authMiddleware.checkUserExists, formMiddleware.requireSignUpFields, (req, res, next) => {
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

// /* GET log in page */
// router.get('/login', authMiddleware.requireAnon, (req, res, next) => {
//   const data = {
//     messages: req.flash('validationError')
//   };
//   res.render('auth/login', data);
// });

/* Post user log in data */
router.post('/login', authMiddleware.requireAnon, formMiddleware.requireLoginFields, (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then((user) => {
      // check if user exists
      if (!user) {
        req.flash('validationError', "User doesn't exist!");
        return res.redirect('/');
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect('/activities');
      } else {
        req.flash('validationError', 'Wrong password!');
        res.redirect('/');
      }
    })
    .catch(next);
});

/* POST logout */
router.post('/logout', authMiddleware.requireUser, (req, res, next) => {
  delete req.session.currentUser;
  res.redirect('/');
});

module.exports = router;
