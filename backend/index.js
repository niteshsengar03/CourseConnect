const express = require('express');

const app = express();
const port = 3000;

app.use(express.json());


// User
app.post('user/signup', function (req, res){
    res.send('Hello World!');
});

app.post('user/login',function (req,res){
    res.send("This is login router");
})

app.post('user/purchase-course',function(req,res){
    res.send("Purchase the course");
})

app.get('user/course',function(req,res){
    res.send("See all the course here");
})


//Admin
app.post('admin/signup', function (req, res){
    res.send('Hello World!');
});

app.post('admin/login',function (req,res){
    res.send("This is login router");
});

app.post('admin/create-course',function (req,res){
    res.send("Create a course")
})

app.delete('admin/course',function(req,res){
    res.send("Deleting the course")
})

app.put('admin/update-cousrse',function(req,res){
    res.send("Updating the course");
})




app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});