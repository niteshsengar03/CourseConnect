const {Router} = require('express')
const adminRouter = Router();
const {userSchema,loginSchema} = require('./../type');
const {adminModel} = require('./../db');
const ADMIN_SECRET = "adminIsASuperStar";
const jwt = require("jsonwebtoken");


adminRouter.post('/signup',async function (req, res){
    const payload = userSchema.safeParse(req.body);
    if (!payload.success) {
      return res.status(400).json({message:"bad input"});
    }
    const { email, password, firstName, lastName } = req.body;
    try {
      await adminModel.create({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        });
        return res.status(202).json({
          message: "Admin added successfully"
        });
      } catch (err) {
        console.log(err);
        if(err.code === 11000) // MongoDB duplicate key error code (duplicate email not allowed added constarint in mongoose)
            return res.status(404).json({message:"Admin Already exist"});
        // Other database errors
        return res.status(500).json({
          message: "Problem in database, cannot add Admin",
        });
      }
});

adminRouter.post('/signin',async function (req,res){
  // ZOD validation
  const payload = loginSchema.safeParse(req.body);
  if(!payload.success)
    return res.status(400).json({message:"bad input"});

  const { email, password } = req.body;
  try {
    user = await adminModel.findOne({ email, password }); 
    //if user is present in database now create jwt 
    if (user) {
      const token = jwt.sign({id:user._id},ADMIN_SECRET);
      return res.status(200).json({ message: user,token:token });
    } 
    else {
        return res.status(404).json({ message: "Admin is not present in database" });
    }
  } catch (err) { 
    console.log(err);
      return res.status(500).json({ message: "Can not fetch admin, Problem in the database" });
  }
});

//create course by admin
adminRouter.post('/course',function (req,res){
    res.send("Create a course")
})

//delet course by admin
adminRouter.delete('/course',function(req,res){
    res.send("Deleting the course")
})

//update course 
adminRouter.put('/course',function(req,res){
    res.send("Updating the course");
})

// all courses created by admin
adminRouter.get('/course/bulk',function(req,res){
    res.send("Updating the course");
})

module.exports= {
    adminRouter : adminRouter
}