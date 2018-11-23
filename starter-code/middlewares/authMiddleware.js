'use strict';

const authMiddleware = {};
const User = require('../models/user');

// if user is logged in, can't login or sign up
authMiddleware.requireAnon = (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
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

authMiddleware.checkUser = (req, res, next) => {
  // console.log(req.params.activityId);
  const activityId = req.params.activityId;
  const { _id } = req.session.currentUser;
  User.findById(_id)
    .then((user) => {
      const userActivities = user.activities;
      if (userActivities.indexOf(activityId) < 0) {
        return res.redirect('/');
      }
    })
    .catch(next);

  next();
};

module.exports = authMiddleware;
