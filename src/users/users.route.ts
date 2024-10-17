import { Router } from 'express';
import UsersController from '@/users/users.controller';
import { CreateUserDto } from '@/users/users.dto';
import { Routes } from '@/common/interfaces/routes.interface';
import validationMiddleware from '@/common/middlewares/validation.middleware';
import { checkJwt } from '@/common/middlewares/auth.middleware';

class UsersRoute implements Routes {
  public path = '/users';
  public router: Router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/github/user-token`, this.usersController.getGithubUserToken);
    this.router.get(`${this.path}/self`,checkJwt, this.usersController.getSelf)


    // this.router.post(`${this.path}`, validationMiddleware(CreateUserDto, 'body'), this.usersController.createUser);
    // this.router.put(`${this.path}/:id`, validationMiddleware(CreateUserDto, 'body', true), this.usersController.updateUser);
  }
}

export default UsersRoute;
