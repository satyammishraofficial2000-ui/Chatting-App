const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const Chat = require('./../modules/chat');
const CryptoJS = require("crypto-js");
const SECRET_KEY = process.env.SECRET_KEY;

const Message = require('../modules/message');

router.post('/create-new-chat', authMiddleware, async(req,res) => {

    try{

        const chat = new Chat(req.body);

        const savedChat = await chat.save();

        const populatedChat = await Chat.findById(savedChat._id)
        .populate("members")
        .populate("lastMessage");

        res.status(201).send({

            message: 'chat created successfully',

            success:true,

            data: populatedChat

        });

    }catch(error){

        console.log(error);

        res.status(400).send({
            
            message: error.message,

            success:false

        });

    }

});

router.get('/get-all-chats', authMiddleware, async(req,res) => {

    try{

        const allChats = await Chat.find({

            members: { $in: [req.userId] },

            deletedFor: { $nin: [req.userId] }

        })
        .populate("members")
        .populate("lastMessage")
        .sort({ updatedAt: -1 });

        const decryptedChats = allChats.map(chat => {

            if(chat.lastMessage?.text){

                const decryptedText = CryptoJS.AES.decrypt(
                    chat.lastMessage.text,
                    SECRET_KEY
                ).toString(CryptoJS.enc.Utf8);

                chat.lastMessage.text = decryptedText;
            }

            if(chat.lastMessage?.translatedText){

                const decryptedTranslatedText = CryptoJS.AES.decrypt(
                    chat.lastMessage.translatedText,
                    SECRET_KEY
                ).toString(CryptoJS.enc.Utf8);

                chat.lastMessage.translatedText =
                    decryptedTranslatedText;
            }

            return chat;
        });

        res.status(201).send({

            message: 'chat fetched successfully',

            success:true,

            data: decryptedChats

        });

    }catch(error){

        res.status(400).send({

            message: error.message,

            success:false

        });

    }

});

router.post('/clear-unread-message', authMiddleware, async(req,res) => {
    try{
         const chatId = req.body.chatId;

        //we want to updare the unread count
        const chat = await Chat.findById(chatId);
        if(!chat){
            return res.send({
                message: 'chat not found',
                success:false
            })
        }

        const updatedChat = await Chat.findByIdAndUpdate(
            chatId, 
            { unreadMessageCount: 0 }, 
            { new: true }
        ).populate("members").populate("lastMessage");

        //we want to update the read property of the message
        await Message.updateMany(
             {chatId: chatId,read:false},
                {read:true}
        )
        res.send({
            message: 'unread messages cleared successfully',
            success:true, 
            data: updatedChat
        })
           
       
    }catch(error){
        res.send({
            message: error.message,
            success:false
        })   
    }
})

router.post('/delete-chat-for-me', authMiddleware, async (req, res) => {

    try {

        const { chatId } = req.body;

        await Chat.findByIdAndUpdate(
            chatId,
            {
                $addToSet: {
                    deletedFor: req.userId
                }
            }
        );

        res.send({
            success: true,
            message: "Chat removed"
        });

    } catch (error) {

        res.status(400).send({
            success: false,
            message: error.message
        });

    }

});

module.exports = router;