const { Router } = require("express");
const { userSchema,loginSchema } = require("./../type");
const { userModel } = require("./../db/index");
const userRouter = Router();
const jwt = require("jsonwebtoken");
const USER_SECRET = "userIsASuperStar";

userRouter.post("/signup", async function (req, res) {
  // Zod Validation
  const payload = userSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({message:"bad input"});
  }
  const { email, password, firstName, lastName } = req.body;
  try {
    await userModel.create({
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      });
      return res.status(202).json({
        message: "User added successfully"
      });
    } catch (err) {
      console.log(err);
      if(err.code === 11000) // MongoDB duplicate key error code (duplicate email not allowed added constarint in mongoose)
          return res.status(404).json({message:"User Already exist"});
      // Other database errors
      return res.status(500).json({
        message: "Problem in database, cannot add user",
      });
    }
});

userRouter.post("/signin", async function (req, res) {
  // ZOD validation
  const payload = loginSchema.safeParse(req.body);
  if(!payload.success)
    return res.status(400).json({message:"bad input"});

  const { email, password } = req.body;
  try {
    user = await userModel.findOne({ email, password }); //Search
    //if user is present in database now create jwt 
    if (user) {
      const token = jwt.sign({id:user._id},USER_SECRET);
      return res.status(200).json({ message: user,token:token });
    } 
    else {
        return res.status(404).json({ message: "User is not present in database" });
    }
  } catch (err) { 
      return res.status(500).json({ message: "Can not fetch user, Problem in the database" });
  }
});

// All purchased courses of a user
userRouter.get("/purchases", function (req, res) {
  res.send("hii there");
});

module.exports = {
  userRouter: userRouter,
};
