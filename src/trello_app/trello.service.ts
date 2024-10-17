import { TRELLO_API_KEY, TRELLO_OAUTH_SECRET, TRELLO_REDIRECT_URI } from '@/common/config';
import { logger } from '@/utils/logger';
import { OAuth } from 'oauth';
import requestTokenModel from './token.model';
import trelloModel from './trello.model';

class TrelloService {
  private oAuthRequestToken = requestTokenModel;
  private trello = trelloModel;

  private readonly expiration = 'never';
  private readonly scope = 'read,write,account';
  private readonly appName = 'Trello App';
  private readonly requestURL = 'https://trello.com/1/OAuthGetRequestToken';
  private readonly accessURL = 'https://trello.com/1/OAuthGetAccessToken';
  private readonly authorizeURL = 'https://trello.com/1/OAuthAuthorizeToken';
  private oauth = new OAuth(this.requestURL, this.accessURL, TRELLO_API_KEY, TRELLO_OAUTH_SECRET, '1.0A', TRELLO_REDIRECT_URI, 'HMAC-SHA1');

  public authorize = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      this.oauth.getOAuthRequestToken(async (error, token, tokenSecret) => {
        if (error) {
          logger.error(`Error: ${error}`);
          return reject(error);
        }
        await this.oAuthRequestToken.create({ requestToken: token, requestTokenSecret: tokenSecret });
        logger.info(`Token: ${token}`);
        resolve(`${this.authorizeURL}?oauth_token=${token}&name=${this.appName}&expiration=${this.expiration}&scope=${this.scope}`);
      });
    });
  };

  public getAccessToken = async (oauthToken: string, oauthVerifier: string, user : string): Promise<string> => {
    const { requestTokenSecret } = await this.oAuthRequestToken.findOne({ requestToken: oauthToken }).exec();

    logger.info(`oauthTokenSecret: ${requestTokenSecret}`);
    if (!requestTokenSecret) {
      throw new Error('Invalid OAuth Token');
    }

    return new Promise((resolve, reject) => {
      this.oauth.getOAuthAccessToken(oauthToken, requestTokenSecret, oauthVerifier, async (error, accessToken, accessTokenSecret, results) => {
        if (error) {
          logger.error(`Error: ${JSON.stringify(error)}`);
          return reject(error);
        }

        logger.info(`accessToken: ${accessToken}`);
        logger.info(`accessTokenSecret: ${accessTokenSecret}`);
        logger.info(`results: ${JSON.stringify(results)}`);

        await this.trello.create({ user, accessToken, accessTokenSecret });
        resolve(accessToken);
      });
    });
  };

  public getUserAccount = async (userID: string): Promise<any> => {
    const account = await this.trello.findOne({ user: userID }).exec();
    return account;
  };

  public getBoards = async (trelloAccount: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.oauth.get('https://api.trello.com/1/members/me/boards', trelloAccount.accessToken, trelloAccount.accessTokenSecret, (error, data) => {
        if (error) {
          logger.error(`Error: ${error}`);
          return reject(error);
        }
        resolve(JSON.parse(data as string));
      });
    });
  };

  public createList = async (trelloAccount: any, boardID: string, name: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        logger.info(`boardID: ${boardID}`);
        logger.info(`name: ${name}`);
        logger.info(`accessToken: ${trelloAccount.accessToken}`);
      this.oauth.post(`https://api.trello.com/1/lists?idBoard=${boardID}&name=${name}`, trelloAccount.accessToken, trelloAccount.accessTokenSecret, {}, 'Application/json', 
        (error, data: any) => {
        if (error) {
          logger.error(`Error: ${JSON.stringify(error)}`);
          return reject(error);
        }
        resolve(data);
      });
    });
  }


  public getLists = async (trelloAccount: any, boardID: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.oauth.get(`https://api.trello.com/1/boards/${boardID}/lists`, trelloAccount.accessToken, trelloAccount.accessTokenSecret, (error, data) => {
        if (error) {
          logger.error(`Error: ${error}`);
          return reject(error);
        }
        resolve(data);
      });
    });
  }

}

export default TrelloService;
