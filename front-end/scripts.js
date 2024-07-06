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

        socket.on('cookie_check', (message) => {
            displayMessage(message, 'bot-message');
        });

        socket.on('connect_error', (error) => { // Handle connection errors
            console.error('WebSocket connection failed:', error.stack);
            showError('WebSocket connection failed. Please try again later.');
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