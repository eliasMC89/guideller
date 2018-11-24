'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  activities: [{
    type: ObjectId,
    ref: 'Activity'
  }],
  trips: [{
    type: ObjectId,
    ref: 'Trip'
  }]

});

const User = mongoose.model('User', userSchema);

module.exports = User;
