'use strict';

const authMiddleware = require('../middlewares/authMiddleware'); // Middleware
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', authMiddleware.requireAnon, (req, res, next) => {
  const data = {
    messages: req.flash('validationError')
  };
  res.render('index', data);
});

module.exports = router;
