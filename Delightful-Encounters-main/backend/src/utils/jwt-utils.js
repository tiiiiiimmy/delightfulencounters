
import jwt from "jsonwebtoken";


//Verifies the given JWT token and gets the username from it. Throws an error if the JWT is invalid or expired, or there's no username in the token.
export function getUsernameFromJWT(token) {
    // Decode token; will throw an error if the token is invalid or expired.
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (!decoded.username) throw `JWT is valid but did not contain a username.`;
    return decoded.username;
}

//Creates a new JWT for the user with the given username, with the given expiry time (defaults to 24 hours).
//  Ideally, the expiry time should match the expiry time of the HTTP - only cookie it will be stored in, but doesn't
//   matter too much if not(they will both be checked separately).
export function createUserJWT(username, expiresIn = "24h") {
    return jwt.sign({ username }, process.env.JWT_KEY, { expiresIn });
}
