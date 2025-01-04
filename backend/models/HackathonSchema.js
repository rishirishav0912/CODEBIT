const mongoose = require('mongoose');

// Define the schema for creating hackathon
const HackathonSchema = new mongoose.Schema({
  hackName: {
    type: String,
    required: true, // Required field
    unique:true,
  },
  tSize: {
    type: Number,
    required: true, // Required field, should be a number
  },
  regTime: {
    start: {
      type: Date,
      required: true, // Required field for registration start date
    },
    end: {
      type: Date,
      required: true, // Required field for registration end date
    },
  },
  hackTime: {
    start: {
      type: Date,
      required: true, // Required field for hackathon start date
    },
    end: {
      type: Date,
      required: true, // Required field for hackathon end date
    },
  },
  allVidLink: {
    type: Boolean,
    default: false, // Default value set to false
  },
  allLiveDepLink: {
    type: Boolean,
    default: false, // Default value set to false
  },
  themes: [
    {
      title: {
        type: String,
        required: true, // Required field for theme title
      },
      desc: {
        type: String,
        required: true, // Required field for theme description
      },
    },
  ],
  ct: {
    type: Date,
    default: Date.now, // Automatically sets the creation date
  },
});

// Create a model based on the schema
const Hackathon = mongoose.model('Hackathon', HackathonSchema);

module.exports = Hackathon;