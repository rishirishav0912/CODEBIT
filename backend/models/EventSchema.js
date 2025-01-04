const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  tit: {
    type: String,
    required:true,
    // Event title
  },
  desc: {
    type: String,
    // Event description
    required:true,
  },
  deadline: {
    type: Date,
    
  },
  org: [
    {
      name: {
        type: String,
        required: true, // Organizer name
      },
      email: {
        type: String,
        required: true, // Organizer email
      },
      phone: {
        type: String,
        required: true, // Organizer phone number
      },
    },
  ],
  anType: {
    type: String,
    enum: ['normal', 'hackathon', 'contest'], // Type of announcement
    required: true,
  },
  selEv: {
    type: String, // ID of the selected event
  },
  tNames: [
    {
      type: String, // Winner team names (for hackathon or contest announcements)
    },
  ],
  ct: {
    type: Date,
    default: Date.now, // Creation time
  },
});

module.exports = mongoose.model('Event', EventSchema);
