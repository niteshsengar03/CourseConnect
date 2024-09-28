const {Router} = require('express')
const adminRouter = Router();


adminRouter.post('/signup', function (req, res){
    res.send('Hello World!');
});

adminRouter.post('/signin',function (req,res){
    res.send("This is login router");
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