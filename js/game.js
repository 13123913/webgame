var canvas = document.getElementById("game");
var context = canvas.getContext("2d");

var selectedShip = localStorage.getItem("ship");
function SH(number) {
  number == 1
    ? localStorage.setItem("ship", 1)
    : localStorage.setItem("ship", 2);
}

shipimg = new Image();
shipimg.src = selectedShip == 1 ? "ship01.png" : "ship02.png";

var i, ship, Timer;
var aster = [];
var fire = [];
var expl = [];
//загрузка ресурсов
asterimg = new Image();
asterimg.src = "astero.png";

shieldimg = new Image();
shieldimg.src = "shield.png";

fireimg = new Image();
fireimg.src = "fire.png";

explimg = new Image();
explimg.src = "expl222.png";

fon = new Image();
fon.src = "Back_galaxy_1.jpg";

//старт игры
fon.onload = function () {
  init();
  game();
  console.log(selectedShip);
};

// Функция для увеличения счета каждую секунду
let score = 0; // Переменная для хранения счета
let scoreTimer = 0; // Таймер для отсчета времени для начисления очков

// Функция для обновления счета
function updateScore() {
  scoreTimer++;

  if (scoreTimer % 60 === 0) {
    score += 3; // Начисление 3 очков
  }
}

//совместимость с браузерами
var requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 20);
    }
  );
})();

//начальные установки
function init() {
  canvas.addEventListener("mousemove", function (event) {
    var rect = canvas.getBoundingClientRect(),
      root = document.documentElement;

    var mouseX = event.clientX - rect.left - root.scrollLeft;
    var mouseY = event.clientY - rect.top - root.scrollTop;

    var width_canvas = document.getElementById("game").offsetWidth;
    var height_canvas = document.getElementById("game").offsetHeight;

    ship.x = (mouseX * 600) / width_canvas - 25;
    ship.y = (mouseY * 600) / height_canvas - 13;
  });

  Timer = 0;
  ship = { x: 300, y: 300, animx: 0, animy: 0 };
}

//основной игровой цикл
function game() {
  update();
  updateScore(); // Вызывается функция обновления счета
  render();

  checkCollisions();

  requestAnimFrame(game);
}


let lives = 3;

//функция обновления состояния игры
function checkCollisions() {
  for (let i = 0; i < aster.length; i++) {
    if (
      Math.abs(aster[i].x - ship.x) < 50 &&
      Math.abs(aster[i].y - ship.y) < 50
    ) {
      // Столкновение игрока с астероидом
      endGame();
    }
  }
}

function endGame() {
    // Отображение окна с итоговым количеством очков
    alert("Игра окончена! Ваш финальный счет: " + score + " очков.");
    // Перенаправление на главную страницу с передачей финального счета через параметр URL
    window.location.href = "score.html?score=" + score;
}
	

function drawScore() {
  context.fillStyle = "white";
  context.font = "24px Arial";
  context.fillText("Score: " + score, 10, 30); // Отображение счета в левом верхнем углу
}


function update() {
  Timer++;

  checkCollisions();


  //спавн астероидов
  if (Timer % 50 == 0) {
    aster.push({
      angle: 0,
      dxangle: Math.random() * 0.2 - 0.1,
      del: 0,
      x: Math.random() * 550,
      y: -50,
      dx: Math.random() * 2 - 1,
      dy: Math.random() * 2 + 1,
    });
  }
  //выстрел
  if (Timer % 30 == 0) {
    fire.push({ x: ship.x + 10, y: ship.y, dx: 0, dy: -5.2 });
    fire.push({ x: ship.x + 10, y: ship.y, dx: 0.5, dy: -5 });
    fire.push({ x: ship.x + 10, y: ship.y, dx: -0.5, dy: -5 });
  }

  //движение астероидов
  for (i in aster) {
    aster[i].x = aster[i].x + aster[i].dx;
    aster[i].y = aster[i].y + aster[i].dy;
    aster[i].angle = aster[i].angle + aster[i].dxangle;

    //граничные условия (коллайдер со стенками)
    if (aster[i].x <= 0 || aster[i].x >= 550) aster[i].dx = -aster[i].dx;
    if (aster[i].y >= 650) aster.splice(i, 1);

    //проверим каждый астероид на столкновение с каждой пулей
    for (j in fire) {
      if (
        Math.abs(aster[i].x + 25 - fire[j].x - 15) < 50 &&
        Math.abs(aster[i].y - fire[j].y) < 25
      ) {
        //произошло столкновение

        //спавн взрыва
        expl.push({
          x: aster[i].x - 25,
          y: aster[i].y - 25,
          animx: 0,
          animy: 0,
        });

        //помечаем астероид на удаление
        aster[i].del = 1;
        fire.splice(j, 1);
        break;
      }
    }
    //удаляем астероиды
    if (aster[i].del == 1) aster.splice(i, 1);
  }

  //двигаем пули
  for (i in fire) {
    fire[i].x = fire[i].x + fire[i].dx;
    fire[i].y = fire[i].y + fire[i].dy;

    if (fire[i].y < -30) fire.splice(i, 1);
  }

  //Анимация взрывов
  for (i in expl) {
    expl[i].animx = expl[i].animx + 0.5;
    if (expl[i].animx > 7) {
      expl[i].animy++;
      expl[i].animx = 0;
    }
    if (expl[i].animy > 7) expl.splice(i, 1);
  }

  //анимация щита
  ship.animx = ship.animx + 1;
  if (ship.animx > 4) {
    ship.animy++;
    ship.animx = 0;
  }
  if (ship.animy > 3) {
    ship.animx = 0;
    ship.animy = 0;
  }
}

function render() {
  //очистка холста (не обязательно)
  context.clearRect(0, 0, 600, 600);
  //рисуем фон
  context.drawImage(fon, 0, 0, 600, 600);
  //рисуем пули
  for (i in fire) context.drawImage(fireimg, fire[i].x, fire[i].y, 30, 30);
  //рисуем корабль
  context.drawImage(shipimg, ship.x, ship.y);
  //рисуем щит
  context.drawImage(
    shieldimg,
    192 * Math.floor(ship.animx),
    192 * Math.floor(ship.animy),
    192,
    192,
    ship.x - 25,
    ship.y - 25,
    100,
    100
  );
  //рисуем астероиды
  for (i in aster) {
    //context.drawImage(asterimg, aster[i].x, aster[i].y, 50, 50);
    //вращение астероидов
    context.save();
    context.translate(aster[i].x + 25, aster[i].y + 25);
    context.rotate(aster[i].angle);
    context.drawImage(asterimg, -25, -25, 50, 50);
    context.restore();
    // Отображение счётчика очков
    context.fillStyle = "#ffffff"; // Установка цвета текста
    context.font = "20px Elephant"; // Установка шрифта и размера
    context.fillText("Score: " + score, 10, canvas.height - 525); // Отображение текста счётчика очков внизу холста
    //context.beginPath();
    //context.lineWidth="2";
    //context.strokeStyle="green";
    //context.rect(aster[i].x, aster[i].y, 50, 50);
    //context.stroke();
  }
  //рисуем взрывы
  for (i in expl)
    context.drawImage(
      explimg,
      128 * Math.floor(expl[i].animx),
      128 * Math.floor(expl[i].animy),
      128,
      128,
      expl[i].x,
      expl[i].y,
      100,
      100
    );
}
