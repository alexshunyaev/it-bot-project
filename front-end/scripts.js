document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('userInput').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default action (adding a new line)
            document.getElementById('sendButton').click();
        }
    });
});

async function sendMessage() {
    fetch('https://example.com/data') .then(response => response.json()) .then(data => console.log(data)) .catch(error => console.error(error));
    fetch('https://example.com/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'John', email: 'john@example.com' }) }) .then(response => response.json()) .then(data => console.log(data)) .catch(error => console.error(error)); 
    const prompt = document.getElementById('userInput').value;
    if (!prompt) return; // Prevent sending empty messages

    const chatWindow = document.getElementById('chat-window');

    // Append user message
    const userMessageDiv = document.createElement('div');
    userMessageDiv.classList.add('message', 'user-message');
    userMessageDiv.innerText = prompt;
    chatWindow.appendChild(userMessageDiv);

    document.getElementById('userInput').value = ''; // Clear input field

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });

        if (response.ok) {
            const data = await response.json();
            const botMessageDiv = document.createElement('div');
            botMessageDiv.classList.add('message', 'bot-message');
            botMessageDiv.innerText = data;
            chatWindow.appendChild(botMessageDiv);
        } else {
            showError('Error communicating with ChatGPT');
        }
    } catch (error) {
        console.error(error);
        showError('Error communicating with ChatGPT');
    }

    // Scroll to the bottom of the chat window
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function showError(message) {
    const chatWindow = document.getElementById('chat-window');
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('message', 'error-message');
    errorDiv.innerText = message;
    chatWindow.appendChild(errorDiv);
}
