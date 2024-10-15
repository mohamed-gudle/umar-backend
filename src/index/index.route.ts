import { Router } from 'express';
import IndexController from '@/index/index.controller';
import { Routes } from '@/common/interfaces/routes.interface';

class IndexRoute implements Routes {
  public path = '/';
  public router: Router = Router();
  public indexController = new IndexController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.indexController.index);
  }
}

export default IndexRoute;
