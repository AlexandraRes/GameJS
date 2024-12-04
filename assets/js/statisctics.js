const currentUser = 'o_c_t_0_b_e_r';
const url = "https://d5dsv84kj5buag61adme.apigw.yandexcloud.net";

/**
 * Сортируем пользователей по очкам вверх или вниз
 * 
 * @param {*} users 
 * @param {*} ascending 
 * @returns 
 */
const sortUsersByScore = (users, ascending = true) => {
    return users.sort((a, b) => {
        return ascending ? a.Score - b.Score : b.Score - a.Score;
    });
};

/**
 * Получение списка пользователей
 */
const usersGet = async () => {
    try {
        const response = await fetch(`${url}/players`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }

        const users = await response.json();

        /* создание таблицы с пользователями */
        renderUsersTable(users);
    } catch (e) {
        console.log(e);
        
    }
}

/**
 * Рендерим таблицу
 * 
 * @param {Array} users 
 */
const renderUsersTable = (users) => {
    const tableContainer = document.getElementById("users-table-container");

    const table = document.createElement("table");
    table.classList.add("users-table");

    const header = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const headers = ["Login", "Score"];

    headers.forEach((headerText, index) => {
        const th = document.createElement("th");
        th.textContent = headerText;
        
        /* если хедер score, то вешаем событие */
        if (headerText === "Score") {
            th.style.cursor = "pointer"; 
            th.addEventListener("click", () => {
                isAscending = !isAscending;
                const sortedUsers = sortUsersByScore(users, isAscending);
                renderUsersTable(sortedUsers);
            });
        }
        
        headerRow.appendChild(th);
    });

    header.appendChild(headerRow);
    table.appendChild(header);

    const tbody = document.createElement("tbody");

    /* создаем тело таблицы */
    users.forEach(user => {
        const row = document.createElement("tr");

        const loginCell = document.createElement("td");
        loginCell.textContent = user.Login;
        row.appendChild(loginCell);

        const scoreCell = document.createElement("td");
        scoreCell.textContent = user.Score;
        row.appendChild(scoreCell);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);

    tableContainer.innerHTML = '';
    tableContainer.appendChild(table);
}

let isAscending = true;

usersGet();