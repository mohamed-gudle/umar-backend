import { GITHUB_APP_ID, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_PRIVATE_KEY_PATH } from '@/common/config';
import githubModel from '@/github_app/github.model';
import { logger } from '@/utils/logger';
import { createAppAuth, GitHubAppUserAuthentication } from '@octokit/auth-app';
import { Octokit } from '@octokit/rest';
import { refreshToken } from "@octokit/oauth-methods"
import fs from 'fs';
import { Github } from './github.interface';
import { log } from 'console';

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
    const userAccount = await this.github.findOne({ user: userID }).exec();
    return userAccount;
  }

  public async getReposinInstallation(githubAccount: Github): Promise<any> {
    logger.info(`getReposinInstallation: ${githubAccount.accessToken}`);

    
    const octokit = new Octokit({
      auth: githubAccount.accessToken,
    });
    const repos = await octokit.apps.listInstallationReposForAuthenticatedUser({
      installation_id: githubAccount.installation,
    });
    return repos.data.repositories;
  }

  public async createIssue(githubAccount: Github, repo: string, title: string, body: string): Promise<any> {
    const octokit = new Octokit({
      auth: githubAccount.accessToken,
    });

    const issue = await octokit.issues.create({
      owner:githubAccount.owner,
      repo:'portfolio-website',
      title,
      body,
    });
    return issue
  }

  public async refreshUserToken(githubAccount: Github): Promise<Github> {
    if (githubAccount.expiresAt > new Date()) {

      return githubAccount;
    }

    const {data, authentication} = await refreshToken({
      clientType: 'github-app',
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      refreshToken: githubAccount.refreshToken,
    });

    const stringifiedUserAuthentication = JSON.stringify(authentication);
    const stringifiedData = JSON.stringify(data);
    logger.info(`userAuthentication: ${stringifiedUserAuthentication}`);
    logger.info(`data: ${stringifiedData}`);
    const newGithubModel = await this.github.findOneAndUpdate({ user: githubAccount.user }, { 
      accessToken: authentication.token,
      refreshToken: authentication.refreshToken,
      accessTokenExpiresAt: authentication.expiresAt,
      refreshTokenExpiresAt: authentication.refreshTokenExpiresAt,

     }).exec();

    return newGithubModel;
  }

}

