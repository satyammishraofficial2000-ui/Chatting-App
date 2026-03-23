const mongoose = require('mongoose');

const messageScema = new mongoose.Schema({
    chatId:{
        type: mongoose.Schema.Types.ObjectId,ref:"chats"
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,ref:"users"
    },
    text:{
        type:String,
        require:true
    },
    read:{
        type:Boolean,
        default:false
    }

},{timespams: true});

module.exports = mongoose.model('message', messageScema);