.index.js
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

const SESSION_FILE_PATH = './session.json';
let sessionData;

// Verificar se já existe uma sessão salva
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH);
}

// Crie um cliente do WhatsApp
const client = new Client({
  session: sessionData, // Usaremos a sessão salva, se houver
});

// Exibir o código QR no terminal para autenticação
client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

// Quando o cliente for autenticado, salve a sessão em um arquivo para reutilização futura
client.on('authenticated', (session) => {
  console.log('Autenticado!');
  sessionData = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
    if (err) {
      console.error('Erro ao salvar a sessão:', err);
    }
  });
});

// Lidar com as mensagens recebidas
client.on('message', async (msg) => {
  // Verificar o conteúdo da mensagem
  if (msg.body.toLowerCase().includes('oi')) {
    // Responder com uma mensagem pré-definida
    const resposta = 'Olá! Como posso ajudar?';
    msg.reply(resposta);
  } else if (msg.body.toLowerCase().includes('qual é a sua cor favorita?')) {
    // Responder com outra mensagem pré-definida
    const resposta = 'Minha cor favorita é azul.';
    msg.reply(resposta);
  } else {
    // Responder com uma mensagem padrão se a pergunta não for reconhecida
    const resposta = 'Desculpe, não entendi sua pergunta.';
    msg.reply(resposta);
  }
});

// Inicializar o cliente
client.initialize();
