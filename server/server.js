const dotenv = require('dotenv');
dotenv.config({path : './config.env'});

const dbconfig = require('./config/dbConfig');

let app = require('./app')

const port =process.env.PORT_NUMBER || 3000;

app.listen(port , () => {
    console.log("listening to the request" + port);
});