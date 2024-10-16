import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@/users/users.dto';
import { User } from '@/users/users.interface';
import userService from '@/users/users.service';
import { logger } from '@/utils/logger';
import GithubService from '@/github_app/github.service';
import { Octokit } from '@octokit/rest';
import TrelloService from '@/trello_app/trello.service';

class UsersController {
  public userService = new userService();
  public githubService = new GithubService();
  public trelloService = new TrelloService();

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: User[] = await this.userService.findAllUser();

      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getSelf = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const userId: string = req.user._id;
      const findOneUserData: User = await this.userService.findUserById('670e8377312736a7b3cca866');
      const githubToken = await this.githubService.getUserAccount('670e8377312736a7b3cca866');
      const trelloToken = await this.trelloService.getUserAccount('670e8377312736a7b3cca866');

      const repos = await this.githubService.getReposinInstallation(githubToken);

      logger.info(`githubToken ${githubToken}`);
      logger.info(`trelloToken ${trelloToken}`);

     // const response = await octokit.apps.listInstallationsForAuthenticatedUser();

    //  const response = await octokit.apps.listInstallationReposForAuthenticatedUser({
    //   installation_id: 55965694,
    // });
    // await octokit.issues.create({
    //   owner: 'mohamed-gudle',
    //   repo: 'portfolio-website',
    //   title: 'My first issue',
    //   body: 'I opened this issue because...',
    // });

   
      res.status(200).json({ ...findOneUserData, github: githubToken !== null, trello: trelloToken !==null ,repositories: repos });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const findOneUserData: User = await this.userService.findUserById(userId);

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const createUserData: User = await this.userService.createUser(userData);

      res.status(201).json({ data: createUserData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const userData: CreateUserDto = req.body;
      const updateUserData: User = await this.userService.updateUser(userId, userData);

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const deleteUserData: User = await this.userService.deleteUser(userId);

      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public getGithubUserToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const code: string = req.body.code as string;
      const response = await this.userService.getGithubUserToken(code);

      logger.info(` response ${response}`);
      res.status(200).json({ data: response, message: 'getGithubUserToken' });
    } catch (error) {
      console.log(error);
      logger.error(error);
      next(error);
    }
  };
}

export default UsersController;
