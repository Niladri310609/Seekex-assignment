const mongoose = require("mongoose");

const Ballschema = new mongoose.Schema(
  {
      color: {type:String, trim:true, required:true, unique:true},
  size: {type:Number, required:true},


  },
  { timestamps: true }
);

module.exports = mongoose.model("ball", Ballschema);
