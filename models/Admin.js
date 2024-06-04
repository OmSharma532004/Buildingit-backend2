
const mongoose = require('mongoose');
//schema of user 
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNo: {
        type: Number,
     
    },
   

});
//model of user
const Admin = mongoose.model('Admin',adminSchema );
//exporting user model
module.exports = Admin;