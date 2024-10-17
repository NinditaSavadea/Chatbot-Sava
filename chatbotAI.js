const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");

let userMessage;
const API_KEY = "AIzaSyDwrP8o8T4cDeuEvXskdSCoE38c6-ICmkc";


const createChatLi = (message, className) => {
    //create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p>${message}</p>` : `<img src="./chatbotnewnobg.png" alt="chatbot"><p>${message}</p>`; 
    chatLi.innerHTML = chatContent;
    return chatLi;
}

const typeText = (element, text) => {
    let index = 0;
    element.textContent = '';
    const interval = setInterval(() => {
        if (index < text.length) {
            element.textContent += text[index];
            index++;
        } else {
            clearInterval(interval);
        }
    }, 40); 
}

const generateResponse = (incomingChatLi) => {
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            contents: [{ 
              role: "user", 
              parts: [{ text: userMessage }] 
            }] 
          }),
      };     

      //send POST request to API, get response
      fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        const botMessage = data.candidates[0].content.parts[0].text;
        typeText(messageElement, botMessage);
      }).catch((error) => {
        messageElement.textContent = "Oops! Terjadi Suatu Kesalahan. Coba Ulangi Kembali.";
      })
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage)return;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));

    setTimeout (() => {
        const incomingChatLi = createChatLi("Berfikir...", "incoming")
        chatbox.appendChild(incomingChatLi);
        generateResponse(incomingChatLi);
    }, 300);

    chatInput.value="";
}

const getGreetingMessage = () => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 5 && hour < 11) {
        return "Selamat Pagi PTPs, Ada pertanyaan? Kami siap membantu!";
    } else if (hour >= 11 && hour <= 15) {
        return "Selamat Siang PTPs, Ada pertanyaan? Kami siap membantu!";
    } else if (hour > 15 && hour <= 18) {
        return "Selamat Sore PTPs, Ada pertanyaan? Kami siap membantu!";
    } else {
        return "Selamat Malam PTPs, Ada pertanyaan? Kami siap membantu!";
    }
};

const showGreetingMessage = () => {
    const greetingMessage = getGreetingMessage();
    const chatLi = createChatLi(greetingMessage, "incoming");
    chatbox.appendChild(chatLi);

    displayTypingEffect(chatLi.querySelector("p"));
};

const displayTypingEffect = (element) => {
    const text = element.textContent;
    element.textContent = '';
    let i = 0;
    const typingInterval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typingInterval);
        }
    }, 30); 
};



showGreetingMessage();

sendChatBtn.addEventListener("click", handleChat);

chatInput.addEventListener("keydown", (event) => {
    if(event.key == "Enter") {
        event.preventDefault();
        handleChat();
    }
})