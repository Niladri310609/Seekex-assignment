const Balls = require("../models/ballmodel");
const Buckets = require("../models/bucketmodel");
const {
  isValid,validString,validcapacity,isValidRequestBody,
} = require("../validation/validation");

const createBucket = async (req, res) => {
  try {
    let requestBody = req.body;
    const { Name, capacity } = requestBody;
    if (!isValidRequestBody(requestBody)) {
      return res
        .status(406)
        .send({ status: false, message: "Input Data for Creating Buckets" });
    }
    if (!Name) {
      return res
        .status(406)
        .send({ status: false, message: "Name is also required" });
    }
    if (Name == "") {
      return res
        .status(406)
        .send({ status: false, message: "Name cannot be empty" });
    }

    if (!isValid(Name)) {
      return res
        .status(406)
        .send({ status: false, message: "Name is required..." });
    }
    if (!capacity) {
        return res
          .status(406)
          .send({ status: false, message: "capacity is also required" });
      }

    if (capacity) {
        if (!validString(capacity)) {
            return res
              .status(400)
              .send({ status: false, message: "capacity is required" });
          }
      
          if (!!isNaN(Number(capacity))) {
            return res
              .status(400)
              .send({ status: false, message: `capacity should be a valid number` });
          }
          if (capacity <= 0) {
            return res
              .status(400)
              .send({ status: false, message: `capacity cannot be Zero` });
          }
    }

    const BucketsData = {
      Name: Name,
      capacity: capacity,
    };
    const Buckets_Added = await Buckets.create(BucketsData);

    res.status(201).send({
      status: true,
      message: `Buckets has been added`,
      data: Buckets_Added,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
const createBall = async (req, res) => {
    try {
      let requestBody = req.body;
      const { color, size } = requestBody;
      if (!isValidRequestBody(requestBody)) {
        return res
          .status(406)
          .send({ status: false, message: "Input Data for Creating Buckets" });
      }
      if (!color) {
        return res
          .status(406)
          .send({ status: false, message: "color is also required" });
      }
      if (color == "") {
        return res
          .status(406)
          .send({ status: false, message: "color cannot be empty" });
      }
  
      if (!isValid(color)) {
        return res
          .status(406)
          .send({ status: false, message: "color is required..." });
      }
      if (!size) {
          return res
            .status(406)
            .send({ status: false, message: "size is also required" });
        }
  
      if (size) {
          if (!validString(size)) {
              return res
                .status(400)
                .send({ status: false, message: "size is required" });
            }
        
            if (!!isNaN(Number(size))) {
              return res
                .status(400)
                .send({ status: false, message: `size should be a valid number` });
            }
            if (size <= 0) {
              return res
                .status(400)
                .send({ status: false, message: `size cannot be Zero` });
            }
      }
  
      const BallsData = {
        color: color,
        size: size,
      };
      const Balls_Added = await Balls.create(BallsData);
  
      res.status(201).send({
        status: true,
        message: `Balls has been added`,
        data: Balls_Added,
      });
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
  };

module.exports ={createBucket,createBall}