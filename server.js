const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const studios = JSON.parse(fs.readFileSync('train/data.json', 'utf8'));
const home = JSON.parse(fs.readFileSync('train/website_home_data.json', 'utf8'));
const contacts = JSON.parse(fs.readFileSync('train/website_contacts_data.json', 'utf8'));
const about = JSON.parse(fs.readFileSync('train/website_about_data.json', 'utf8'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'front-end', 'index.html'));
});

app.use(bodyParser.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files from the "front-end" directory
app.use(express.static(path.join(__dirname, 'front-end')));

io.on('connection', async (socket) => {
    console.log('New client connected');
    console.log('Client ID:', socket.id);
    console.log('Total clients connected:', io.engine.clientsCount);

    socket.on('cookie', (cookie) => {
        console.log('Cookie:', cookie);
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

    socket.on('BotRequest', async (prompt) => { // Waiting for the client to send a message

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
            //console.error(error); commented out this, cause it's imposssible to monitor server logs with such long error messages
            console.log('Error communicating with ChatGPT');
            socket.emit('BotError', 'Error communicating with ChatGPT');
        }
    });

    // Logs when a client disconnects
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
