document.addEventListener('DOMContentLoaded', function () {
    const socket = io();

    document.getElementById('userInput').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default action (adding a new line)
            document.getElementById('sendButton').click();
        }
    });

    document.getElementById('sendButton').addEventListener('click', sendMessage);

    socket.on('BotResponse', function (message) {
        displayMessage(message, 'bot-message');
    });

    socket.on('BotError', function (message) {
        showError(message);
    });

    socket.on('connect_error', (error) => { // Handle connection errors
        console.error('WebSocket connection failed:', error.stack);
        showError('WebSocket connection failed. Please try again later.');
    });

    //client history part.

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // Function to set a cookie
    function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${d.toUTCString()}`;
        document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=None; Secure`;
    }

    // Check if cookie is undefined or empty
    let cookieValue = getCookie('userCookie');
    if (cookieValue === undefined || cookieValue === '') {
        socket.emit('cookie');
    }

    socket.on('client-info', function (message) {
        displayMessage(message, 'bot-message');
        document.getElementById('sendButton').removeEventListener('click', sendMessage);
        document.getElementById('sendButton').addEventListener('click', function () {
            const cookie = document.getElementById('userInput').value;
            setCookie('userCookie', cookie, 7); // Set cookie for 7 days
            displayMessage(cookie, 'user-message');
            document.getElementById('userInput').value = '';
            if (!cookie) return; // Prevent sending empty messages  
            socket.emit('got_cookie', cookie);
        }, { once: true });

        document.getElementById('sendButton').addEventListener('click', sendMessage);
    });

    async function displayMessage(message, className) {
        const chatWindow = document.getElementById('chat-window');
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', className);
        messageDiv.innerText = message;
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    async function sendMessage() {
        const prompt = document.getElementById('userInput').value;
        if (!prompt) return; // Prevent sending empty messages

        displayMessage(prompt, 'user-message'); // Display user's message
        document.getElementById('userInput').value = ''; // Clear input field

        socket.emit('BotRequest', prompt); // Send message to the server
    }

    function showError(message) {
        displayMessage(message, 'error-message');
    }
});