'use strict';

const authMiddleware = {};
const User = require('../models/user');
const Trip = require('../models/trip');

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

// if user is owner of the activity or trip
authMiddleware.checkActivityUser = (req, res, next) => {
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

// if user is owner of the activity or trip
authMiddleware.checkTripUser = (req, res, next) => {
  const tripId = req.params.tripId;
  const { _id } = req.session.currentUser;
  User.findById(_id)
    .then((user) => {
      const userTrips = user.trips;
      if (userTrips.indexOf(tripId) < 0) {
        return res.redirect('/');
      }
    })
    .catch(next);

  next();
};

authMiddleware.checkTripActivities = (req, res, next) => {
  const tripId = req.params.tripId;
  const activityId = req.params.activityId;
  Trip.findById(tripId)
    .then((trip) => {
      const tripActivities = trip.activities;
      if (tripActivities.indexOf(activityId) >= 0) {
        res.redirect(`/trips/${tripId}/addActivity`);
      } else {
        next();
      }
    })
    .catch(next);
};
module.exports = authMiddleware;
