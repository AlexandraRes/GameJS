import { RequestsSender, apiURL, logCallback, errorCallback } from "./request_sender.js";

function showResponse(message = "", type = "error") {
  const responseElement = document.querySelector(".response-message");
  if (responseElement) {
    responseElement.textContent = message;
    if (type === "error") {
      responseElement.className = "response-message error";
      responseElement.style.color = "red";
    } else {
      responseElement.className = "response-message success";
      responseElement.style.color = "green";
    }
  } else {
    console.error("Элемент для вывода сообщений не найден.");
  }
}

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

const api = new RequestsSender(apiURL, handleApiResponse, handleApiError, true);

function handleApiResponse(responseText) {
  try {
    const response = JSON.parse(responseText);
    if (response.error) {
      if (response.error === "Missing authorization cookie") {
        alert("Ошибка токена. Пожалуйста, авторизуйтесь заново.");
        window.location.href = "/index.html";
        return;
      } else {
        showResponse(response.error, "error");
      }
    } else {
      showResponse("Успешный успех, а сила в памяти!", "success");
      setTimeout(function () {
        window.location.href = '/rules.html';
      }, 2000);
      sessionStorage.setItem("userLoggedIn", true);
    }
  } catch (e) {
    console.error("Ошибка обработки ответа:", e);
    handleApiError(responseText);
  }
}

function handleApiError(errorText) {
  console.error("Ошибка от сервера:", errorText);
  if (errorText.includes("player with login")) {
    showResponse("Нее второй пользователь с данным кодом не будет существовать ;)", "error");
  } else {
    showResponse("Ошибка, а вот теперь гадай в чем именно :)", "error");
  }
}

window.addEventListener('load', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');
  if (error === 'tokenExpired') {
    showResponse("Ошибка токена. Пожалуйста, авторизуйтесь заново.", "error");
  }
});

// // /////////////////////////////////////////////////////////////// //
// Получаем элементы
const scoreInput = document.getElementById("score-input");
const sendScoreButton = document.getElementById("send-score-btn");
// Обработчик для кнопки "Отправить Score"
sendScoreButton.addEventListener("click", () => {
  const scoreValue = scoreInput.value.trim();

  if (!scoreValue || isNaN(scoreValue)) {
    alert("Введите корректное значение Score!");
    return;
  }

  const dataS = JSON.stringify({ score: parseInt(scoreValue, 10) });

  console.log("Отправка Score на сервер:", dataS);

  // Отправляем Score на сервер
  api.httpPut(dataS, "players/o_c_t_0_b_e_r", { "Content-Type": "application/json" });
});

async function sendOfflineScoreToAPI(score) {
  api.httpPut(JSON.stringify({ score }), "players/o_c_t_0_b_e_r", {
    "Content-Type": "application/json",
  });
}
// // /////////////////////////////////////////////////////////////// //

document.getElementById("register-btn").addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    showResponse("Введите имя пользователя и пароль!", "error");
    return;
  }

  const hashedPassword = await hashPassword(password);
  const data = JSON.stringify({ login: username, password: hashedPassword });

  console.log("Регистрация: отправка данных", data);
  api.httpPost(data, "players", { "Content-Type": "application/json" });
});

document.getElementById("login-btn").addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    showResponse("Введите имя пользователя и пароль!", "error");
    return;
  }

  const hashedPassword = await hashPassword(password);
  const data = JSON.stringify({ login: username, password: hashedPassword });

  console.log("Авторизация: отправка данных", data);
  api.httpPost(data, "login", { "Content-Type": "application/json" });
});
