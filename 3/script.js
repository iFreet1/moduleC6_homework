// Получаем необходимые элементы

sectionMessages = document.querySelector('.section-messages');
textareaMessage = document.querySelector('.textarea-message');
btnSend = document.querySelector('.btn-send');
btnGeoLocation = document.querySelector('.btn-geolocation');

// Растягиваем окно сообщений по высоте окна браузера

sectionMessages.style.height = (document.documentElement.clientHeight - 100) + "px";

// Глобальная переменная для хранения ссылки на объект WebSocket

let websocket;

// Функция отправки сообщения

function sendMessage(msg, typeMsg) {
    // Объект хранящий тип сообщения и текст сообщения
    const msgData = {
        typeMessage: typeMsg,
        message: msg
    }

    // В зависимости от типа сообщения, выбираем способ его отображения
    msgData.typeMessage === "geolocation" ? showGeolocation(msgData.message) : showChatMessage(msg, false);
    // Отправляем сообщение серверу
    websocket.send(JSON.stringify(msgData));
}

// Функция отображения сообщения

function showChatMessage(msg, fromServer) {
    textAlign = fromServer ? "flex-start" : "flex-end"; // если сообщение пришло от сервера - прижимаем сообщение к левой стороне, иначе к правой

    sectionMessages.innerHTML += 
        `<div style="display: flex; justify-content: ${textAlign}; margin: 10px;">
            <span style="border: 4px solid #bad7ec; border-radius: 5px; padding: 10px;">${msg}</span>
        </div>`;
}

// Функция отображения геолокации

function showGeolocation(geoData) {
    sectionMessages.innerHTML += 
        `<div style="display: flex; justify-content: flex-end; margin: 10px;">
            <a class="link-geolocation" href="https://www.openstreetmap.org/#map=18/${geoData}" style="border: 4px solid #bad7ec; border-radius: 5px; padding: 10px;">Гео-локация</a>
        </div>`
}

// Функция создания и настройки объекта WebSocket

function setupWebSocket(wsUri) {
    websocket = new WebSocket(wsUri);

    websocket.onopen = function(evt) {
        showChatMessage("Подключились к wss://echo.websocket.org", true);
    }

    websocket.onmessage = function(evt) {
        const msgData = JSON.parse(evt.data);

        // В случае если тип входящего сообщения, не является геолокацией, отображаем сообщение
        if (msgData.typeMessage === "geolocation") {
            showChatMessage(msgData.message, true);
        }
    }

    websocket.onclose = function(evt) {
        showChatMessage("Отключились от wss://echo.websocket.org", true);
    }
}

// После загрузки скрипта, создаем и настраиваем WebSocket, а так же вешаем обработчики на кнопки

setupWebSocket("wss://echo.websocket.org/");

btnSend.addEventListener('click', () => {
    sendMessage(textareaMessage.value, 'text');
});

btnGeoLocation.addEventListener('click', () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { coords } = position;
            sendMessage(`${coords.latitude}/${coords.longitude}`, 'geolocation');
        });
    } else {
        showChatMessage("Местоположение недоступно", false);
    }
});