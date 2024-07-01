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
const { useAzureSocketIO } = require("@azure/web-pubsub-socket.io");

// Configure Azure Web PubSub with the connection string from environment variable


useAzureSocketIO(io, {
    hub: "Hub",
    connectionString: process.env.AZURE_PUBSUB_CONNECTION_STRING
});

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

io.on('connection', async (socket) => {
    console.log('New client connected');
    console.log('Client ID:', socket.id);
    console.log('Total clients connected:', io.engine.clientsCount);
    console.log('Client chat histoy will be stored in the', socket.id + '.txt file');

    
    /* // RM to save the chat history in a file
    fs.appendFile(socket.id + '.txt', '', (err) => {
        if (err) {
            console.error(err);
        }
    });
    */

    socket.on('BotRequest', async (prompt) => { // Waiting for the client to send a message
        
        /* // RM to save the chat history in a file
        fs.appendFile(socket.id + '.txt', 'User: ' + prompt + '\n', (err) => {
            if (err) {
                console.error(err);
            }
        });
        */

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
            
             /* // RM to save the chat history in a file
            fs.appendFile(socket.id + '.txt', 'Bot: ' + response.data.choices[0].message.content + '\n', (err) => {
                if (err) {
                    console.error(err);
                }
            });
            */

            socket.emit('BotResponse', response.data.choices[0].message.content);
        } catch (error) {
            console.error(error);
           
            /* // RM to save the chat history in a file
            fs.appendFile(socket.id + '.txt', 'Bot: Error communicating with ChatGPT\n', (err) => {
                if (err) {
                    console.error(err);
                }
            });
           */
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
