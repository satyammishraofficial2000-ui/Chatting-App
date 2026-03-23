const route = require('express').Router();
const authMiddleware = require('./../middlewares/authMiddleware');
const Chat = require('./../modules/chat');
const Message = require('./../modules/message');

route.post('/new-message', authMiddleware, async (req, res) => {
    try {

        // Store the message in message collection
        const newMessage = new Message(req.body);
        const savedMessage = await newMessage.save();

        // Update lastMessage and unreadMessageCount in chat collection
        await Chat.findOneAndUpdate(
            { _id: req.body.chatId },
            {
                lastMessage: savedMessage._id,
                $inc: { unreadMessageCount: 1 }
            }
        );

        res.status(200).send({
            message: "Message sent successfully",
            success: true,
            data: savedMessage
        });

    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false
        });
    }
});

route.get('/get-all-messages/:chatId' , authMiddleware, async(req, res) => {
    try {
        const allMessages = await Message.find({chatId: req.params.chatId}).sort({createdAt:1});
        res.send({
            message: 'Messages fetched successfuly',
            success: true,
            data: allMessages
        })
        
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false
           
        })
    }
});
module.exports = route;