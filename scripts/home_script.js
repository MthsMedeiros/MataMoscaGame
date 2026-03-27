// ========== SELEÇÃO DOS ELEMENTOS DO DOM ==========
// Pega o elemento do select (dropdown de dificuldade)
let selectDificulty = document.getElementById("selectDificulty");

// Pega o botão de iniciar jogo
let startButton = document.getElementById("startButton");

// Pega a imagem do mosquito

// ========== VARIÁVEIS GLOBAIS ==========
// Armazena a dificuldade escolhida (easy/medium/hard)
let difficulty = "";

// ========== FUNÇÃO: INICIAR JOGO ==========
// Cette fonction est appelée quand l'utilisateur clique sur le bouton "Démarrer"
function startGame() {
  difficulty = selectDificulty.value;
  localStorage.setItem("difficulty", difficulty);
 

  // Se uma dificuldade foi escolhida, redireciona para a página do jogo
  if (difficulty != "") {
    window.location.href = "/gamepage.html";
  }
}
