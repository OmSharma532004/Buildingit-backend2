
const mongoose = require('mongoose');
//schema of user 
const SuperAdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    }
   

});
//model of user
const SuperAdmin = mongoose.model('SuperAdmin',SuperAdminSchema );
//exporting user model
module.exports = SuperAdmin;