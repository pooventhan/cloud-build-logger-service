import { Request, Response } from 'express';
import jwt, { JwtPayload } from "jsonwebtoken";
import axios from "axios";

// Cache for Google public keys
let googleCertsCache = null;
let googleCertsCacheExpiry = 0;

// Fetch Google's public keys
async function getGoogleCerts() {
  const now = Date.now();
  if (googleCertsCache && googleCertsCacheExpiry > now) {
    return googleCertsCache; // Use cached keys
  }

  try {
    const response = await axios.get("https://www.googleapis.com/oauth2/v1/certs");
    googleCertsCache = response.data;
    googleCertsCacheExpiry = now + 60 * 60 * 1000; // Cache for 1 hour
    return googleCertsCache;
  } catch (error) {
    throw new Error("Failed to fetch Google public keys");
  }
}

// Middleware for verifying JWTs
async function verifyGooglePubSubJWT(req: Request, res: Response, next) {
  try {
    const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from "Bearer <token>"
    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    // Fetch Google's certs and decode the JWT header to get the key ID
    const certs = await getGoogleCerts();
    const decodedHeader = jwt.decode(token, { complete: true });
    const kid = decodedHeader.header.kid;

    // Verify that the token's signature matches the cert's public key
    //const cert = certs.find((key) => key.kid === kid);
    const cert = certs[kid];
    if (!cert) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    const payload = jwt.verify(token, cert, {
      algorithms: ["RS256"],
      audience: process.env.GOOGLE_PUBSUB_AUDIENCE,
      issuer: "https://accounts.google.com",
    });

    //Check if token has expired
    if ((payload as JwtPayload).exp * 1000 < Date.now()) {
      res.status(401).json({ error: "Token expired" });
      return;
    }

    //req.user = payload; // Store token payload in request
    return next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("JWT verification failed:", error);
    res.status(403).json({ error: "Unauthorized" });
    return;
  }
}

export default verifyGooglePubSubJWT;