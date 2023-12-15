const mongoose = require("mongoose");

const BucketSchema = new mongoose.Schema(
  {
      Name: {type:String, trim:true, required:true, unique:true},
  capacity: {type:Number, required:true},


  },
  { timestamps: true }
);

module.exports = mongoose.model("bucket", BucketSchema);
