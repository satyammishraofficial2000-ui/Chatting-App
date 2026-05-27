const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    members:{
        type: [
             {type: mongoose.Schema.Types.ObjectId, ref: "users"}
        ]
    },
    isSelfChat: {
        type: Boolean,
        default: false
        },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId, ref: "message"
    },
    deletedFor: {
    type: [String],
    default: []
    },
    unreadMessageCount:{
        type: Number,
        default: 0
    }
},{timestamps:true});
module.exports = mongoose.model("chats", chatSchema);