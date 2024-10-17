import { Routes } from '@/common/interfaces/routes.interface';
import { Router } from 'express';
import GithubController from '@/github_app/github.controller';
import { checkJwt } from '@/common/middlewares/auth.middleware';

class GithubRoute implements Routes {
  public path = '/github';
  public router: Router = Router();
  public githubController = new GithubController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/user-token`,checkJwt, this.githubController.getGithubUserToken);
    this.router.post(`${this.path}/create-issue`, checkJwt,this.githubController.createIssue);

  }
}

export default GithubRoute;
