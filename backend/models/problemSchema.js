const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
   
    pnt: { type: Number, required: true },
    desc: {
        probName: { type: String, required: true },
        statement: { type: String, required: true },
        inpForm: { type: String, required: true },
        constraint: { type: String, required: true },
        outForm: { type: String, required: true },
    },
    exmp:[ {inp: { type: String, required: true },
        out: { type: String, required: true },
    },],
    testcs: [
        {
            inp: { type: String, required: true },
            expout: { type: String, required: true },
        },
    ],
});

module.exports = problemSchema;
