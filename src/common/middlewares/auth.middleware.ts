import { expressjwt, GetVerificationKey } from "express-jwt";
import JwksRsa from "jwks-rsa";

// Ensure that AUTH0_DOMAIN and AUTH0_AUDIENCE are defined in the environment variables
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN!;
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE!;

if (!AUTH0_DOMAIN || !AUTH0_AUDIENCE) {
  throw new Error('Missing environment variables for AUTH0_DOMAIN or AUTH0_AUDIENCE');
}

// Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint
const checkJwt: any = expressjwt({
  secret: JwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
  }) as GetVerificationKey,  // Explicitly type the secret as GetVerificationKey
  audience: 'http://localhost:5000',
  issuerBaseURL: `https://${AUTH0_DOMAIN}`,
  algorithms: ["RS256"],
});

declare global {
  namespace Express {
    interface Request {
      auth?: {
        sub?: string;
        [key: string]: any; 
      };
    }
  }
}

export { checkJwt };
