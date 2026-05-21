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
        require:false
    },
    image:{
        type:String,
        required: false
    },
    language: {
    type: String,
    default: "en"
    },
    translatedText:{
    type:String,
    default:""
    },
    read:{
        type:Boolean,
        default:false
    },
    deletedFor: {
        type: [String],
        default: []
        },

        isDeletedForEveryone: {
        type: Boolean,
        default: false
        },

    isScheduled:{
        type:Boolean,
        default:false
    },

    scheduledFor:{
        type:Date,
        default:null
    },

    isDelivered:{
        type:Boolean,
        default:true
    },
    deliveredAt:{
    type: Date,
    default: null
    }

},{timestamps: true});

module.exports = mongoose.model('message', messageScema);