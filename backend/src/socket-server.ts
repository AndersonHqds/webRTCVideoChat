import express from 'express';
import { createServer, Server } from 'http';
import socketIo from 'socket.io';

export class SocketServer {
  public static readonly PORT: number = 5000;
  private app: express.Application;
  private port: string | number;
  private server: Server;
  private io: SocketIO.Server;
  private socketsArray = [];

  constructor() {
    this.createApp();
    this.config();
    this.createServer();
    this.sockets();
    this.listen();
  }

  private createApp(): void {
    this.app = express();
    this.app.use(express.static('public'));
  }

  private config(): void {
    this.port = process.env.PORT || SocketServer.PORT;
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log('Running server on port %s', this.port);
    });

    this.io.on('connection', (socket) => {
      console.log(socket.id);
      const { roomName, userName } = socket.handshake.query;
      socket.join(roomName);
      this.io.to(roomName).emit('add-users', {
        users: [{ id: socket.id, name: userName }],
      });

      socket.on('disconnect', () => {
        this.io.emit('remove-user', socket.id);
      });

      socket.on('make-offer', (data) => {
        console.log('MAKING OFFER', socket.id);
        socket.to(data.to).emit('offer-made', {
          offer: data.offer,
          socket: socket.id,
        });
      });

      socket.on('make-answer', (data) => {
        console.log('MAKING ANSWER', socket.id);
        socket.to(data.to).emit('answer-made', {
          socket: socket.id,
          answer: data.answer,
        });
      });
    });
  }

  private createServer(): void {
    this.server = createServer(this.app);
  }

  private sockets(): void {
    this.io = socketIo(this.server);
  }

  public getApp(): express.Application {
    return this.app;
  }
}
