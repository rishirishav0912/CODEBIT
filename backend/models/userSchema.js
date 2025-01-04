const mongoose = require("mongoose");

// Define the schema for student registration
const userSchema = new mongoose.Schema({
  roll: {
    type: String,
    required: true,
    unique: true, // Ensures no duplicate roll numbers
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures no duplicate emails
  },
  pass: {
    type: String,
    required: true,
    minlength: 6, // Enforces a minimum password length
  },
  isVerified: {
    type: Boolean,
    default: false, // Defaults to false (not verified)
  },
  cnthis: [
    {
      cntid: { type: String, required: true },
      point: { type: Number, required: false },
      submiss: [
        {
          pid: { type: String, required: true },
          subtm: { type: Date, required: true },
          state: { type: String, required: true },
        },
      ],
    },
  ],
  hackhist: [
    {
      hackid: { type: String, required: true },
      tName:{type:String,required:true,unique:true},
      teamLeader: {
        email: {
          type: String,
          required: true, // Team leader email is required
        },
        name: {
          type: String,
          required: true, // Team leader name is required
        },
        phone:{
          type:String,
          required:true,
        }
      },
      teamMembers: [
        {
          email: {
            type: String,
            required: true, // Each team member email is required
          },
          name: {
            type: String,
            required: true, // Each team member name is required
          },
          phone:{
            type:String,
            required:true,
          }
        },
      ],
      submiss: [
        {
          theme: { type: String, required: true },
          pname:{type:String,required:true},
          desc:{type:String,required:true},
          githubLink: {
            type: String,
            required: true, // GitHub link is required
          },
          videoLink: {
            type: String,
            required: false, // Optional if allowVideoLink is false in hackathon
          },
          liveLink: {
            type: String,
            required: false, // Optional if allowLiveDeploymentLink is false in hackathon
          },
         
          
        },
      ],
    },
  ],
  ct: {
    type: Date,
    default: Date.now, // Automatically sets the creation date
  },
});

// Create a model based on the schema
module.exports = mongoose.model("StudentRegister", userSchema);
