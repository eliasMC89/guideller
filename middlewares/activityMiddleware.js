'use strict';

const User = require('../models/user');

const activityMiddleware = {};

// if user is owner of the activity
activityMiddleware.checkActivityUser = (req, res, next) => {
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

// Check if activity already in favorites
activityMiddleware.checkUserFavouriteActivities = (req, res, next) => {
  const activityId = req.params.activityId;
  const userId = req.session.currentUser;
  User.findById(userId)
    .then((user) => {
      const userFavourites = user.favourites;
      if (userFavourites.indexOf(activityId) >= 0) {
        res.redirect('/activities');
      } else {
        next();
      }
    })
    .catch(next);
};

module.exports = activityMiddleware;
