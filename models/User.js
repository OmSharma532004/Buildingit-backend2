
const mongoose = require('mongoose');
//schema of user 
const UserSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
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
    token:{
        type:String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    
    approvedHouses: {
        //object with ref property
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'House'
    },

});
//model of user
const User = mongoose.model('User', UserSchema);
//exporting user model
module.exports = User;