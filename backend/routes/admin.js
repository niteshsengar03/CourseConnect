const {Router} = require('express')
const adminRouter = Router();
const {userSchema,loginSchema} = require('./../type');
const {adminModel, courseModel} = require('./../db');
const jwt = require("jsonwebtoken");
const {ADMIN_SECRET} = require("./../config");
const { adminMiddleware } = require('../middleware/admin');


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
adminRouter.post('/course',adminMiddleware,async function (req,res){
  const adminId = req.userId;
  const {title,description,imageUrl,price} = req.body;
  try{
    const course = await courseModel.create({
      title,
      description, 
      imageUrl, // don't ask for url allow user to directly uplaod image watch harkirat video on creating a web3 saas in 6 hours
      price, 
      creatorId:adminId
    })
    return res.status(200).json({
      message:"Course created",
      courseId: course._id 
    })
  }catch(err){

  }
  
})


//update course 
adminRouter.put('/course',adminMiddleware,async function(req,res){
    const adminId = req.userId;
    const {title,description,imageUrl,price,courseId} = req.body;
    try{
      const course = await courseModel.updateOne({
        // filter
        _id:courseId, //  course id should be present in database
        creatorId:adminId // And very important that course should be of his own course, he can not update any one else admin's course
      },{
        title,
        description, 
        imageUrl,
        price, 
      })
      console.log(course);
      if(course.matchedCount===0){
          return res.status(400).json({message:"Course id is invalid or not present"});
      }
      return res.status(202).json({ message:"Course updated" })
    }catch(err){
      console.log(err);
      return res.status(500).json({ message:"Something went wrong"});
    }
})


// all courses created by admin
adminRouter.get('/course/bulk',adminMiddleware,async function(req,res){
    const adminId = req.userId;
    try{
    course =  await courseModel.find({
      creatorId:adminId
    })
    return res.status(202).json({courses:course})
  }catch(err){
    return res.status(500).json({message:"Something went wrong"});
  }
})



//delet course by admin
adminRouter.delete('/course',function(req,res){
    res.send("Deleting the course")
})




module.exports= {
    adminRouter : adminRouter
}