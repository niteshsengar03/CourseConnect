require('dotenv').config()
const express = require('express');
const {userRouter} = require('./routes/user');
const {courseRouter} = require('./routes/courses');
const {adminRouter } = require('./routes/admin');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());



app.use("/api/v1/user",userRouter);
app.use("/api/v1/course",courseRouter);
app.use("/api/v1/admin",adminRouter);


//Server will not start till the database is connected
async function main(){
try{
await mongoose.connect(process.env.MONGO_URL);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
} catch (e) {
    console.error("Failed to connect to the database");
    }
}

main();
