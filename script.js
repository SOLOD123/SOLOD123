// Инициализация
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let img = new Image();
let overlayImg = new Image();
let overlayX = 0;
let overlayY = 0;
let overlayScale = 1;

// Функция для загрузки основного изображения на канвас
function loadImage(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        img.src = event.target.result;
        img.onload = function() {
            canvas.width = img.width; // Устанавливаем ширину канваса равной ширине изображения
            canvas.height = img.height; // Устанавливаем высоту канваса равной высоте изображения
            ctx.drawImage(img, 0, 0); // Рисуем основное изображение
        };
    };
    reader.readAsDataURL(file);
}

// Функция для загрузки накладки
function loadOverlay(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        overlayImg.src = event.target.result;
        overlayImg.onload = function() {
            drawCanvas(); // После загрузки накладки перерисовываем канвас
        };
    };
    reader.readAsDataURL(file);
}

// Функция для отрисовки изображения и накладки
function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // очищаем канвас
    ctx.drawImage(img, 0, 0); // рисуем основное изображение
    ctx.drawImage(overlayImg, overlayX, overlayY, overlayImg.width * overlayScale, overlayImg.height * overlayScale); // рисуем накладку
}

// Обработчик загрузки изображения
document.getElementById('upload').addEventListener('change', function(e) {
    loadImage(e.target.files[0]);
});

// Обработчик кнопки "Генерировать"
document.getElementById('generate').addEventListener('click', function() {
    // Генерация случайной накладки из списка
    const overlayImages = ['images/overlay1.png', 'images/overlay2.png', 'images/overlay3.png'];
    const randomOverlay = overlayImages[Math.floor(Math.random() * overlayImages.length)];
    
    overlayImg.src = randomOverlay;
    overlayImg.onload = function() {
        drawCanvas(); // После загрузки накладки перерисовываем канвас
    };
});

// Обработчик кнопки "Скачать"
document.getElementById('download').addEventListener('click', function() {
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'pfp.png';
    link.click();
});

// Перемещение накладки
let isDragging = false;
let startX = 0;
let startY = 0;

canvas.addEventListener('mousedown', function(e) {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    if (mouseX >= overlayX && mouseX <= overlayX + overlayImg.width * overlayScale &&
        mouseY >= overlayY && mouseY <= overlayY + overlayImg.height * overlayScale) {
        isDragging = true;
        startX = mouseX - overlayX;
        startY = mouseY - overlayY;
    }
});

canvas.addEventListener('mousemove', function(e) {
    if (isDragging) {
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;
        // Используем requestAnimationFrame для плавности перемещения
        requestAnimationFrame(function() {
            overlayX = mouseX - startX;
            overlayY = mouseY - startY;
            drawCanvas();
        });
    }
});

canvas.addEventListener('mouseup', function() {
    isDragging = false;
});

canvas.addEventListener('mouseleave', function() {
    isDragging = false;
});

// Масштабирование накладки
canvas.addEventListener('wheel', function(e) {
    e.preventDefault();
    if (e.deltaY > 0) {
        overlayScale *= 0.9; // Уменьшаем накладку
    } else {
        overlayScale *= 1.1; // Увеличиваем накладку
    }
    drawCanvas();
});
