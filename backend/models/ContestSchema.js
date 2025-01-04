const mongoose = require("mongoose");
const problemSchema=require("./problemSchema");
const ContestSchema = new mongoose.Schema({
    contName: { type: String, required: true ,unique:true,},
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    problems: [problemSchema],
    ct: { type: Date, default: Date.now }, // Automatically sets the creation time
});

module.exports = mongoose.model("Contest", ContestSchema);
