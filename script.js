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

    // Decide whether to use OpenAI or Bing Search API based on the user input
    if (isCodeQuery(userInput)) {
        fetchOpenAIResponse(userInput);
    } else {
        fetchBingSearchResults(userInput);
    }
}

function isCodeQuery(query) {
    const codeKeywords = ['code', 'script', 'program', 'function', 'algorithm'];
    return codeKeywords.some(keyword => query.toLowerCase().includes(keyword));
}

function fetchOpenAIResponse(userInput) {
    fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_OPENAI_API_KEY'
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

function fetchBingSearchResults(userInput) {
    fetch(`https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(userInput)}`, {
        method: 'GET',
        headers: {
            'Ocp-Apim-Subscription-Key': 'YOUR_BING_API_KEY'
        }
    })
    .then(response => response.json())
    .then(data => {
        const results = data.webPages.value.map(page => `${page.name}: ${page.url}`).join('\n\n');
        addMessage(results, 'bot');
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
