require('dotenv').config();

const { PORT = 8000 } = process.env;
const app = require("./app");
const connectDB = require('./db/db');

const server = async () => {
    try{
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Listening server on port ${PORT}!`);
        });
    } catch (err) {
        console.log(`server failed:`, err.message);
    }
}

server();

//const listener = () => console.log(`Listening on Port ${PORT}!`);
//app.listen(PORT, listener);