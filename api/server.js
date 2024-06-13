const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../front-end/public'))); // Serve static files from the "public" directory

app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;
    
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/engines/davinci-codex/completions',
            {
                prompt: userMessage,
                max_tokens: 150,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        const botMessage = response.data.choices[0].text.trim();
        res.json({ message: botMessage });
    } catch (error) {
        console.error('Error communicating with OpenAI API:', error);
        res.status(500).send('Error communicating with OpenAI API');
    }
});

// Serve the index.html file for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../front-end/public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
