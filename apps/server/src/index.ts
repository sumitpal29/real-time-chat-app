import http from "http";
import SocketServer from "./services/socket";

async function init() {
  const socketService = new SocketServer();
  const httpServer = http.createServer();
  const port = process.env.PORT || 8000;

  socketService.io.attach(httpServer);

  httpServer.listen(port, () => {
    console.log(`HTTP server listening on port ${port}`);
  });

  socketService.initListener();
}

init();
