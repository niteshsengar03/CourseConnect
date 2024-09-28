const express = require('express');
const {userRouter} = require('./routes/user');
const {courseRouter} = require('./routes/courses');
const { adminRouter } = require('./routes/admin');

const app = express();
const port = 3000;

app.use(express.json());



app.use("/api/v1/user",userRouter);
app.use("ap1/v1/course",courseRouter);
app.use("api/v1/admin",adminRouter)





app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});