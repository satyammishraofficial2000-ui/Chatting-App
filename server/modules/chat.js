const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    members:{
        type: [
             {type: mongoose.Schema.Types.ObjectId, ref: "users"}
        ]
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId, ref: "mongoose"
    },
    unreadMessageCounnt:{
        type: Number,
        default: 0
    }
},{timespamp:true});
module.exports = mongoose.model("chats", chatSchema);