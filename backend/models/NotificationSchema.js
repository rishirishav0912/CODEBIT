const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true,
        unique: true,
    },
    type:{
        type:String,
        required:true
    },
    text:{
        type:String
    },
    ct: { type: Date, default: Date.now(), expires: 900 }
});

module.exports = mongoose.model("Notification", NotificationSchema);
