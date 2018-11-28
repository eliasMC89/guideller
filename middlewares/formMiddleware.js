'use strict';

const formMiddleware = {};

// Middleware to check for empty fields
formMiddleware.requireLoginFields = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    req.flash('validationError', 'Fill in all fields!');
    return res.redirect('/');
  }
  next();
};

formMiddleware.requireSignUpFields = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    req.flash('validationError', 'Fill in all fields!');
    return res.redirect('/auth/signup');
  }
  next();
};

formMiddleware.requireCreateActivityFields = (req, res, next) => {
  const { name, country, city, address, type, price } = req.body;
  if (!name || !country || !city || !type || !price) {
    req.flash('validationError', 'Fill in the required fields!');
    return res.redirect('/activities/create');
  }
  next();
};

formMiddleware.requireEditActivityFields = (req, res, next) => {
  const { name, country, city, address, type, price } = req.body;
  // const activityId = req.params.activityId;
  if (!name || !country || !city || !type || !price) {
    req.flash('validationError', 'Fill in the required fields!');
    return res.redirect(`/activities${req.path}`);
  }
  next();
};

formMiddleware.requireCreateTripFields = (req, res, next) => {
  const { name, location, budget } = req.body;
  if (!name || !location || !budget) {
    req.flash('validationError', 'Fill in all fields!');
    return res.redirect('/trips/create');
  }
  next();
};

formMiddleware.requireEditTripFields = (req, res, next) => {
  const { name, location, budget } = req.body;
  if (!name || !location || !budget) {
    req.flash('validationError', 'Fill in all fields!');
    return res.redirect(`/trips${req.path}`);
  }
  next();
};

module.exports = formMiddleware;
