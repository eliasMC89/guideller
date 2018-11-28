'use strict';

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware
const Activity = require('../models/activity');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_API_KEY });
const { getDistanceFromLatLonInKm } = require('../helpers/calcDistanceCoords');

router.get('/', (req, res, next) => {
  res.render('activities/search-activities');
});

router.get('/search-near', authMiddleware.requireUser, async (req, res, next) => {
  let longitude = 0;
  let latitude = 0;

  try {
    const activities = await Activity.find();
    const activitiesCopy = activities;

    const citiesCoordinates = {};

    for (let i = 0; i < activitiesCopy.length; i++) {
      if (!citiesCoordinates[activitiesCopy[i].city]) {
        const queryObj = {
          query: activitiesCopy[i].city, // Barcelona = query
          limit: 2
        };
        const cityCoordinates = await geocodingClient.forwardGeocode(queryObj).send();
        citiesCoordinates[activitiesCopy[i].city] = cityCoordinates.body.features[0].center;
      }
    }
    if (!req.query.longitude /* && !req.query.city */) {
      longitude = citiesCoordinates['Paris'][1];
      latitude = citiesCoordinates['Paris'][0];
    } else {
      longitude = req.query.latitude;
      latitude = req.query.longitude;
    }

    const coords = [parseFloat(latitude), parseFloat(longitude)];
    const reverseQueryObj = {
      query: coords, // Barcelona = query
      limit: 1
    };

    const userLocation = await geocodingClient.reverseGeocode(reverseQueryObj).send();
    const userLocationName = userLocation.body.features[0].context[1].text;

    activitiesCopy.sort((a, b) => {
      let result = -1;
      if (a.city !== userLocationName && b.city === userLocationName) {
        result = 1;
      } else if (a.city !== userLocationName && b.city !== userLocationName) {
        const cityADistanceUser = getDistanceFromLatLonInKm(longitude, latitude, citiesCoordinates[a.city][0], citiesCoordinates[a.city][1]);
        const cityBDistanceUser = getDistanceFromLatLonInKm(longitude, latitude, citiesCoordinates[b.city][0], citiesCoordinates[b.city][1]);

        if (cityADistanceUser > cityBDistanceUser) {
          result = 1;
        } else {
          result = -1;
        }
      }
      return result;
    });
    res.render('activities/near-activities', { activitiesCopy });
  } catch (error) {
    next(error);
  }
});

router.get('/result', (req, res, next) => {
  const queryCond = {};
  if (req.query.country) {
    queryCond.country = req.query.country;
  }
  if (req.query.city) {
    queryCond.city = req.query.city;
  }
  if (req.query.type) {
    queryCond.type = req.query.type;
  }
  if (req.query.maxPrice) {
    queryCond.price = { '$lte': req.query.maxPrice };
  }

  Activity.find(queryCond)
    .then((result) => {
      res.render('activities/search-list-activities', { result });
    })
    .catch(next);
});

module.exports = router;
