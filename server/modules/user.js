const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required:true
    },
    lastname:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    profilepic:{
        type: String,
        required:false
    },//its not compulsary
},{timestamp: true})

module.exports = mongoose.model('users', userSchema);