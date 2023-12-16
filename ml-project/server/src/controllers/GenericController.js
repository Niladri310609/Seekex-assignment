const Balls = require("../models/ballmodel");
const Buckets = require("../models/bucketmodel");
const Output = require("../models/outputmodel")
const {
  isValid,validString,isValidRequestBody,
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
      capacity_in_Ci: capacity,
      empty_volume:capacity
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
      const { color, size,number } = requestBody;
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
      if (!number) {
        return res
          .status(406)
          .send({ status: false, message: "number is also required" });
      }

    if (number) {
        if (!validString(number)) {
            return res
              .status(400)
              .send({ status: false, message: "number is required" });
          }
      
          if (!!isNaN(Number(number))) {
            return res
              .status(400)
              .send({ status: false, message: `number should be a valid number` });
          }
          if (number <= 0) {
            return res
              .status(400)
              .send({ status: false, message: `number cannot be Zero` });
          }
    }
  
      const BallsData = {
        color: color,
        number: number,
        size:size
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
  const placeBallsInBuckets = async (req, res) => {
    try {
      const balls = await Balls.find();
      const buckets = await Buckets.find();
      const outputMessages = [];
      const placedBalls = [];
      const placedBuckets = [];
  
      for (const ball of balls) {
        for (const bucket of buckets) {
          if (ball.size <= bucket.empty_volume) {
            const placedBallCount = ball.number;
            const placedVolume = ball.size * placedBallCount;
  
            bucket.empty_volume -= placedVolume;
            await bucket.save();
  
            const operationData = {
              ball: ball._id.toString(),
              bucket: bucket._id.toString(),
              placedBallCount,
              placedVolume,
            };
         await Output.create(operationData);
  
            placedBalls.push({ ball, count: placedBallCount });
            placedBuckets.push(bucket);
            outputMessages.push(`Placed ${placedBallCount} ${ball.color} balls in bucket ${bucket.Name}`);
            break;
          }
        }
      }
  
      res.status(200).send({
        status: true,
        message: outputMessages,
        data: { balls: placedBalls, buckets: placedBuckets },
      });
    } catch (error) {
      res.status(500).send({ status: false, message: error.message });
    }
  };
  

const getOverview = async (req, res) => {
  try {
    const buckets = await Buckets.find();
    const extraBalls = await Balls.find({ size: { $gt: Math.max(...buckets.map(b => b.empty_volume)) } });
    const outputMessages = [];

    if (extraBalls.length > 0) {
      outputMessages.push('Extra balls that cannot be accommodated:');
      extraBalls.forEach(ball => outputMessages.push(`${ball.size} ${ball.color} ball`));
    }

    outputMessages.push('Overview of balls in buckets:');
    buckets.forEach(bucket => outputMessages.push(`Bucket ${bucket.Name}: ${bucket.capacity - bucket.empty_volume}/${bucket.capacity} full`));

    res.status(200).send({
      status: true,
      message: outputMessages,
    });
  } catch (error) {
    console.log(error)
    res.status(500).send({ status: false, message: error.message });
  }
};

module.exports ={createBucket,createBall,placeBallsInBuckets,getOverview}