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
    const AllBuckets = await Buckets.find({})
     if(AllBuckets.length !== 0){

      await Buckets.updateMany({}, [
        {
          $set: {
            empty_volume: {
              $toDouble: "$capacity_in_Ci",
            },
            occupied_volume: 0,
          },
        },
      ]);
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
    const { color, size } = requestBody;

    const AllBuckets = await Buckets.find({})
    if(AllBuckets.length !== 0){

      await Buckets.updateMany({}, [
        {
          $set: {
            empty_volume: {
              $toDouble: "$capacity_in_Ci",
            },
            occupied_volume: 0,
          },
        },
      ]);
  }
    const existingBall = await Balls.findOne({ color: { $regex: new RegExp(`^${color}$`, 'i') } });

    if (existingBall) {
      existingBall.size = Number(size);
      await existingBall.save();

      return res.status(200).send({
        status: true,
        message: `Size of ${color} balls updated`,
        data: existingBall,
      });
    }

    const BallsData = {
      color,
      // number,
      size,
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
    const ballsData = req.body;
    const buckets = await Buckets.find();
    const outputMessages = [];
    const placedBuckets = {};

    const sortedBuckets = [...buckets].sort((a, b) => b.empty_volume - a.empty_volume);

    for (const ballData of ballsData) {
      const { color, size, numberOfBalls } = ballData;

      for (const bucket of sortedBuckets) {
        const remainingVolume = bucket.empty_volume;
        const ballsToFit = Math.floor(remainingVolume / size);

        const placedBallsCount = Math.min(ballsToFit, numberOfBalls);
        const placedVolume = placedBallsCount * size;

        if (placedBallsCount > 0 && placedVolume <= remainingVolume) {
          bucket.occupied_volume += placedVolume;
          bucket.empty_volume -= placedVolume;
          await bucket.save();

          const operationData = {
            ballColor: color,
            bucketName: bucket.Name,
            tranxCountofBalls: placedBallsCount,
            Placed_Volume: placedVolume,
          };
          await Output.create(operationData);

          placedBuckets[bucket.Name] = placedBuckets[bucket.Name] || {};
          placedBuckets[bucket.Name][color] = (placedBuckets[bucket.Name][color] || 0) + placedBallsCount;

          outputMessages.push(`Placed ${placedBallsCount} ${color} balls in bucket ${bucket.Name}`);

          // Update the numberOfBalls after placement
          ballData.numberOfBalls -= placedBallsCount;

          if (ballData.numberOfBalls === 0) {
            break; // If all balls are placed, exit the loop
          }
        }
      }
    }

    // Check if any balls were left unplaced
    const unplacedBalls = ballsData.filter(ballData => ballData.numberOfBalls > 0);
    if (unplacedBalls.length > 0) {
      const unplacedBallsMessage = unplacedBalls.map(ballData => `${ballData.numberOfBalls} ${ballData.color} balls`).join(', ');
      outputMessages.push(`No buckets have sufficient empty volume to place the remaining balls: ${unplacedBallsMessage}`);
    }

    const responseData = {
      status: true,
      message: outputMessages,
      data: placedBuckets,
    };

    res.status(200).send(responseData);
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};







const updateBucket = async(req,res)=>{

 try{ const AllBuckets = await Buckets.find({})
  if(AllBuckets.length !== 0){

    await Buckets.updateMany({}, [
      {
        $set: {
          empty_volume: {
            $toDouble: "$capacity_in_Ci",
          },
          occupied_volume: 0,
        },
      },
    ]);
}}catch(error){
   return res.status(500).send({status:false, message:error.message})
}
}


const ListofBalls = async(req,res)=>{
try {
  const AllBalls = await Balls.find({}).sort({createdAt:-1})

  if(AllBalls.length === 0){
       return res.status(200).send({status:true, message:"No balls found, add some", data:[]})
  }
     return res.status(200).send({status:true, message:"All Balls has been Fetched",data:AllBalls})
} catch (error) {
  return res.status(500).send({status:false, message:error.message})
}
}
  



module.exports ={createBucket,createBall,placeBallsInBuckets,ListofBalls,updateBucket}