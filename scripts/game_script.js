// Comentários e documentação do arquivo `game_script.js`
// Este arquivo contém a lógica principal do jogo "Mata Mosquito".
// Variáveis globais usadas pelo jogo:

// Tempo (em segundos) entre reaparecimentos do mosquito.
let respawnTime = 0.0;

// Tamanho (em pixels) do mosquito dependendo da dificuldade.
let scaleMosquito = 0.0;

// Dificuldade selecionada (armazenada no localStorage pela tela anterior).
let difficulty = localStorage.getItem("difficulty");

// Referência para o container do jogo (div com id="tabuleiro").
let mapGame = document.getElementById("tabuleiro");

// Elemento que mostra o tempo restante no HUD.
let timer = document.getElementById("time");

// Estado se o mosquito foi clicado (splash) na rodada atual.
let splash = false;

// Pontos de vida do jogador (inteiro). Quando chega a 0, game over.
let lifePoints = 3;

// Referência para a div que exibirá a tela de game over / vitória.
let gameOverDiv = document.querySelector(".gameOverDiv");

// Referência para o container dos corações (HUD). Usado para atualizar ícones.
let heartDiv = document.getElementById("heartDiv");

// Referência ao elemento <img> do mosquito atualmente exibido.
let mosquito;

// Valor do temporizador da partida (em segundos). Definido por `gameDifficulty()`.
let timerValue;

// ========== FUNÇÃO: DEFINIR DIFICULDADE ==========S
// Define respawnTime e escala dependendo do nível escolhido
// Define as configurações do jogo conforme a dificuldade selecionada.
// - `respawnTime`: intervalo entre reaparecimentos do mosquito (s)
// - `scaleMosquito`: tamanho em pixels do <img>
// - `timerValue`: tempo total da partida (s)
function gameDifficulty(difficulty) {
  switch (difficulty) {
    case "easy":
      respawnTime = 1.5; // intervalo maior (mais fácil)
      scaleMosquito = 60; // largura/altura em px
      timerValue = 20; // partida curta
      break;
    case "medium":
      respawnTime = 1.0; // intervalo médio
      scaleMosquito = 55;
      timerValue = 40;
      break;
    case "hard":
      respawnTime = 0.5; // intervalo menor (mais rápido/difícil)
      scaleMosquito = 50;
      timerValue = 60; // partida mais longa
      break;
    default:
      // Valor padrão caso `difficulty` seja nulo ou desconhecido
      respawnTime = 1.0;
      scaleMosquito = 55;
      timerValue = 30;
  }
}

// Função chamada quando o jogador clica no mosquito.
// Marca `splash = true` para indicar que o mosquito foi atingido
// e remove o elemento do DOM imediatamente.
function mosquitoDie() {
  if (mosquito && mosquito.parentNode === mapGame) {
    mapGame.removeChild(mosquito);
  }
  splash = true;
}
// Cria um novo elemento <img> representando o mosquito e o insere
// como filho direto de `mapGame`. Calcula posições aleatórias
// garantindo que o mosquito fique dentro das bordas do container.
function createMosquito() {
  // Tamanho visual aproximado (em px) usado para evitar overflow.
  // Se a imagem original tiver tamanho diferente, ajuste aqui
  // ou use `mosquito.naturalWidth` após o carregamento.
  let mosquitoSize = scaleMosquito; // já em pixels (usamos width/height)

  // dimensões do container do jogo
  let mapWidith = mapGame.offsetWidth;
  let mapHeight = mapGame.offsetHeight;

  // calcula posição aleatória limitada pelas dimensões do container
  let posX = Math.floor(Math.random() * Math.max(0, mapWidith - mosquitoSize));
  let posY = Math.floor(Math.random() * Math.max(0, mapHeight - mosquitoSize));

  // cria o elemento e aplica propriedades
  mosquito = document.createElement("img");
  mosquito.src = "./img/mosca.png";
  mosquito.classList.add("mosquito");
  mosquito.style.left = posX + "px";
  mosquito.style.top = posY + "px";
  // onclick usa a função global `mosquitoDie` definida acima
  mosquito.setAttribute("onclick", "mosquitoDie()");
  mosquito.width = scaleMosquito;
  mosquito.height = scaleMosquito;

  // adiciona ao container por último (para não interferir com cálculos)
  mapGame.appendChild(mosquito);
}

// ========== FUNÇÃO: INICIAR LÓGICA DO JOGO ==========
// Essa função executa quando o jogo começar (na página gamepage.html)
// Inicializa a lógica do jogo: cria o primeiro mosquito e inicia o timer
// principal que controla spawn, dano por não clicar e fim de jogo.
function onGameStart() {
  // cria um mosquito imediatamente para o jogador interagir
  createMosquito();

  // guarda o id do intervalo para permitir `clearInterval` posteriormente
  let intervalId = setInterval(() => {
    // Se existir um mosquito exibido, remova-o antes de criar o próximo.
    // Isso também representa o fim da "rodada" anterior.
    if (mosquito && mosquito.parentNode === mapGame) {
      mapGame.removeChild(mosquito);

      // Se o jogador NÃO clicou (splash false), aplica dano.
      if (!splash) {
        lifePoints -= 1;
        // Atualiza ícones de coração (assume 3 corações em `heartDiv`)
        if (heartDiv) {
          if (lifePoints === 2) heartDiv.children[2].src = "./img/coracao_vazio.png";
          else if (lifePoints === 1) heartDiv.children[1].src = "./img/coracao_vazio.png";
          else if (lifePoints === 0) heartDiv.children[0].src = "./img/coracao_vazio.png";
        }
      }
    }

    // reseta o estado de clique para a próxima rodada
    splash = false;

    // Se vidas acabaram, encerra o intervalo e mostra a tela de game over
    if (lifePoints <= 0) {
      clearInterval(intervalId);
      if (gameOverDiv) {
        gameOverDiv.style.display = "flex";
        const gameOverScreen = document.createElement("img");
        gameOverScreen.src = "./img/game_over.png";
        gameOverScreen.alt = "Game Over";
        gameOverScreen.classList.add("game-over-screen");
        gameOverDiv.appendChild(gameOverScreen);
        const homeButton = document.createElement("button");
        homeButton.textContent = "Voltar para o Menu";
        homeButton.classList.add("home-button");
        gameOverDiv.appendChild(homeButton);
        homeButton.addEventListener("click", () => { window.location.href = 'index.html'; });
      }
      return;
    }

    // Atualiza e exibe o cronômetro da partida
    if (typeof timerValue === 'number') {
      timerValue--;
      if (timer) timer.textContent = timerValue;
      if (timerValue <= 0) {
        clearInterval(intervalId);
        if (gameOverDiv) {
          gameOverDiv.style.display = "flex";
          const victoryScreen = document.createElement("img");
          victoryScreen.src = "./img/vitoria.png";
          victoryScreen.alt = "Vitória";
          victoryScreen.classList.add("game-over-screen");
          gameOverDiv.appendChild(victoryScreen);
          const homeButton = document.createElement("button");
          homeButton.textContent = "Voltar para o Menu";
          homeButton.classList.add("home-button");
          gameOverDiv.appendChild(homeButton);
          homeButton.addEventListener("click", () => { window.location.href = 'index.html'; });
        }
        return;
      }
    }

    // cria o próximo mosquito (nova rodada)
    createMosquito();
  }, respawnTime * 1000);
}
// inicialização
console.log(difficulty);
gameDifficulty(difficulty);
onGameStart();
