'use strict';

const express = require('express');
const router = express.Router();
const Activity = require('../models/activity');

router.get('/', (req, res, next) => {
  res.render('activities/search-activities');
});

router.get('/result', (req, res, next) => {
  const { country } = req.query;
  // if (country && city && type && maxPrice){

  // }
  // city, type, maxPrice

  Activity.find({ 'country': country })
    .then((result) => {
      console.log(result);
      res.render('activities/search-list-activities', { result });
    })
    .catch(next);
});

module.exports = router;
