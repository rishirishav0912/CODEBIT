const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true,
    },
    type:{
        type:String,
        required:true
    },
    text:{
        type:String
    },
    hackid:{
        type: String
    },
    tname:{
        type:String
    },
    ct: { type: Date, default: Date.now, expires: 900 }
});

module.exports = mongoose.model("Notification", NotificationSchema);
