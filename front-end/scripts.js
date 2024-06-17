//document.getElementById('userInput').addEventListener('keypress', function(event) {
//    if (event.key === 'Enter') {
//        sendMessage();
//    }
//});

async function sendMessage() {
            const prompt = document.getElementById('userInput').value;
            const responseDiv = document.getElementById('response');

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
                    responseDiv.innerText = data;
                } else {
                    responseDiv.innerText = 'Error communicating with ChatGPT';
                }
            } catch (error) {
                console.error(error);
                responseDiv.innerText = 'Error communicating with ChatGPT';
            }
        }
