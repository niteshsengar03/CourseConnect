const { Router } = require("express");
const { courseModel, purchaseModel } = require("../db");
const courseRouter = Router();
const { userMiddleware } = require("./../middleware/user");

//user can  purchase a course from this end point
courseRouter.post("/purchase", userMiddleware, async function (req, res) {
  const userID = req.userId;
  const courseID = req.body.courseId;

  // Check for missing parameters
  if (!courseID || !userID) {
    return res.status(400).json({ message: "courseID and userID are required" });
  }
  try {

    // Db call to check if courseId is available in the database
    const courseAvailable = await courseModel.findOne({_id:courseID});
    if(!courseAvailable)
        return res.status(404).json({message:"Give correct courseId"});
    // DB call to check if course is already purchased by the user
    const course = await purchaseModel.findOne({
      userId: userID,
      courseId: courseID,
    });
    if (course) return res.status(202).json({ message: "Already Purchased" });

    await purchaseModel.create({
      userId: userID,
      courseId: courseID,
    });
    return res.status(409).json({ message: "Course Purchase" });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
});

//Get all courses available
courseRouter.get("/preview", async function (req, res) {
  try {
    const course = await courseModel.find();
    if (!course)
      return res.status(202).json({ message: "No course available" });
    return res.status(202).json({ courses: course });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong while fetching data" });
  }
});

module.exports = {
  courseRouter: courseRouter,
};
