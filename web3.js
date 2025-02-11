// Данные администратора
const adminCredentials = {
    email: "admin@example.com",
    password: "admin123"
};

// Данные фильмов
let films = JSON.parse(localStorage.getItem("films")) || [];

// Данные о занятых местах
let occupiedSeats = JSON.parse(localStorage.getItem("occupiedSeats")) || {};

// Выбранные места
let selectedSeats = [];

// Цена билета
const TICKET_PRICE = 500;

// Данные пользователей
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

// Места в зале
const seats = ["A1", "A2", "B1", "B2", "C1", "C2"];

// Проверка авторизации администратора
function checkAdminAuth() {
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
    if (!isAdminLoggedIn && window.location.pathname.includes("web3(5).html")) {
        window.location.href = "web3(4).html";
    }
}

// Вход администратора
document.getElementById("admin-login-form")?.addEventListener("submit", function(event) {
    event.preventDefault();
    const email = document.getElementById("admin-email").value;
    const password = document.getElementById("admin-password").value;

    if (email === adminCredentials.email && password === adminCredentials.password) {
        localStorage.setItem("isAdminLoggedIn", "true");
        window.location.href = "web3(5).html";
    } else {
        alert("Неверный email или пароль!");
    }
});

// Выход администратора
document.getElementById("admin-logout-button")?.addEventListener("click", function() {
    localStorage.removeItem("isAdminLoggedIn");
    window.location.href = "web3(4).html";
});

// Добавление фильма
document.getElementById("add-film-form")?.addEventListener("submit", function(event) {
    event.preventDefault();
    const title = document.getElementById("film-title").value;
    const genre = document.getElementById("film-genre").value;
    const duration = document.getElementById("film-duration").value;
    const rating = document.getElementById("film-rating").value;

    const newFilm = { id: films.length + 1, title, genre, duration, rating };
    films.push(newFilm);
    localStorage.setItem("films", JSON.stringify(films));
    alert("Фильм добавлен!");
});

function loadFilms() {
    const filmList = document.querySelector(".film-list");
    if (filmList) {
        filmList.innerHTML = "";
        films.forEach(film => {
            const filmDiv = document.createElement("div");
            filmDiv.innerHTML = `
                <h3>${film.title}</h3>
                <p>Жанр: ${film.genre}</p>
                <p>Длительность: ${film.duration} мин</p>
                <p>Рейтинг: ${film.rating}</p>
            `;
            filmList.appendChild(filmDiv);
        });
    }
}

// Загрузка фильмов в выпадающий список
function loadFilmSelect() {
    const filmSelect = document.getElementById("film-select");
    if (filmSelect) {
        filmSelect.innerHTML = "";
        films.forEach(film => {
            const option = document.createElement("option");
            option.value = film.title;
            option.textContent = film.title;
            filmSelect.appendChild(option);
        });
    }
}

// Создание визуализации зала
function createSeatMap() {
    const seatRows = document.querySelector(".seat-rows");
    if (seatRows) {
        seatRows.innerHTML = "";
        const rows = ["A", "B", "C", "D", "E"]; // Ряды
        const seatsPerRow = 10; // Мест в ряду

        rows.forEach(row => {
            const rowDiv = document.createElement("div");
            rowDiv.className = "seat-row";
            for (let i = 1; i <= seatsPerRow; i++) {
                const seatId = `${row}${i}`;
                const seat = document.createElement("div");
                seat.className = occupiedSeats[seatId] ? "seat occupied" : "seat";
                seat.textContent = seatId;
                seat.addEventListener("click", () => toggleSeatSelection(seatId));
                rowDiv.appendChild(seat);
            }
            seatRows.appendChild(rowDiv);
        });
    }
}

// Выбор места
function toggleSeatSelection(seatId) {
    if (occupiedSeats[seatId]) return; // Нельзя выбрать занятое место

    const seat = Array.from(document.querySelectorAll(".seat")).find(s => s.textContent === seatId);
    if (selectedSeats.includes(seatId)) {
        selectedSeats = selectedSeats.filter(id => id !== seatId);
        seat.classList.remove("selected");
    } else {
        selectedSeats.push(seatId);
        seat.classList.add("selected");
    }

    updateSelectionInfo();
}

// Обновление информации о выбранных местах
function updateSelectionInfo() {
    const selectedSeatsCount = document.getElementById("selected-seats-count");
    const totalPrice = document.getElementById("total-price");

    if (selectedSeatsCount && totalPrice) {
        selectedSeatsCount.textContent = selectedSeats.length;
        totalPrice.textContent = selectedSeats.length * TICKET_PRICE;
    }
}

// Переход на страницу оплаты
document.getElementById("ticket-form")?.addEventListener("submit", function(event) {
    event.preventDefault();
    const filmTitle = document.getElementById("film-select").value;
    if (selectedSeats.length === 0) {
        alert("Выберите хотя бы одно место!");
        return;
    }

    // Сохраняем данные о выбранных местах
    localStorage.setItem("selectedSeats", JSON.stringify(selectedSeats));
    localStorage.setItem("selectedFilm", filmTitle);

    // Переход на страницу оплаты
    window.location.href = "web3(3.1).html";
});

// Загрузка данных на странице оплаты
function loadPaymentDetails() {
    const orderDetails = document.getElementById("order-details");
    if (orderDetails) {
        const filmTitle = localStorage.getItem("selectedFilm");
        const seats = JSON.parse(localStorage.getItem("selectedSeats"));

        orderDetails.innerHTML = `
            <p>Фильм: ${filmTitle}</p>
            <p>Места: ${seats.join(", ")}</p>
            <p>Сумма: ${seats.length * 500} руб.</p> <!-- Пример цены билета -->
        `;
    }
}

// Обработка оплаты
document.getElementById("payment-form")?.addEventListener("submit", function(event) {
    event.preventDefault();
    const seats = JSON.parse(localStorage.getItem("selectedSeats"));
    seats.forEach(seat => {
        occupiedSeats[seat] = true; // Помечаем места как занятые
    });
    localStorage.setItem("occupiedSeats", JSON.stringify(occupiedSeats));
    alert("Оплата прошла успешно! Билеты забронированы.");
    window.location.href = "web3(1).html";
});

// Инициализация
window.onload = function() {
    loadFilms();
    loadFilmSelect();
    createSeatMap();
    loadPaymentDetails();
};