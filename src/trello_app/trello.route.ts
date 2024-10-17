import { Routes } from "@/common/interfaces/routes.interface";
import { Router } from "express";
import TrelloController from "./trello.controller";
import { checkJwt } from "@/common/middlewares/auth.middleware";

class TrelloRoutes implements Routes {
  public path = "/trello";
  public router: Router = Router();
  public trelloController = new TrelloController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/authorize`,checkJwt, this.trelloController.authorize);
    this.router.get(`${this.path}/user-token`,checkJwt, this.trelloController.getAccessToken);
    this.router.get(`${this.path}/boards`,checkJwt, this.trelloController.getBoards);
    this.router.post(`${this.path}/create-list`,checkJwt, this.trelloController.createList);
  }
}

export default TrelloRoutes;