import { Routes } from "@/common/interfaces/routes.interface";
import { Router } from "express";
import TrelloController from "./trello.controller";

class TrelloRoutes implements Routes {
  public path = "/trello";
  public router: Router = Router();
  public trelloController = new TrelloController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/authorize`, this.trelloController.authorize);
    this.router.get(`${this.path}/user-token`, this.trelloController.getAccessToken);
    this.router.get(`${this.path}/boards`, this.trelloController.getBoards);
    this.router.post(`${this.path}/create-list`, this.trelloController.createList);
  }
}

export default TrelloRoutes;