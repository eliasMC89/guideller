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

router.get('/user-trips/:activityId', (req, res, next) => {
  const activityId = req.params.activityId;
  const { _id } = req.session.currentUser;
  User.findById(_id)
    .populate('trips')
    .then((user) => {
      Activity.findById(activityId)
        .then((activity) => {
          res.render('trips/user-trips', { user, activity });
        });
    })
    .catch(next);
});

router.post('/:tripId/add-delete-this/:activityId', (req, res, next) => {
  const tripId = req.params.tripId;
  const activityId = req.params.activityId;
  Trip.findById(tripId)
    .then((trip) => {
      const tripActivities = trip.activities;
      if (tripActivities.indexOf(activityId) < 0) {
        Trip.findByIdAndUpdate(tripId, { $push: { activities: activityId } })
          .then(() => {
            return res.json({ status: 'Added' });
          });
      } else {
        Trip.findByIdAndUpdate(tripId, { $pull: { activities: activityId } })
          .then(() => {
            return res.json({ status: 'Deleted' });
          });
      }
    })
    .catch(next);
});

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
  const updateUserPromise = User.findByIdAndUpdate(_id, { $push: { trips: newTrip._id } }, { new: true });
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
          const { _id } = req.session.currentUser;
          User.findById(_id)
            .populate('trips')
            .then((user) => {
              const userFavourites = user.favourites;
              activities.map((activity) => {
                activity.addedFavourite = false;
                if (userFavourites.indexOf(activity._id) >= 0) {
                  activity.addedFavourite = true;
                }
              });
              res.render('trips/activities-trip', { activities, tripId, user }); // tripId: req.params.tripId
            });
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

router.post('/:tripId/delete/:activityId', authMiddleware.requireUser, (req, res, next) => {
  const tripId = req.params.tripId;
  const activityId = req.params.activityId;
  Trip.findById(tripId)
    .then((trip) => {
      Activity.findById(activityId)
        .then((activity) => {
          let newBudget = trip.currentBudget + activity.price;
          Trip.findByIdAndUpdate(tripId, { $set: { currentBudget: newBudget }, $pull: { activities: activityId } }) //, { $push: { activities: activityId } }
            .then(() => {
              res.redirect(`/trips/${tripId}/details`);
            })
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = router;
