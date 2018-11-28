'use strict';

const dotenv = require('dotenv').config();
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); // Middlewar
const User = require('../models/user');
const Activity = require('../models/activity');
const formMiddleware = require('../middlewares/formMiddleware');
const activityMiddleware = require('../middlewares/activityMiddleware');

router.get('/', authMiddleware.requireUser, (req, res, next) => {
  Activity.find()
    .then((activities) => {
      res.render('activities/list-activities', { activities });
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

// Receive the acitivity post
router.post('/', authMiddleware.requireUser, formMiddleware.requireCreateActivityFields, (req, res, next) => {
  // to see the information from the post, we need the body of the request
  const { name, country, city, address, type, price, photoURL, reservation, description } = req.body;
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
