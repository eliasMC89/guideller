const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Activity = require('../models/activity');
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware
const formMiddleware = require('../middlewares/formMiddleware');

/* GET ducks page. */
router.get('/', (req, res, next) => {
  // R in CRUD
  Activity.find()
    .then((result) => {
      res.render('activities/list-activities', { activities: result });
    })
    .catch(next);
});

// Render the create duck form
router.get('/create', authMiddleware.requireUser, (req, res, next) => {
  res.render('activities/create-activity', { title: 'Activities' });
});

/* router.get('/people', (req, res, next) => {
  User.find()
    .populate('ducks')
    .then((result) => {
      res.render('ducks/peoples-ducks', { users: result });
    })
    .catch(next);
}); */

// Receive the duck post
router.post('/', authMiddleware.requireUser, (req, res, next) => {
  // to see the information from the post, we need the body of the request
  const { name, location } = req.body;
  const { _id } = req.session.currentUser;
  const newActivity = new Activity({ name, location });
  const updateUserPromise = User.findByIdAndUpdate(_id, { $push: { activities: newActivity._id } });
  const saveActivityPromise = newActivity.save();

  Promise.all([updateUserPromise, saveActivityPromise])
    .then(() => {
      res.redirect('/activities');
    })
    .catch(next);
});

/*
router.get('/:duckId/edit', (req, res, next) => {
  const duckId = req.params.duckId;

  Duck.findById(duckId)
    .then((duck) => {
      res.render('ducks/edit-duck', { duck });
    })
    .catch(next);
});

// U in CRUD
router.post('/:duckId/edit', (req, res, next) => {
  const duckId = req.params.duckId;
  const updatedDuckInformation = req.body;

  Duck.findByIdAndUpdate(duckId, { $set: updatedDuckInformation })
    .then((duck) => {
      res.redirect('/ducks');
    })
    .catch(next);
});

// D in CRUD
router.post('/:duckId/delete', (req, res, next) => {
  const duckId = req.params.duckId;
  Duck.deleteOne({ _id: duckId })
    .then((result) => {
      res.redirect('/ducks');
    })
    .catch(next);
}); */

module.exports = router;
