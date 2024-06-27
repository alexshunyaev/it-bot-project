const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http'); 
const socketIO = require('socket.io'); 
require('dotenv').config();

const port = 3000;
const app = express();

const server = http.createServer(app);
const io = socketIO(server);

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const studios = JSON.parse(fs.readFileSync('train/data.json', 'utf8'));
const home = JSON.parse(fs.readFileSync('train/website_home_data.json', 'utf8'));
const contacts = JSON.parse(fs.readFileSync('train/website_contacts_data.json', 'utf8'));
const about = JSON.parse(fs.readFileSync('train/website_about_data.json', 'utf8'));

app.use(bodyParser.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

//app.use(bodyParser.json());
//app.use(cors());

//app.use((req, res, next) => {
//    res.header('Access-Control-Allow-Origin', '*');
//    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//    next();
//});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'front-end')));


io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('BotRequest', async (prompt) => { //Waiting for the client to send a message
        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: `You are a website assistant for Superstudio Events. The website contacts and about pages:\n${JSON.stringify(contacts, null, 2)},${JSON.stringify(about, null, 2)}. Here is the information about the halls and studios:\n${JSON.stringify(studios, null, 2)}` },
                    { role: 'user', content: prompt }
                ]
            }, {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            socket.emit('BotResponse', response.data.choices[0].message.content);
        } catch (error) {
            console.error(error);
            socket.emit('BotError', 'Error communicating with ChatGPT');
        }
    });

    //We don't really need this, but it logs when a client disconnects
    //socket.on('disconnect', () => {  
    //  console.log('Client disconnected');
    //});
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
