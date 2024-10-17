import { NextFunction, Request, Response } from "express";
import TrelloService from "./trello.service";

class TrelloController {
    private trelloService = new TrelloService();
    public authorize = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await this.trelloService.authorize();

            res.status(200).json({ data: { redirectURL: response} });
        } catch (error) {
            next(error);
        }
    }

    public getAccessToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { sub } = req.auth;
            const { oauth_token, oauth_verifier } = req.query;
            const response = await this.trelloService.getAccessToken(oauth_token as string, oauth_verifier as string, sub as string);

            res.status(200).json({ message:'success' });
        } catch (error) {
            next(error);
        }
    }

    public getBoards = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { sub } = req.auth;
            const trelloAccount = await this.trelloService.getUserAccount(sub);
            const response = await this.trelloService.getBoards(trelloAccount);

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    public createList = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { sub } = req.auth;
            const { board, listName } = req.body;
            const trelloAccount = await this.trelloService.getUserAccount(sub);
            const response = await this.trelloService.createList(trelloAccount, board, listName);
            
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

}


export default TrelloController;