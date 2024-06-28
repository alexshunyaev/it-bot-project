import('https://cdn.socket.io/4.7.5/socket.io.min.js').then(({ io }) => {  
    const socket = io("https://it-bot.webpubsub.azure.com", {
        path: "/clients/socketio/hubs/Hub",
    });

    }).catch(error => {
    console.error('Error loading socket.io-client:', error);
});

document.addEventListener('DOMContentLoaded', function () {
    // Import the socket.io-client library asynchronously
    // IDK if it will work
    // Changed the import socket.io version to 4.7.5, maybe it will work

        
        document.getElementById('userInput').addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent the default action (adding a new line)
                document.getElementById('sendButton').click();
            }
        });

        document.getElementById('sendButton').addEventListener('click', sendMessage);

        socket.on('BotResponse', function (message) { // Waiting for the server to send the response message
            displayMessage(message, 'bot-message');
        });

        socket.on('BotError', function (message) { // Waiting for the server to send the error message
            showError(message);
        });

        async function displayMessage(message, className) {
            const chatWindow = document.getElementById('chat-window');
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', className);
            messageDiv.innerText = message;
            chatWindow.appendChild(messageDiv);
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }

        async function sendMessage() { // Before we were using axios to send the message to the server, now we are using socket.emit
            const prompt = document.getElementById('userInput').value;
            if (!prompt) return; // Prevent sending empty messages

            displayMessage(prompt, 'user-message'); // Now it's a separate function
            document.getElementById('userInput').value = ''; // Clear input field

            socket.emit('BotRequest', prompt); // Sending the message to the server
        }

        function showError(message) {
            displayMessage(message, 'error-message');
        }

});
