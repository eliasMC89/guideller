'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const activitySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  photoURL: {
    type: String
  },
  reservation: {
    type: String
  },
  description: {
    type: String
    // required: true
  },
  owner: {
    type: ObjectId,
    ref: 'User'
  }
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
