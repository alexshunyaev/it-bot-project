const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http');  
require('dotenv').config();

const port = 3000;
const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'front-end', 'index.html'));
});

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

const keywordSpotting = require('./keywordSpotter');

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('BotRequest', async (prompt) => { //Waiting for the client to send a message
        console.log(prompt);

        //чекает на кейворды в prompt, высирает пару на кейворд из keywordSpotter.js
        const commands = keywordSpotting(prompt);
        console.log('Identified keywords:', commands);
        console.log('Done!');
        if (commands != 'keywords_not_found') {
            for (let step = 0; step < commands.length; step++) {
                socket.emit('BotResponse', commands[step]);
            }
        } else {
            // HARD FALLBACK (?)
            socket.emit('BotResponse', 'I could understand the question. Can you repeat please?');
        }

    });

    //We don't really need this, but it logs when a client disconnects
    socket.on('disconnect', () => {  
        console.log('Client disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
