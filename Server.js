const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Servir página simples
app.get("/", (req, res) => {
  res.send(`
    <html>
      <body>
        <h2>Chat WebSocket</h2>
        <input id="msg" placeholder="Escreva algo..." />
        <button onclick="sendMsg()">Enviar</button>
        <ul id="chat"></ul>
        <script>
          const ws = new WebSocket("ws://" + location.host);
          ws.onmessage = (msg) => {
            const li = document.createElement("li");
            li.innerText = msg.data;
            document.getElementById("chat").appendChild(li);
          };
          function sendMsg() {
            const text = document.getElementById("msg").value;
            ws.send(text);
            document.getElementById("msg").value = "";
          }
        </script>
      </body>
    </html>
  `);
});

// WebSocket
wss.on("connection", (ws) => {
  console.log("Novo cliente conectado");
  ws.on("message", (message) => {
    console.log(`Mensagem recebida: ${message}`);
    // Enviar para todos os clientes
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
