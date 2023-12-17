const mongoose = require("mongoose");

const BucketSchema = new mongoose.Schema(
  {
  Name: {type:String, trim:true, required:true, unique:true},
  capacity_in_Ci: {type:Number, required:true},
  empty_volume:{type:Number, required:true},
  occupied_volume:{type:Number, default:0},


  },
  { timestamps: true }
);

module.exports = mongoose.model("bucket", BucketSchema);
