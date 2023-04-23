import { Server } from "socket.io";
import http from "http";
// import { criaTabuleiro } from "./factories/factory";
// import { Jogador } from "../model/Jogador";
// import Cor from "../enum/Cor";
// import { Jogo } from "./controller/Jogo";
const httpServer = http.createServer();
const server = new Server(httpServer);

const jogo = new Jogo();

let jogador1;
let jogador2;

const chatHistory = [{ user: "Lucas", message: "Olá, tudo bem?" }];

// quando um cliente conectar
server.on("connection", (socket) => {
  console.log("Cliente de id", socket.id, "se conectou ao jogo");
  let jogador;
  if (!jogador1) {
    jogador = jogador1 = new Jogador(socket.id, Cor.BRANCAS);
  } else {
    jogador = jogador2 = new Jogador(socket.id, Cor.PRETAS);
  }

  socket.on("chat", (message) => {
    chatHistory.push({ user: socket.id, message: message });
    socket.emit("atualizaChat", chatHistory);
  });

  socket.emit("atualizaTabuleiro", tabuleiro);

  socket.on("addPeca", (mensagem) => {
    jogo.addPeca(jogador, mensagem.peca);
    socket.emit("atualizaTabuleiro", tabuleiro);
  });

  socket.on("movePeca", (mensagem) => {
    const isTrilha = jogo.movePeca(jogador, mensagem.peca);
    if (isTrilha) {
      const pecasDisponiveisParaRemocao =
        jogo.retornaPecasDisponiveisParaRemocao(jogador);
      socket.emit("pontuacao", pecasDisponiveisParaRemocao);
      socket.on("removePeca", (mensagem) => {
        try {
          jogo.removePeca(jogador, mensagem.peca);
          socket.emit("atualizaTabuleiro", tabuleiro);
        } catch (error) {
          if (error === "FIM DE NOVO") {
            socket.emit("fimDeJogo", jogador);
          }
        }
      });
    }
    socket.emit("atualizaTabuleiro", tabuleiro);
  });
});

httpServer.listen(3000, () => {
  console.log("Server listening in port 3000");
});
