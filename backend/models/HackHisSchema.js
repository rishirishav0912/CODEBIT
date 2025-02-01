const mongoose = require("mongoose");

// Define the schema for student registration
const HackHisSchema = new mongoose.Schema({
  hackid: { type: String, required: true },
  tName: { type: String, required: true },
  teamLeader: {
    email: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
  },
  teamMembers: [
    {
      email: { type: String, required: true },
      name: { type: String, required: true },
      phone: { type: String, required: true },
      isVerified: { type: Boolean, default: false },
    },
  ],
  submiss: [
    {
      theme: { type: String, required: true },
      pname: { type: String, required: true },
      desc: { type: String, required: true },
      githubLink: { type: String, required: true },
      videoLink: { type: String, required: false },
      liveLink: { type: String, required: false },
    },
  ],
  ct: { type: Date, default: Date.now},
  expiresAt: { type: Date, default: () => new Date(Date.now() + 5 * 60 * 1000), index: { expires: '1' } } // TTL Index
})

module.exports = mongoose.model("HackHisSchema",HackHisSchema);