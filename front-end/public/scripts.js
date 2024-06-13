document.getElementById('send-button').addEventListener('click', sendMessage);

document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    let userInput = document.getElementById('user-input').value;
    if (userInput.trim() !== '') {
        let userMessage = document.createElement('div');
        userMessage.className = 'message user-message';
        userMessage.innerText = userInput;
        document.getElementById('chat-window').appendChild(userMessage);
        
        document.getElementById('user-input').value = '';
        document.getElementById('chat-window').scrollTop = document.getElementById('chat-window').scrollHeight;

        try {
            const response = await fetch('http://your-azure-app-url/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userInput }),
            });

            const data = await response.json();
            let botMessage = document.createElement('div');
            botMessage.className = 'message bot-message';
            botMessage.innerText = data.message;
            document.getElementById('chat-window').appendChild(botMessage);
            document.getElementById('chat-window').scrollTop = document.getElementById('chat-window').scrollHeight;
        } catch (error) {
            console.error('Error:', error);
            let errorMessage = document.createElement('div');
            errorMessage.className = 'message bot-message';
            errorMessage.innerText = 'Sorry, something went wrong.';
            document.getElementById('chat-window').appendChild(errorMessage);
            document.getElementById('chat-window').scrollTop = document.getElementById('chat-window').scrollHeight;
        }
    }
}
