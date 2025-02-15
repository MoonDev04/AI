document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    addMessage(userInput, 'user');
    document.getElementById('user-input').value = '';

    fetchOpenAIResponse(userInput);
}

function fetchOpenAIResponse(userInput) {
    fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
            model: 'text-davinci-002',
            prompt: userInput,
            max_tokens: 150
        })
    })
    .then(response => response.json())
    .then(data => {
        const botMessage = data.choices[0].text.trim();
        addMessage(botMessage, 'bot');
    })
    .catch(error => {
        console.error('Error:', error);
        addMessage('Sorry, something went wrong!', 'bot');
    });
}

function addMessage(text, sender) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message', sender);
    messageContainer.textContent = text;

    const chatContainer = document.getElementById('chat-container');
    chatContainer.appendChild(messageContainer);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
