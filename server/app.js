const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());

const authRouter = require('./controllers/authController');
const userRouter = require('./controllers/userController');
const chatRouter = require('./controllers/chatController');
const messageRouter = require('./controllers/messageController');
const startScheduledMessagesCron = require('./cron/scheduledMessages');
const sendEmail = require('./utils/sendEmail');
const otpRouter = require('./controllers/otpController');

app.use(express.json({
     limit: '50mb'
}));
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
          cors: {
          origin: "*",
          methods: ["GET", "POST"]
          }
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/chat',chatRouter);
app.use('/api/message', messageRouter);
app.use('/api/otp', otpRouter);

const onlineUsers =[];

//test socket connection from client
io.on('connection', (socket) => {
   socket.on('join-room',userid => {
     socket.join(userid);
     
   });
   socket.on('send-message', (message) => {
     console.log(message);
     socket.broadcast
     .to(message.members[0])
     .to(message.members[1])
     .emit('receive-message', message);
     });

     // New event for message deletion
     socket.on('message-deleted', (data) => {

          io.to(data.members[0])
          .to(data.members[1])
          .emit('message-deleted', data);

          });
     // New event for clearing unread messages
     socket.on('clear-unread-messages', data => {
          io.to(data.members[0])
          .to(data.members[1])
          .emit('unread-messages-cleared', data);
     });

     // New event for typing indicator
     socket.on('user-typing', (data) => {
          io.to(data.members[0])
          .to(data.members[1])
          .emit('started-typing', data);
     });

     // New event for message reaction
     socket.on('message-reacted', (data) => {
     io.to(data.members[0])
     .to(data.members[1])
     .emit('message-reaction-updated', data);
     });

     // New event for online status
    socket.on('user-login', (userId) => {

               if (!onlineUsers.includes(userId)) {
                    onlineUsers.push(userId);
               }

               io.emit('online-users', onlineUsers);
          });
          
     socket.on('user-offline', (userId) => {

          const index = onlineUsers.indexOf(userId);

          if(index > -1){
               onlineUsers.splice(index, 1);
          }

          io.emit('online-users', onlineUsers);
     });
     

});  

startScheduledMessagesCron(io);


module.exports = server;