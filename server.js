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

// Serve the main HTML file
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

// Serve static files from the "front-end" directory
app.use(express.static(path.join(__dirname, 'front-end')));

const keywordSpotting = require('./keywordSpotter');

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('cookie', () => { 
        socket.emit('client-info', 'Seems like you are new here. Please provide your name and phone number, so we can assist you better.');
    });

    socket.on('got_cookie', (cookie) => {   
        console.log('Cookie set:', cookie);
        socket.emit('BotResponse', 'Thank you for providing your contact information. How can I assist you today?');
        try {
            fs.appendFileSync('client_contact.txt', `${JSON.stringify(cookie)}\n`);
        } catch (error) {
            console.error('Error writing to file:', error);
        }
    });

    socket.on('BotRequest', async (prompt) => { //Waiting for the client to send a message
        console.log(prompt);

        // Checks if there are any jeywords in the prompt
        const commands = keywordSpotting(prompt);
        console.log('Identified keywords:', commands);
        console.log('Done!');
        if (commands != 'keywords_not_found') {    // Handling the case when there are keywords in the prompt
            for (let step = 0; step < commands.length; step++) {
                socket.emit('BotResponse', commands[step]);
            }
        } else {
            // Hard fallback if no keywords were found
            socket.emit('BotResponse', 'I could not understand the question. Can you repeat please?');
        }

    });

    // Logs when a client disconnects
    socket.on('disconnect', () => {  
        console.log('Client disconnected');
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});