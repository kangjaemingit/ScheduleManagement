const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name : {
        type : String
    },
    userId: {
        type : String
    },
    nickName : {
        type : String
    },
    email: {
        type : String
    },
    profilePhoto : {
        type : String
    },
    navBgColor : {
        type : String
    },
    provider:{
        type : String
    }

});

const User = mongoose.model('User', userSchema);

module.exports = {User};