'use strict';

const formMiddleware = {};

// Middleware to check for empty fields
formMiddleware.requireUserFields = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    req.flash('validationError', 'Fill in all fields!');
    return res.redirect(`/auth${req.path}`);
  }
  next();
};

formMiddleware.requireCreateActivityFields = (req, res, next) => {
  const { name, city, country, location, type, price } = req.body;
  if (!name || !city || !country || !location || !type || !price) {
    req.flash('validationError', 'Fill in the required fields!');
    return res.redirect('/activities/create');
  }
  next();
};

formMiddleware.requireEditActivityFields = (req, res, next) => {
  const { name, city, country, location, type, price } = req.body;
  // const activityId = req.params.activityId;
  if (!name || !city || !country || !location || !type || !price) {
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
