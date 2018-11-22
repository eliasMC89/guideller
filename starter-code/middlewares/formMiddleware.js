'use strict';

const formMiddleware = {};

// Middleware to check for empty fields
formMiddleware.requireFields = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    req.flash('validationError', 'Fill in all fields!');
    return res.redirect(`/auth${req.path}`);
  }
  next();
};

module.exports = formMiddleware;
