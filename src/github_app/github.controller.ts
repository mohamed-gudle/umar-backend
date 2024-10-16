import { NextFunction, Request, Response } from "express";
import GithubService from "@/github_app/github.service";
import { logger } from "@/utils/logger";

class GithubController {
    public githubService = new GithubService();

  public getGithubUserToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = req.query;
      const response = await this.githubService.getUserToken(code as string);
      logger.info(`getGithubUserToken: ${response.tokenType}`);
      res.status(200).json({ data: response });
    } catch (error) {
      next(error);
    }
  };

  public createIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { repository, title, body } = req.body;
      const githubAccount = await this.githubService.getUserAccount('670e8377312736a7b3cca866');
      const response = await this.githubService.createIssue(githubAccount, repository, title, body);
      res.status(200).json({ data: response });
    } catch (error) {
      next(error);
    }
  }
}

export default GithubController;