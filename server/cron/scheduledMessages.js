const cron = require("node-cron");
const Message = require("../modules/message");
const Chat = require("../modules/chat");

const startScheduledMessagesCron = (io) => {

    cron.schedule("*/10 * * * * *", async () => {

        try {

            const messages = await Message.find({
                isScheduled: true,
                isDelivered: false,
                scheduledFor: { $lte: new Date() }
            });

            for (const message of messages) {

                await Message.findByIdAndUpdate(message._id, {
                    isDelivered: true,
                    deliveredAt: new Date()
                });

                const updatedMessage = await Message.findById(message._id);

                await Chat.findByIdAndUpdate(message.chatId, {
                    lastMessage: updatedMessage._id,
                    $inc: { unreadMessageCount: 1 }
                });

                io.emit("receive-message", updatedMessage);

            }

        } catch (error) {
            console.log(error);
        }

    });

};

module.exports = startScheduledMessagesCron;