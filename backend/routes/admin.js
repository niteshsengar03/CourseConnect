const {Router} = require('express')
const adminRouter = Router();


adminRouter.post('/signup', function (req, res){
    res.send('Hello World!');
});

adminRouter.post('/login',function (req,res){
    res.send("This is login router");
});

adminRouter.post('/create-course',function (req,res){
    res.send("Create a course")
})

adminRouter.delete('/course',function(req,res){
    res.send("Deleting the course")
})

adminRouter.put('/update-cousrse',function(req,res){
    res.send("Updating the course");
})

module.exports= {
    adminRouter : adminRouter
}