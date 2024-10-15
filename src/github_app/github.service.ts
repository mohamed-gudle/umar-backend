import { GITHUB_APP_ID, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_PRIVATE_KEY_PATH } from '@/common/config';
import githubModel from '@/github_app/github.model';
import { logger } from '@/utils/logger';
import { createAppAuth, GitHubAppUserAuthentication } from '@octokit/auth-app';
import { urlencoded } from 'express';
import fs from 'fs';

export default class GithubService {
  // public octokitApp: App = new App({
  //   appId: GITHUB_APP_ID,
  //   privateKey: fs.readFileSync(GITHUB_APP_PRIVATE_KEY_PATH, 'utf8'),
  //   webhooks: {
  //     secret: GITHUB_WEBHOOK_SECRET,
  //   },
  // });
  public github = githubModel;
  private auth = createAppAuth({
    appId: GITHUB_APP_ID,
    privateKey: fs.readFileSync(GITHUB_PRIVATE_KEY_PATH, 'utf8'),
    clientId: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
  });

  public async getUserToken(code: string): Promise<GitHubAppUserAuthentication> {
    const userAuthentication = await this.auth({ type: 'oauth-user', code: code });
    const stringifiedUserAuthentication = JSON.stringify(userAuthentication);
    logger.info(`userAuthentication: ${stringifiedUserAuthentication}`);
    const newGithubModel = await this.github.create({ 
      accessToken: userAuthentication.token,
      refreshToken: userAuthentication.refreshToken,
      scope: userAuthentication.scope,
      tokenType: userAuthentication.tokenType,
      accessTokenExpiresAt: userAuthentication.expiresAt,
      refreshTokenExpiresAt: userAuthentication.refreshTokenExpiresAt,
     });

    return userAuthentication;
  }

  public async getUserAccount(userID: string): Promise<any> {
    const userAccount = await this.github.findOne({ user: userID });
    return userAccount;
  }
}

