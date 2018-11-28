'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Trip = require('../models/trip');
const Activity = require('../models/activity');
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware
// const formMiddleware = require('../middlewares/formMiddleware');
const tripMiddleware = require('../middlewares/tripMiddleware');
const formMiddleware = require('../middlewares/formMiddleware');

/* GET trips page. */
router.get('/', (req, res, next) => {
  const { _id } = req.session.currentUser;
  User.findById(_id)
    .populate('trips')
    .then((user) => {
      res.render('trips/my-trips', { user });
    })
    .catch(next);
});

// router.get('/my', authMiddleware.requireUser, (req, res, next) => {
//   const { _id } = req.session.currentUser;
//   User.findById(_id)
//     .populate('activities')
//     .then((user) => {
//       res.render('activities/my-activities', { user });
//     })
//     .catch(next);
// });

// Render the create trips form
router.get('/create', authMiddleware.requireUser, (req, res, next) => {
  const messageData = {
    messages: req.flash('validationError')
  };
  res.render('trips/create-trip', messageData);
});

// Receive the trips post
router.post('/', authMiddleware.requireUser, formMiddleware.requireCreateTripFields, (req, res, next) => {
  // to see the information from the post, we need the body of the request
  const { name, location, budget } = req.body;
  const { _id } = req.session.currentUser;
  const newTrip = new Trip({ name, location, budget });
  const updateCurrentBudgetPromise = Trip.findByIdAndUpdate(newTrip._id, { $set: { currentBudget: budget } });
  const updateUserPromise = User.findByIdAndUpdate(_id, { $push: { trips: newTrip._id } });
  const saveTripPromise = newTrip.save();

  Promise.all([updateUserPromise, saveTripPromise, updateCurrentBudgetPromise])
    .then(() => {
      res.redirect('/profile');
    })
    .catch(next);
});

router.get('/:tripId/edit', authMiddleware.requireUser, tripMiddleware.checkTripUser, (req, res, next) => {
  const tripId = req.params.tripId;
  Trip.findById(tripId)
    .then((trip) => {
      const data = {
        messages: req.flash('validationError'),
        trip
      };
      res.render('trips/edit-trip', data);
    })
    .catch(next);
});

// U in CRUD
router.post('/:tripId/edit', authMiddleware.requireUser, tripMiddleware.checkTripUser, formMiddleware.requireEditTripFields, (req, res, next) => {
  const tripId = req.params.tripId;
  const updatedTripInformation = req.body;
  Trip.findByIdAndUpdate(tripId, { $set: updatedTripInformation })
    .then(() => {
      res.redirect('/profile');
    })
    .catch(next);
});

// // // D in CRUD
router.post('/:tripId/delete', authMiddleware.requireUser, tripMiddleware.checkTripUser, (req, res, next) => {
  const tripId = req.params.tripId;
  const userId = req.session.currentUser;
  Trip.deleteOne({ _id: tripId })
    .then(() => {
      User.findByIdAndUpdate(userId, { $pull: { trips: tripId } })
        .then(() => {
          res.redirect('/profile');
        });
    })
    .catch(next);
});

// // Get all the activities to add
router.get('/:tripId/addActivity', (req, res, next) => {
  const tripId = req.params.tripId;
  let tripActivities;
  Trip.findById(tripId)
    .then((trip) => {
      tripActivities = trip.activities;
      Activity.find({ _id: { $nin: tripActivities } })
        .then((activities) => {
          res.render('trips/activities-trip', { activities, tripId }); // tripId: req.params.tripId
        })
        .catch(next);
    })
    .catch(next);
});

// Add activites to trip
router.post('/:tripId/addActivity/:activityId', tripMiddleware.checkTripActivities, (req, res, next) => {
  const tripId = req.params.tripId;
  const activityId = req.params.activityId;
  Trip.findById(tripId)
    .then((trip) => {
      Activity.findById(activityId)
        .then((activity) => {
          if (trip.currentBudget >= activity.price) {
            let newBudget = trip.currentBudget - activity.price;
            Trip.findByIdAndUpdate(tripId, { $set: { currentBudget: newBudget }, $push: { activities: activityId } }) //, { $push: { activities: activityId } }
              .then(() => {
                return res.redirect(`/trips/${tripId}/addActivity`);
              })
              .catch(next);
          } else {
            return res.redirect(`/trips/${tripId}/addActivity`);
          }
        })
        .catch(next);
    })
    .catch(next);
});

router.get('/:tripId/details', authMiddleware.requireUser, (req, res, next) => {
  const tripId = req.params.tripId;
  Trip.findById({ _id: tripId })
    .populate('activities')
    .then((trip) => {
      res.render('trips/trip-details', { trip });
    })
    .catch(next);
});

module.exports = router;
