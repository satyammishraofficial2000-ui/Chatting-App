const route = require('express').Router();
const authMiddleware = require('./../middlewares/authMiddleware');
const Chat = require('./../modules/chat');
const Message = require('./../modules/message');

route.post('/new-message',authMiddleware,async(req,res) => {
    try {
        //Store the message in message collection
        const newMessage = new Message(req.body);
        const savedMessage = await newMessage.save();

        //Update the lastMessage in chat collection
        //const currentChat = await Chat.findById(req.body.chatId);
        //currentChat.lastMessage = savedMessage._id;
        //await currentChat.save();
        const currentChat = await Chat.findOneAndUpdate({
            _id: req.body.chatId
        },{
            lastMessage:savedMessage._id,
            $in: {unreadMessageCount:1}
        });
        
    } catch (error) {
        res.status(400).send({
            message:error.message,
            success: false
        });
    }
});
module.exports = route;