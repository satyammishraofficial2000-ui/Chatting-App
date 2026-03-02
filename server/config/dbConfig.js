const mongoose = require('mongoose');
//it provide connection of mongodb to express
mongoose.connect(process.env.CONN_STRING);

//connection state
const db = mongoose.connection;

//on successful connection
db.on('connected' , () => {
    console.log('successfully connected');
})

//on not connecting successfully
db.on('err', () =>{
    console.log('error');
})
module.exports = db;