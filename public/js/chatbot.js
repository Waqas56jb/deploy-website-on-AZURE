document.addEventListener('DOMContentLoaded', () => {
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const chatbox = document.getElementById('chatbox');
  const typingIndicator = document.getElementById('typing-indicator');

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage(message, 'user-message');
    userInput.value = '';
    userInput.disabled = true;
    typingIndicator.style.display = 'block';

    try {
      const response = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      typingIndicator.style.display = 'none';
      await typeMessage(data.response, 'bot-message');
    } catch (err) {
      typingIndicator.style.display = 'none';
      appendMessage('Sorry, I couldn’t connect to the server. Try again later.', 'bot-message');
    } finally {
      userInput.disabled = false;
      userInput.focus();
    }
  });

  function appendMessage(text, className) {
    const messageElement = document.createElement('p');
    messageElement.textContent = text;
    messageElement.className = className;
    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight;
  }

  async function typeMessage(text, className) {
    const messageElement = document.createElement('p');
    messageElement.className = className;
    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight;

    for (let i = 0; i < text.length; i++) {
      messageElement.textContent += text[i];
      await new Promise(resolve => setTimeout(resolve, 25));
      chatbox.scrollTop = chatbox.scrollHeight;
    }
  }
});