const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// it is just a type like string,number.
const ObjectId = mongoose.ObjectId;


const User = new Schema({
    email:{type: String,unique:true},
    password: String,
    firstName: String,
    lastName: String
}) 

const Admin = new Schema ({
    email:{type:String,unique:true},
    password:String,
    firstName: String,
    lastName: String
})

const Course = new Schema({
    title:String,
    description:String,
    imageUrl:String,
    price:Number,
    creatorId : ObjectId
})

const Purchase = new Schema({
    userId:ObjectId,
    courseId:ObjectId
});



const adminModel = mongoose.model('admin',Admin);
const userModel = mongoose.model('user',User);
const courseModel = mongoose.model('course',Course);
const purchaseModel = mongoose.model('purchase',Purchase);


module.exports = {
    userModel:userModel,
    adminModel:adminModel,
    courseModel:courseModel,
    purchaseModel:purchaseModel
};