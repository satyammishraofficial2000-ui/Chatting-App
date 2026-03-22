const mongoose = require('mongoose');

const messageScema = new mongoose.Schema({
    chatId:{
        type: mongoose.Schema.Types.ObjectId,ref:"chats"
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,ref:"users"
    },
    test:{
        type:String,
        require:true
    },
    read:{
        type:Boolean,
        default:false
    }

});

module.exports = mongoose.model('message', messageScema);