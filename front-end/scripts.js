document.addEventListener('DOMContentLoaded', function () {
    // Initialize the socket connection
    var socket = io(); 

    // Event listener for pressing "Enter" key in input field
    document.getElementById('userInput').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default action (adding a new line)
            document.getElementById('sendButton').click();
        }
    });

    // Event listener for clicking the send button
    document.getElementById('sendButton').addEventListener('click', sendMessage);

    // Event listener for receiving bot responses
    socket.on('BotResponse', function (message) { //Waiting for the server to send the response message
        displayMessage(message, 'bot-message');
    });
    
    // Event listener for receiving bot errors
    socket.on('BotError', function (message) { //Waiting for the server to send the error message
        showError(message);
    });

    // Function to get a cookie value by name
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
    
    // Event listener for receiving client info request
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

    // Function to display messages in the chat window
    async function displayMessage(message, className) {
        const chatWindow = document.getElementById('chat-window');
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', className);
        messageDiv.innerText = message;
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    // Function to handle sending messages
    async function sendMessage() { //Before we were using axios to send the message to the server, now we are using socket.emit
        const prompt = document.getElementById('userInput').value;
        if (!prompt) return; // Prevent sending empty messages


        displayMessage(prompt, 'user-message'); //Now it's a sepatate function
        document.getElementById('userInput').value = ''; // Clear input field

        socket.emit('BotRequest', prompt); //Sending the message to the server
    }

    // Function to display errors
    function showError(message) {
        displayMessage(message, 'error-message');
    }
});