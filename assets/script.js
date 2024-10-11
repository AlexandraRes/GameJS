// Основные переменные
let playerName = '';
let score = 0;
let highScore = 0;
let sequence = [];
let userSequence = [];
let isPlaying = false;

// Получаем элементы модального окна и игры
const modal = document.getElementById('modal');
const nameInput = document.getElementById('name-input');
const errorMessage = document.getElementById('error-message');
const gameContainer = document.getElementById('game-container');
const playerNameDisplay = document.getElementById('player-name');
const submitNameButton = document.getElementById('submit-name');
const startGameButton = document.getElementById('start-game');
const logoutButton = document.getElementById('logout');
const welcomeMessage = document.getElementById('welcome-message');

// Звуки
const sounds = {
    green: new Audio('/assets/sounds/green.mp3'),
    red: new Audio('/assets/sounds/red.mp3'),
    yellow: new Audio('/assets/sounds/yellow.mp3'),
    blue: new Audio('/assets/sounds/blue.mp3'),
    click: new Audio('/assets/sounds/click.mp3'),
    start: new Audio('/assets/sounds/start-game.mp3')
};

// Загружаем таблицу пользователей из localStorage или создаем новую, если ее нет
let usersTable = JSON.parse(localStorage.getItem('usersTable')) || {};

// Функция для обновления данных в таблице пользователей
function updateUsersTable() {
    localStorage.setItem('usersTable', JSON.stringify(usersTable));
}

// Проверка наличия пользователя в таблице
if (localStorage.getItem('currentUser')) {
    playerName = localStorage.getItem('currentUser');
    if (usersTable[playerName]) {
        score = usersTable[playerName].score;
        highScore = usersTable[playerName].highScore;
        welcomeMessage.textContent = "Мы рады снова вас видеть, " + playerName + "!";
    } else {
        usersTable[playerName] = { score: 0, highScore: 0 };
        updateUsersTable();
        welcomeMessage.textContent = "Рады с вами познакомиться!";
    }
    playerNameDisplay.textContent = playerName;
    modal.style.display = 'none';
    gameContainer.style.display = 'block';
    document.getElementById('current-score').textContent = score;
    document.getElementById('high-score').textContent = highScore;
} else {
    welcomeMessage.textContent = "Рады с вами познакомиться!";
}

// Обработка нажатия на кнопку "Submit"
submitNameButton.addEventListener('click', function () {
    const name = nameInput.value.trim();

    if (name === "") {
        showError();
    } else {
        playerName = name;
        localStorage.setItem('currentUser', playerName);
        playerNameDisplay.textContent = playerName;
        if (!usersTable[playerName]) {
            usersTable[playerName] = { score: 0, highScore: 0 };
            welcomeMessage.textContent = "Рады с вами познакомиться, " + playerName + "!";
        } else {
            score = usersTable[playerName].score;
            highScore = usersTable[playerName].highScore;
            welcomeMessage.textContent = "Мы рады снова вас видеть, " + playerName + "!";
        }
        updateUsersTable();
        closeModal();
        document.getElementById('current-score').textContent = score;
        document.getElementById('high-score').textContent = highScore;
    }
});

startGameButton.addEventListener('click', startGame);

// Функция для показа ошибки при пустом имени
function showError() {
    nameInput.classList.add('error');
    errorMessage.style.display = 'block';
}

// Закрытие модального окна
function closeModal() {
    modal.style.display = 'none';
    gameContainer.style.display = 'block';
}

// Запуск игры
function startGame() {
    isPlaying = true;
    startGameButton.removeEventListener('click', startGame);
    resetGame();
    sounds.start.play();
    setTimeout(() => {
        nextRound();
        playSequence();
    }, 1000);
}

// Функция сброса игры
function resetGame() {
    score = 0;
    sequence = [];
    userSequence = [];
    document.getElementById('current-score').textContent = score;
}

// Генерация следующей последовательности
function nextRound() {
    let nextColor = ['green', 'red', 'yellow', 'blue'][Math.floor(Math.random() * 4)];
    sequence.push(nextColor);
}

// Проигрывание последовательности цветов
function playSequence() {
    let delay = 0;
    sequence.forEach((color) => {
        setTimeout(() => {
            flashButton(color);
        }, delay);
        delay += 1000;
    });
    userSequence = [];
}

// Проигрывание звука и подсветка цвета
function flashButton(color) {
    sounds[color].play();
}

// Обработка кликов на цветные кнопки
document.querySelectorAll('.color-button').forEach(button => {
    button.addEventListener('click', (e) => {
        const selectedColor = e.target.id;
        sounds.click.play();
        userSequence.push(selectedColor);
        checkUserSequence();
    });
});

// Проверка последовательности пользователя
function checkUserSequence() {
    if (!isPlaying) {
        return;
    }

    if (userSequence[userSequence.length - 1] !== sequence[userSequence.length - 1]) {
        endGame();
        startGameButton.addEventListener('click', startGame);
        return;
    }

    if (userSequence.length === sequence.length) {
        score++;
        document.getElementById('current-score').textContent = score;
        usersTable[playerName].score = score;
        if (score > highScore) {
            highScore = score;
            usersTable[playerName].highScore = highScore;
            document.getElementById('high-score').textContent = highScore;
        }
        updateUsersTable();
        setTimeout(() => {
            nextRound();
            playSequence();
        }, 1000);
    }
}

// Функция завершения игры
function endGame() {
    isPlaying = false;
    alert(`Игра окончена! Ваш счёт: ${score}`);
    usersTable[playerName].score = 0;
    updateUsersTable();
    document.getElementById('current-score').textContent = 0;
}

// Обработка выхода из игры
logoutButton.addEventListener('click', function () {
    localStorage.removeItem('currentUser');
    playerName = '';
    gameContainer.style.display = 'none';
    modal.style.display = 'flex';
    nameInput.value = '';
    welcomeMessage.textContent = '';
});
