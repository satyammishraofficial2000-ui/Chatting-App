const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({
   origin: "https://chatting-app-git-main-satyam-mishras-projects-a4cffc01.vercel.app",
   credentials: true
}))

const authRouter = require('./controllers/authController');
const userRouter = require('./controllers/userController');
const chatRouter = require('./controllers/chatController');
const messageRouter = require('./controllers/messageController');
const user = require('./modules/user');

app.use(express.json({
     limit: '50mb'
}));
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
     cors: {
          origin: 'https://chatting-app-git-main-satyam-mishras-projects-a4cffc01.vercel.app',
          methods: ['GET', 'POST']
     }
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/chat',chatRouter);
app.use('/api/message', messageRouter);

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

     socket.on('clear-unread-messages', data => {
          io.to(data.members[0])
          .to(data.members[1])
          .emit('unread-messages-cleared', data);
     });
     socket.on('user-typing', (data) => {
          io.to(data.members[0])
          .to(data.members[1])
          .emit('started-typing', data);
     })

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

module.exports = server;