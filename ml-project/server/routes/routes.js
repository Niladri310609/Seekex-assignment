const express = require("express");
const router = express.Router();
router.all("/*", function (req, res) {
    res
      .status(406)
      .send({ status: false, message: "The api you requested is not available" });
  });
  
  module.exports = router;