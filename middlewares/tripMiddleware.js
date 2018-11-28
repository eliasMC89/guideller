'use strict';

const User = require('../models/user');
const Trip = require('../models/trip');

const tripMiddleware = {};

// if user is owner of the trip
tripMiddleware.checkTripUser = (req, res, next) => {
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

// Check if activities in trip already
tripMiddleware.checkTripActivities = (req, res, next) => {
  const tripId = req.params.tripId;
  const activityId = req.params.activityId;
  Trip.findById(tripId)
    .then((trip) => {
      console.log(trip);
      const tripActivities = trip.activities;
      if (tripActivities.indexOf(activityId) >= 0) {
        res.redirect(`/trips/${tripId}/addActivity`);
      } else {
        next();
      }
    })
    .catch(next);
};

module.exports = tripMiddleware;
