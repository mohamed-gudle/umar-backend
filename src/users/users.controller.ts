import GithubService from '@/github_app/github.service';
import TrelloService from '@/trello_app/trello.service';
import { CreateUserDto } from '@/users/users.dto';
import { User } from '@/users/users.interface';
import userService from '@/users/users.service';
import { logger } from '@/utils/logger';
import { NextFunction, Request, Response } from 'express';

interface AuthenticatedRequest extends Request {
  auth?: {
    sub?: string;
    [key: string]: any; // Allow other properties in the auth object
  };
}

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
      const { sub } = req.auth;
      let repos = [];
      let boards = [];
      const githubToken = await this.githubService.getUserAccount(sub);
      const trelloToken = await this.trelloService.getUserAccount(sub);

      logger.info(`githubToken ${JSON.stringify(githubToken)}`);

      if (githubToken !== null) {
      repos = await this.githubService.getReposinInstallation(githubToken);
      }
      if (trelloToken !== null) {
      boards = await this.trelloService.getBoards(trelloToken);
      }

      logger.info(`githubToken ${githubToken}`);
      logger.info(`trelloToken ${trelloToken}`);



   
      res.status(200).json({ github: githubToken !== null, trello: trelloToken !==null ,repositories: repos, boards });
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
