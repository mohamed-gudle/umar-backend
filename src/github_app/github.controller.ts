import { NextFunction, Request, Response } from "express";
import GithubService from "@/github_app/github.service";
import { logger } from "@/utils/logger";

class GithubController {
    public githubService = new GithubService();

  public getGithubUserToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = req.query;
      const { sub } = req.auth;
      const response = await this.githubService.getUserToken(code as string, sub);
      logger.info(`getGithubUserToken: ${response.tokenType}`);
      res.status(200).json({ data: response });
    } catch (error) {
      next(error);
    }
  };

  public createIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sub } = req.auth;
      const { repository, title, body } = req.body;
      const githubAccount = await this.githubService.getUserAccount(sub);
      const response = await this.githubService.createIssue(githubAccount, repository, title, body);
      res.status(200).json({ data: response });
    } catch (error) {
      next(error);
    }
  }
}

export default GithubController;