const mongoose = require("mongoose");

const youItemSchema = new mongoose.Schema({

    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users"
    },

    type:{
        type:String,
        default:"note"
    },

    text:{
        type:String,
        default:""
    },

    image:{
        type:String,
        default:""
    },

    completed:{
        type:Boolean,
        default:false
    },
    replyTo: {
    text: String,
        sender: mongoose.Schema.Types.ObjectId
    },

    reminderTime:{
        type:Date,
        default:null
    }

},{timestamps:true});

module.exports = mongoose.model("youitems", youItemSchema);