import { Server } from "socket.io";
import Redis from "ioredis";

const cred = {
  username: process.env.username,
  password: process.env.password,
  host: process.env.host,
  port: process.env.port,
};

const publisher = new Redis(cred);
const subscriber = new Redis(cred);

class SocketService {
  private _io: Server;

  constructor() {
    console.log("SocketService Initialised");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
    subscriber.subscribe("MESSAGES");
  }

  get io() {
    return this._io;
  }

  public initListener() {
    const io = this.io;
    console.log("Initializing Socket Listeners");
    io.on("connect", (socket) => {
      console.log("New Socket connected", socket.id);
      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New Message received", message);
        // make the msg available to all clients/listeners through Redis
        publisher.publish("MESSAGES", JSON.stringify({ message }));
      });
    });
    subscriber.on("message", (channel, msg) => {
      if (channel === "MESSAGES") {
        io.emit("message", msg);
      }
    });
  }
}

export default SocketService;
