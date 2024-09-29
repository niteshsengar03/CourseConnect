const express = require('express');
const {userRouter} = require('./routes/user');
const {courseRouter} = require('./routes/courses');
const { adminRouter } = require('./routes/admin');
const mongoose = require('mongoose');
const {userModel, adminModel, courseModel,purchaseModel} = require('./db/index');

const app = express();
const port = 3000;

app.use(express.json());



app.use("/api/v1/user",userRouter);
app.use("ap1/v1/course",courseRouter);
app.use("api/v1/admin",adminRouter)



//Server will not start till the database is connected
async function main(){
await mongoose.connect("mongodb+srv://niteshsengar9831:oPNhUMViFEWtLWfV@cluster0.dtw65.mongodb.net/CourseConnect");
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
}
main();