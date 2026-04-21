const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const authRouter = require('./controllers/authController');
const userRouter = require('./controllers/userController');
const chatRouter = require('./controllers/chatController');
const messageRouter = require('./controllers/messageController');

app.use(express.json());
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
     cors: {
          origin: 'http://localhost:5173',
          methods: ['GET', 'POST']
     }
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/chat',chatRouter);
app.use('/api/message', messageRouter);

//test socket connection from client
io.on('connection', (socket) => {
     console.log('connected with socket ID:' + socket.id);
});      

module.exports = server;