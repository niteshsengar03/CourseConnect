const {Router} = require('express');
const courseRouter = Router();

//user can  purchase a course from this end point
courseRouter.post('course/purchase',function(req,res){
    res.send("Purchase the course");
})

//Get all courses
courseRouter.get('course/preview',function(req,res){
    res.send("See all the course here");
})

module.exports = {
    courseRouter : courseRouter
}