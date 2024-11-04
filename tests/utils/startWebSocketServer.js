/* eslint-disable */

const http = require("http");
const WebSocketServer = require("ws").WebSocketServer;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.write("Hello World!");
  res.end();
});

const wss = new WebSocketServer({ server });

wss.on("connection", function connection(ws) {
  ws.on("message", function message(data) {
    if (data.includes("MessagesChannel")) {
      // subscription response
      ws.send(
        JSON.stringify({
          identifier: '{"channel":"MessagesChannel"}',
          type: "confirm_subscription"
        })
      );

      // action complete response
      setTimeout(
        () =>
          ws.send(
            JSON.stringify({
              identifier: '{"channel":"MessagesChannel"}',
              message: {
                type: "new",
                message: {
                  subject: "This came from websockets",
                  videoList: [],
                  type: "Email",
                  content:
                    "This message was made in the customer portal and sent to the people portal",
                  isArchived: false,
                  isRead: false
                }
              }
            })
          ),
        1000
      );
    }
  });

  ws.send(
    JSON.stringify({
      type: "welcome",
      sid: "d7ac1194c7a6604a814fc0e3acc6acd5"
    })
  );
});

server.listen(3001);
