import express from 'express';
import path from 'path';

export class Routes {
  private app: express.Application;

  constructor(app: express.Application) {
    this.app = app;
    this.setStaticDir();
  }

  private home(): void {
    this.app.get('/', (request, response) => {
      response.sendFile('index.html');
    });
  }

  private setStaticDir(): void {
    this.app.use(express.static(path.join(__dirname, '../views')));
  }

  public getRoutes(): void {
    this.home();
  }
}
