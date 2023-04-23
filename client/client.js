import readline from 'readline';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3000', { reconnect: true });

const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  removeHistoryDuplicates: true,
});
const getInteration = async (info) => {
  return new Promise((resolve, reject) => {
    readlineInterface.question(info, (input) => resolve(input));
  });
};

socket.on('connect', async () => {
  console.log('Conectado ao servidor com o id', socket.id);
  socket.on('start-game', (message) => {
    console.log('Você deve iniciar a partida');
  });

  socket.on('update-board', (mensagem) => {
    // console.log("udpate", mensagem);
  });

  socket.on('player-start-turn', (mensagem) => {
    console.log(mensagem);
  });

  socket.on('player-add-piece', async () => {
    console.log('Aguardando sua jogada\n');
    const mensagem = await getInteration('Escolha a peça a ser adicionada\n');
    console.log('mensagem\n', mensagem);
    if (mensagem === 'desisto') {
      socket.emit(
        'player-add-piece',
        JSON.stringify({ peca: 1, giveUp: true })
      );
    } else {
      socket.emit(
        'player-add-piece',
        JSON.stringify({ peca: Number(mensagem), giveUp: false })
      );
    }
  });

  socket.on('player-remove-piece', async () => {
    console.log('Aguardando sua jogada');
    const mensagem = await getInteration('Escolha a peça para remover');
    socket.emit(
      'player-remove-piece',
      JSON.stringify({ peca: Number(mensagem), giveUp: false })
    );
  });

  socket.on('player-move-piece', async () => {
    console.log('Aguardando sua jogada');
    const mensagem = await getInteration('Escolha a peça a ser movida');
    socket.emit('player-move-piece', mensagem);

    socket.off('player-move-piece');
    socket.on('player-move-piece', async (msg) => {
      console.log('Msg', msg);

      console.log('Aguardando sua jogada');
      const mensagem = await getInteration('Escolha a peça a ser movida');
      socket.emit('player-move-piece', mensagem);
    });
  });

  socket.on('game-over', (mensagem) => {
    console.log('fim de jogo: ', mensagem);
  });
});
