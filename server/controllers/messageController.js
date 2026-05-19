const route = require('express').Router();
const authMiddleware = require('./../middlewares/authMiddleware');
const Chat = require('./../modules/chat');
const Message = require('./../modules/message');
const User = require('./../modules/user');
const translate = require("google-translate-api-x");


// Route to send a new message
route.post('/new-message', authMiddleware, async (req, res) => {
    try {

        // Store the message in message collection
        const chat = await Chat.findById(req.body.chatId);

            const receiverId = chat.members.find(
            member => member.toString() !== req.userId
            );

            const receiver = await User.findById(receiverId);

            let translatedText = "";

            if(receiver.preferredLanguage !== req.body.language){

            const languageCodes = {
                en: "English",
                hi: "Hindi",
                kn: "Kannada",
                ta: "Tamil"
            };

            const result = await translate(req.body.text, {
                to: receiver.preferredLanguage
            });

            translatedText = result.text;
            }

            const newMessage = new Message({
            ...req.body,
            translatedText
            });
        const savedMessage = await newMessage.save();

            // Update chat only for normal messages
            if(!req.body.isScheduled){

                await Chat.findOneAndUpdate(
                    { _id: req.body.chatId },
                    {
                        lastMessage: savedMessage._id,
                        $inc: { unreadMessageCount: 1 }
                    }
                );

            }

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

// Route to get all messages of a chat
route.get('/get-all-messages/:chatId' , authMiddleware, async(req, res) => {
    try {
        const allMessages = await Message.find({
                    chatId: req.params.chatId,
                    $or: [
                        { isScheduled: false },
                        { isDelivered: true },
                        { sender: req.userId }
                    ]
                }).sort({ createdAt: 1 });
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


route.post("/translate-message", async (req, res) => {

  try {

    const { text, targetLanguage } = req.body;

    const languageCodes = {
      English: "en",
      Hindi: "hi",
      Kannada: "kn",
      Tamil: "ta"
    };

    const result = await translate(text, {
      to: languageCodes[targetLanguage]
    });

    res.send({
      success: true,
      translatedText: result.text
    });

  } catch (error) {

    res.send({
      success: false,
      message: error.message
    });

  }

});

module.exports = route;