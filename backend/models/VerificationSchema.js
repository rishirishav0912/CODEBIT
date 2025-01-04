const mongoose = require('mongoose');

// Define the schema for storing email and roll number
const VerificationSchema = new mongoose.Schema({
 
  roll: {
    type: String,
    required: true,
    unique: true,// Ensures no duplicate roll numbers
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures no duplicate emails
  },
  ct: {
    type: Date,
    default: Date.now, // Automatically sets the creation date
  },
});

// Create a model based on the schema
const Verification = mongoose.model('verification', VerificationSchema);

module.exports = Verification;