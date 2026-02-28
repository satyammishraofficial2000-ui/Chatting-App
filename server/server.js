let app = require('./app')

const port =3000;

app.listen(port , () => {
    console.log("listening to the request" + port);
});