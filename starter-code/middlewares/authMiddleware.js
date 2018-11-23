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
  const { _id } = req.session.currentUser;
  const activityID = req.params.activityID;
  console.log(_id);
  console.log(activityID);
  User.findById(_id)
    .then((user) => {
      const userActivities = user.activities;
      if (!userActivities.includes(activityID)) {
        return res.redirect('/');
      }
    })
    .catch(next);

  next();
};

module.exports = authMiddleware;
