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
}

export default GithubController;