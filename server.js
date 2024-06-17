const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');


const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'front-end')));


require('dotenv').config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Replace with your OpenAI API key

app.post('/chat', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }]
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data.choices[0].message.content);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error communicating with ChatGPT');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
