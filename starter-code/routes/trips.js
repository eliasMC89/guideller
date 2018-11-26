'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Trip = require('../models/trip');
const Activity = require('../models/activity');
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware
// const formMiddleware = require('../middlewares/formMiddleware');

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
  res.render('trips/create-trip', { title: 'Trips' });
});

// Receive the trips post
router.post('/', authMiddleware.requireUser, (req, res, next) => {
  // to see the information from the post, we need the body of the request
  const { name, location, budget } = req.body;
  const { _id } = req.session.currentUser;
  const newTrip = new Trip({ name, location, budget });
  const updateUserPromise = User.findByIdAndUpdate(_id, { $push: { trips: newTrip._id } });
  const saveTripPromise = newTrip.save();

  Promise.all([updateUserPromise, saveTripPromise])
    .then(() => {
      res.redirect('/trips');
    })
    .catch(next);
});

router.get('/:tripId/edit', authMiddleware.requireUser, authMiddleware.checkTripUser, (req, res, next) => {
  const tripId = req.params.tripId;
  Trip.findById(tripId)
    .then((trip) => {
      res.render('trips/edit-trip', { trip });
    })
    .catch(next);
});

// U in CRUD
router.post('/:tripId/edit', authMiddleware.requireUser, authMiddleware.checkTripUser, (req, res, next) => {
  console.log('posted the edit!!');
  const tripId = req.params.tripId;
  const updatedTripInformation = req.body;
  Trip.findByIdAndUpdate(tripId, { $set: updatedTripInformation })
    .then(() => {
      res.redirect('/trips');
    })
    .catch(next);
});

// D in CRUD
router.post('/:tripId/delete', authMiddleware.requireUser, authMiddleware.checkTripUser, (req, res, next) => {
  const tripId = req.params.tripId;
  Trip.deleteOne({ _id: tripId })
    .then(() => {
      res.redirect('/trips');
    })
    .catch(next);
});

// Get all the activities to add
router.get('/:tripId/addActivity', (req, res, next) => {
  const tripId = req.params.tripId;
  Activity.find()
    .then((activities) => {
      res.render('trips/activities-trip', { activities, tripId }); // tripId: req.params.tripId
    })
    .catch(next);
});

// Add activites to trip
router.post('/:tripId/addActivity/:activityId', (req, res, next) => {
  const tripId = req.params.tripId;
  const activityId = req.params.activityId;
  Trip.findByIdAndUpdate(tripId, { $push: { activities: activityId } })
    .then(() => {
      res.redirect(`/trips/${tripId}/addActivity`);
    });
});

module.exports = router;
