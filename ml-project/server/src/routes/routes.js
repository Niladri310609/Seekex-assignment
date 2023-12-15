const express = require("express");
const router = express.Router();
const{createBucket,createBall}= require("../controllers/GenericController")

//====================>Bucket Creation==============

router.post("/addbucket",createBucket)
router.post("/addball",createBall)




router.all("/*", function (req, res) {
    res
      .status(406)
      .send({ status: false, message: "The api you requested is not available" });
  });
  
  module.exports = router;