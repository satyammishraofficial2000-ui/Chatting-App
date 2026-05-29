const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    messageId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    text: {
        type: String,
        required: true
    },

    remindAt: {
        type: Date,
        required: true
    },

    triggered: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    'Reminder',
    reminderSchema
);