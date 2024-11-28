const { Router } = require("express");
const { userSchema } = require("./../type");
const { userModel } = require("./../db/index");
const userRouter = Router();
const jwt = require("jsonwebtoken");
const USER_SECRET = "userIsASuperStar";

userRouter.post("/signup", async function (req, res) {
  // Zod Validation
  const payload = userSchema.safeParse(req.body);
  if (payload.success) {
    const { email, password, firstName, lastName } = req.body;
    try {
      // userModel.create.mockRejectedValue(new Error('Database error'));
      await userModel.create({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      });
      return res.status(202).json({
        message: "User added successfully",
      });
    } catch (err) {
      return res.status(404).json({
        message: "User has not added",
      });
    }
  } else {
    return res.status(404).json("bad input");
  }
});

userRouter.post("/signin", async function (req, res) {
  const { email, password } = req.body;
  try {

    user = await userModel.findOne({ email, password }); //Search
   
    //user is present in database now create jwt 
    if (user) {
      const token = jwt.sign({id:user._id},USER_SECRET);
      return res.status(200).json({ messgae: user,token:token });
      
    } 
    //User is not present in database
    else {
        return res
        .status(200)
        .json({ message: "User is not present in database" });
    }
  } catch (err) { 
    // problem in database
    console.log(err);
    return res.status(404).json({ messgae: "Can not fetch user" });
  }
});

// All purchased courses of a user
userRouter.get("/purchases", function (req, res) {
  res.send("hii there");
});

module.exports = {
  userRouter: userRouter,
};
