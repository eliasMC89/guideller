'use strict';

const dotenv = require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Activity = require('../models/activity');
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware
const formMiddleware = require('../middlewares/formMiddleware');
const activityMiddleware = require('../middlewares/activityMiddleware');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_API_KEY });
const { getDistanceFromLatLonInKm } = require('../helpers/calcDistanceCoords');

// // /* GET activities page. */
// router.get('/', (req, res, next) => {
//   Activity.find()
//     .then((result) => {
//       res.render('activities/list-activities', { activities: result });
//     })
//     .catch(next);
// });

router.get('/', authMiddleware.requireUser, async (req, res, next) => {
  // const { _id } = req.session.currentUser;
  // User.findById(_id);

  try {
    const activities = await Activity.find();

    const citiesCoordinates = {};
    for (let i = 0; i < activities.length; i++) {
      if (!citiesCoordinates[activities[i].location]) {
        const queryObj = {
          query: activities[i].location, // Barcelona = query
          limit: 2
        };
        const cityCoordinates = await geocodingClient.forwardGeocode(queryObj).send();
        // console.log('down here coordinates');
        // console.log(cityCoordinates.body);
        // console.log('up here coordinates ');
        citiesCoordinates[activities[i].location] = cityCoordinates.body.features[0].center;
      }
    }
    activities.sort((a, b) => {
      let result = -1;
      if (a.location !== 'Barcelona' && b.location === 'Barcelona') {
        result = 1;
      } else if (a.location !== 'Barcelona' && b.location !== 'Barcelona') {
        const cityADistanceBarcelona = getDistanceFromLatLonInKm(citiesCoordinates['Barcelona'][0], citiesCoordinates['Barcelona'][1], citiesCoordinates[a.location][0], citiesCoordinates[a.location][1]);
        const cityBDistanceBarcelona = getDistanceFromLatLonInKm(citiesCoordinates['Barcelona'][0], citiesCoordinates['Barcelona'][1], citiesCoordinates[b.location][0], citiesCoordinates[b.location][1]);

        if (cityADistanceBarcelona > cityBDistanceBarcelona) {
          console.log(a.location, cityADistanceBarcelona);
          console.log(b.location, cityBDistanceBarcelona);
          console.log('swap');

          result = 1;
        } else {
          console.log(a.location, cityADistanceBarcelona);
          console.log(b.location, cityBDistanceBarcelona);
          console.log('dont swap');
          result = -1;
        }
      }
      return result;
    });
    res.render('activities/list-activities', { activities });
  } catch (error) {
    next(error);
  }
});

router.get('/create-options', authMiddleware.requireUser, (req, res, next) => {
  res.render('activities/create-options', { title: 'Activities' });
});

// Render the create activity form
router.get('/create', authMiddleware.requireUser, (req, res, next) => {
  const messageData = {
    messages: req.flash('validationError')
  };
  res.render('activities/create-activity', messageData);
});

// Receive the acitivity post
router.post('/', authMiddleware.requireUser, formMiddleware.requireCreateActivityFields, (req, res, next) => {
  // to see the information from the post, we need the body of the request
  const { name, city, country, location, type, price, photoURL, reservation, description } = req.body;
  const { _id } = req.session.currentUser;
  const newActivity = new Activity({ name, city, country, location, type, price, photoURL, reservation, description, owner: _id });
  const updateUserPromise = User.findByIdAndUpdate(_id, { $push: { activities: newActivity._id } });
  const saveActivityPromise = newActivity.save();

  Promise.all([updateUserPromise, saveActivityPromise])
    .then(() => {
      res.redirect('/profile');
    })
    .catch(next);
});

router.get('/:activityId/edit', authMiddleware.requireUser, activityMiddleware.checkActivityUser, (req, res, next) => {
  const activityId = req.params.activityId;
  Activity.findById(activityId)
    .then((activity) => {
      const data = {
        messages: req.flash('validationError'),
        activity
      };
      res.render('activities/edit-activity', data);
    })
    .catch(next);
});

// U in CRUD
router.post('/:activityId/edit', authMiddleware.requireUser, activityMiddleware.checkActivityUser, formMiddleware.requireEditActivityFields, (req, res, next) => {
  const activityId = req.params.activityId;
  const updatedActivityInformation = req.body;
  Activity.findByIdAndUpdate(activityId, { $set: updatedActivityInformation })
    .then(() => {
      res.redirect('/profile');
    })
    .catch(next);
});

// // D in CRUD
router.post('/:activityId/delete', authMiddleware.requireUser, activityMiddleware.checkActivityUser, (req, res, next) => {
  const activityId = req.params.activityId;
  Activity.deleteOne({ _id: activityId })
    .then(() => {
      res.redirect('/profile');
    })
    .catch(next);
});

// >>>>>>>>>>>>>!!!!cambiar a my-profile
// router.get('/my', authMiddleware.requireUser, (req, res, next) => {
//   const { _id } = req.session.currentUser;
//   User.findById(_id)
//     .populate('activities')
//     .populate('trips')
//     .populate('favourites')
//     .then((user) => {
//       res.render('activities/my-activities', { user });
//     })
//     .catch(next);
// });

router.get('/:activityId/details', authMiddleware.requireUser, (req, res, next) => {
  const activityId = req.params.activityId;
  // const userId = req.session.currentUser;
  Activity.findById({ _id: activityId })
    .populate('owner')
    .then((activity) => {
      res.render('activities/activity-details', { activity });
    })
    .catch(next);
});

module.exports = router;
