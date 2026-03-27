//let getMosquito = document.getElementById("mosquito");

// Tempo (em segundos) para o mosquito reaparècer
let respawnTime = 0.0;

// Tamanho (escala) do mosquito dependendo da dificuldade
let scaleMosquito = 0.0;

let difficulty = localStorage.getItem("difficulty");

let mapGame = document.getElementById("tabuleiro");

let timer = document.getElementById("time");
let splash = false;
let lifePoints = 3;
let gameOverDiv = document.querySelector(".gameOverDiv");
let mosquito;
let timerValue;

// ========== FUNÇÃO: DEFINIR DIFICULDADE ==========S
// Define respawnTime e escala dependendo do nível escolhido
function gameDifficulty(difficulty) {
  switch (difficulty) {
    case "easy":
      respawnTime = 1.5; // Mosquito aparece a cada 1.5 segundos
      scaleMosquito = 60;
      timerValue = 20; // Mosquito é grande (fácil de clicar)

      break;
    case "medium":
      respawnTime = 1; // Mosquito aparece a cada 1 segundo
      scaleMosquito = 55; // Mosquito é médio
      timerValue = 40;
      break;
    case "hard":
      respawnTime = 0.5; // Mosquito aparece a cada 0.5 segundos
      scaleMosquito = 50; // Mosquito é pequeno (difícil de clicar)
      timerValue = 60;
      break;
      
  }
}

function mosquitoDie() {
  mapGame.removeChild(mosquito);
  splash = true;
}
function createMosquito() {
  let mosquitoSize = 100 * 0.5;
  let mapWidith = mapGame.offsetWidth;
  let mapHeight = mapGame.offsetHeight;
  let posX = Math.floor(Math.random() * (mapWidith - mosquitoSize));
  let posY = Math.floor(Math.random() * (mapHeight - mosquitoSize));
  mosquito = document.createElement("img");
  mapGame.appendChild(mosquito);
  mosquito.src = "./img/mosca.png";
  mosquito.classList.add("mosquito");
  mosquito.style.left = posX + "px";
  mosquito.style.top = posY + "px";
  mosquito.setAttribute("onclick", "mosquitoDie()");
  mosquito.width = scaleMosquito;
  mosquito.height = scaleMosquito;
}

// ========== FUNÇÃO: INICIAR LÓGICA DO JOGO ==========
// Essa função executa quando o jogo começar (na página gamepage.html)
function onGameStart() {
  // Adiciona a classe de escala ao mosquito dependendo da dificuldade

  createMosquito();

  // Tamanho visual do mosquito após o scale (a imagem original é ~100px, scale 0.5 = 50px)

  // Define um intervalo para o mosquito reaparecer dependendo do respawnTime
  let intervalId = setInterval(() => {
    if (mosquito && mosquito.parentNode) {
      mapGame.removeChild(mosquito);
      if (!splash) {
        lifePoints -= 1;
        if (lifePoints === 2) {
          heartDiv.children[2].src = "./img/coracao_vazio.png";
        } else if (lifePoints === 1) {
          heartDiv.children[1].src = "./img/coracao_vazio.png";
        } else if (lifePoints === 0) {
          heartDiv.children[0].src = "./img/coracao_vazio.png";
        }
      }
    }

    splash = false;

    if (lifePoints <= 0) {
      clearInterval(intervalId);

      let gameOverScreen = document.createElement("img");
      gameOverScreen.src = "./img/game_over.png";
      gameOverScreen.alt = "Game Over";
      gameOverScreen.classList.add("game-over-screen");
      gameOverDiv.appendChild(gameOverScreen);
      let homeButton = document.createElement("button");
      homeButton.textContent = "Voltar para o Menu";
      homeButton.classList.add("home-button");
      gameOverDiv.appendChild(homeButton);
      homeButton.setAttribute(
        "onclick",
        "window.location.href = 'index.html';",
      );
    }

    timerValue--;
    timer.textContent = timerValue;
    if (timerValue <= 0) {
      clearInterval(intervalId);
      let gameOverScreen = document.createElement("img");
      gameOverScreen.src = "./img/vitoria.png";
      gameOverScreen.alt = "Vitória";
      gameOverScreen.classList.add("game-over-screen");
      gameOverDiv.appendChild(gameOverScreen);
      let homeButton = document.createElement("button");
      homeButton.textContent = "Voltar para o Menu";
      homeButton.classList.add("home-button");
      gameOverDiv.appendChild(homeButton);
      homeButton.setAttribute(
        "onclick",
        "window.location.href = 'index.html';",
      );
    }


    createMosquito();
    splash = false;
    console.log(splash);
  }, respawnTime * 1000);
}
console.log(difficulty);
gameDifficulty(difficulty);
onGameStart();
