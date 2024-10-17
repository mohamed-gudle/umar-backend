export interface Github {
  _id: string;
  user: string;
  installation: number;
  owner: string;
  accessToken: string;
  refreshToken: string;
  scope: string;
  tokenType: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
  
}
