// scripts.js
document.getElementById('send-button').addEventListener('click', function() {
    let userInput = document.getElementById('user-input').value;
    if (userInput.trim() !== '') {
        let userMessage = document.createElement('div');
        userMessage.className = 'message user-message';
        userMessage.innerText = userInput;
        document.getElementById('chat-window').appendChild(userMessage);
        
        document.getElementById('user-input').value = '';
        document.getElementById('chat-window').scrollTop = document.getElementById('chat-window').scrollHeight;

        // Simulate bot response
        setTimeout(function() {
            let botMessage = document.createElement('div');
            botMessage.className = 'message bot-message';
            botMessage.innerText = "I'm here to help!";
            document.getElementById('chat-window').appendChild(botMessage);
            document.getElementById('chat-window').scrollTop = document.getElementById('chat-window').scrollHeight;
        }, 1000);
    }
});
