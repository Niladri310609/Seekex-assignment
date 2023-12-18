const mongoose = require("mongoose");

const OutputSchema = new mongoose.Schema(
  {
    ballColor: {type:String, trim:true},
    bucketName: {type:String, trim:true},
  tranxCountofBalls: {
    type: Object,
    required: true,
  },
  Placed_Volume: {
    type: Object,
    required: true,
  },

  },
  { timestamps: true }
);

module.exports = mongoose.model("output", OutputSchema);
