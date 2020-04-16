import { SocketServer } from './socket-server';
import { Routes } from './routes/routes';

const app = new SocketServer().getApp();
const route = new Routes(app);
route.getRoutes();

export { app };
