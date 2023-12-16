const mongoose = require("mongoose");

const OutputSchema = new mongoose.Schema(
  {
  ball: {type:String, trim:true,  unique:true, ref:'ball'},
  bucket: {type:String, trim:true,  unique:true, ref:'bucket'},
  tranxCountofBalls: {type:Number, required:true},
  Placed_Volume:{type:Number, required:true}


  },
  { timestamps: true }
);

module.exports = mongoose.model("output", OutputSchema);
