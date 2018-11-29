'use strict';

const express = require('express');
const router = express.Router();
const parser = require('../helpers/file-upload');
const authMiddleware = require('../middlewares/authMiddleware'); // Middlewar
const User = require('../models/user');
const Activity = require('../models/activity');
const formMiddleware = require('../middlewares/formMiddleware');
const activityMiddleware = require('../middlewares/activityMiddleware');

router.get('/', authMiddleware.requireUser, (req, res, next) => {
  Activity.find()
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
          res.render('activities/list-activities', { activities, user });
        });
    })
    .catch(next);
});

// Receive the acitivity post
router.post('/', authMiddleware.requireUser, parser.single('photoURL'), formMiddleware.requireCreateActivityFields, (req, res, next) => { /// parser.single('photoURL')
  // to see the information from the post, we need the body of the request
  const { name, country, city, address, type, price, reservation, description } = req.body;
  let photoURL;
  if (!req.file) {
    photoURL = 'https://res.cloudinary.com/emcar7ih/image/upload/v1543490675/demo/ironhack.png';
  } else {
    // if (req.fileValidationError) {
    //   req.flash('validationError', 'Wrong file type uploaded');
    //   return res.redirect('/activities/create');
    // }
    photoURL = req.file.secure_url;
  }
  const { _id } = req.session.currentUser;
  const newActivity = new Activity({ name, country, city, address, type, price, photoURL, reservation, description, owner: _id });
  const updateUserPromise = User.findByIdAndUpdate(_id, { $push: { activities: newActivity._id } });
  const saveActivityPromise = newActivity.save();

  Promise.all([updateUserPromise, saveActivityPromise])
    .then(() => {
      res.redirect('/profile');
    })
    .catch(next);
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
router.post('/:activityId/edit', authMiddleware.requireUser, activityMiddleware.checkActivityUser, parser.single('photoURL'), formMiddleware.requireEditActivityFields, (req, res, next) => {
  const activityId = req.params.activityId;
  const body = req.body;
  let photoURL;
  if (!req.file) {
    photoURL = 'https://res.cloudinary.com/emcar7ih/image/upload/v1543490675/demo/ironhack.png';
  } else {
    photoURL = req.file.secure_url;
  }
  const updatedActivityInformation = { body, photoURL };

  Activity.findByIdAndUpdate(activityId, { $set: updatedActivityInformation })
    .then(() => {
      res.redirect('/profile');
    })
    .catch(next);
});

// // D in CRUD
router.post('/:activityId/delete', authMiddleware.requireUser, activityMiddleware.checkActivityUser, (req, res, next) => {
  const activityId = req.params.activityId;
  const userId = req.session.currentUser;
  Activity.deleteOne({ _id: activityId })
    .then(() => {
      User.findByIdAndUpdate(userId, { $pull: { activities: activityId } })
        .then(() => {
          res.redirect('/profile');
        });
    })
    .catch(next);
});

router.get('/:activityId/details', authMiddleware.requireUser, (req, res, next) => {
  const activityId = req.params.activityId;
  // const userId = req.session.currentUser;
  Activity.findById({ _id: activityId })
    .populate('owner')
    .then((activity) => {
      const { _id } = req.session.currentUser;
      User.findById(_id)
        .populate('trips')
        .then((user) => {
          const userFavourites = user.favourites;
          activity.addedFavourite = false;
          if (userFavourites.indexOf(activity._id) >= 0) {
            activity.addedFavourite = true;
          }
          res.render('activities/activity-details', { activity, user });
        });
    })
    .catch(next);
});

module.exports = router;
