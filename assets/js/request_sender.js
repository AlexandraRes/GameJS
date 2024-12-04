export class RequestsSender {

  constructor(url, callback, errorCallback, isAsync = true) {
    this.url = url;
    this.callback = callback;
    this.errorCallback = errorCallback;
    this.isAsync = isAsync;
  }
  httpGet(path = "", headers = {}) {

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.readyState == 4) {
        if (xmlHttp.status >= 400) {
          this.errorCallback(xmlHttp.responseText);
        } else {
          this.callback(xmlHttp.responseText);
        }
      }
    };
    xmlHttp.open("GET", this.url + "/" + path, this.isAsync);
    for (let key in headers) xmlHttp.setRequestHeader(key, headers[key]);
    xmlHttp.send(null);
  }

  httpPost(data, path = "", headers = {}) {

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.withCredentials = true;

    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.readyState == 4) {
        if (xmlHttp.status >= 400) {
          this.errorCallback(xmlHttp.responseText);
        } else {
          this.callback(xmlHttp.responseText);
        }
      }
    };

    xmlHttp.open("POST", this.url + "/" + path, this.isAsync);
    for (let key in headers) xmlHttp.setRequestHeader(key, headers[key]);
    xmlHttp.send(data);
  }

  httpPut(data, path = "", headers = {}) {

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.readyState == 4) {
        if (xmlHttp.status >= 400) {
          this.errorCallback(xmlHttp.responseText);
        } else {
          this.callback(xmlHttp.responseText);
        }
      }
    };

    xmlHttp.withCredentials = true;

    xmlHttp.open("PUT", this.url + "/" + path, this.isAsync);
    for (let key in headers) xmlHttp.setRequestHeader(key, headers[key]);
    xmlHttp.send(JSON.stringify(data));
  }

  
}

export function logCallback(responseText) {
  console.log("Ответ от сервера:", responseText);
}

export function errorCallback(errorText) {
  console.error("Ошибка от сервера:", errorText);

  // Преобразуем ответ в объект, чтобы получить сообщение ошибки
  try {
    const errorResponse = JSON.parse(errorText);
    if (errorResponse.error && errorResponse.error === "Missing authorization cookie") {
      // Перенаправляем на страницу авторизации, если cookie отсутствует
      alert("Ваша сессия истекла или вы не авторизованы. Пожалуйста, войдите снова.");
      window.location.href = "/index.html";  // Переадресовываем на auth.html
    } else {
      // Если ошибка не связана с авторизацией, выводим её
      alert("Произошла ошибка. Попробуйте снова.");
    }
  } catch (e) {
    console.error("Ошибка при обработке ответа:", e);
    alert("Не удалось обработать ошибку.");
  }
}


export const devApiURL = "http://127.0.0.1:8000";
export const apiURL = "https://d5dsv84kj5buag61adme.apigw.yandexcloud.net";
