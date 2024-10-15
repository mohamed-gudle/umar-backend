import { Routes } from '@/common/interfaces/routes.interface';
import { Router } from 'express';
import GithubController from '@/github_app/github.controller';

class GithubRoute implements Routes {
  public path = '/github';
  public router: Router = Router();
  public githubController = new GithubController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/user-token`, this.githubController.getGithubUserToken);

  }
}

export default GithubRoute;
