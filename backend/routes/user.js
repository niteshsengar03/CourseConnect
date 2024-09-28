const {Router} = require('express');
const userRouter = Router();

userRouter.post('/signup', function (req, res){
    res.send('Hello World!');
});


userRouter.post('/signin',function (req,res){
    res.send("This is login router");
})



// All purchased courses of a user
userRouter.get('/purchases',function(req,res){
    res.send("hii there")
})


module.exports =   {
    userRouter : userRouter
};