document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const overlay = document.querySelector('.overlay');
        overlay.classList.add('hidden');
    }, 2000); 
});

document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

var topBtn = document.getElementById("topBtn");

window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        topBtn.style.display = "block";
    } else {
        topBtn.style.display = "none";
    }
}

function scrollToTop() {
    document.documentElement.scrollTop = 0;
}

// window.addEventListener('DOMContentLoaded', (event) => {
//     // Проверяем, авторизован ли пользователь
//     if (sessionStorage.getItem('userLoggedIn') !== 'true') {
//       // Если не авторизован, перенаправляем на страницу авторизации
//       window.location.href = '/authorization.html';
//     }
//   });