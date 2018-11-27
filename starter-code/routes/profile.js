const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware

router.get('/', authMiddleware.requireUser, (req, res, next) => {
  const { _id } = req.session.currentUser;
  User.findById(_id)
    .populate('activities')
    .populate('trips')
    .populate('favourites')
    .then((user) => {
      res.render('profile/my-stuff', { user });
    })
    .catch(next);
});

router.get('/:userId/profile', authMiddleware.requireUser, (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId)
    .populate('activities')
    .populate('trips')
    .populate('favourites')
    .then((user) => {
      res.render('profile/my-stuff', { user });
    })
    .catch(next);
});

module.exports = router;
