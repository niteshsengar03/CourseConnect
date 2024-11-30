require('dotenv').config()
const USER_SECRET = process.env.JWT_USER_PASSWORD;
const ADMIN_SECRET = process.env.JWT_ADMIN_PASSWORD;

module.exports={
    USER_SECRET:USER_SECRET,
    ADMIN_SECRET:ADMIN_SECRET
}