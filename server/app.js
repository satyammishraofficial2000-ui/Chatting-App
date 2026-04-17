const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const authRouter = require('./controllers/authController');
const userRouter = require('./controllers/userController');
const chatRouter = require('./controllers/chatController');
const messageRouter = require('./controllers/messageController');

app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/chat',chatRouter);
app.use('/api/message', messageRouter);

module.exports = app;