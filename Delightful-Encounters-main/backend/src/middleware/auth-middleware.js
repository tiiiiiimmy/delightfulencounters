// //Check if the user has logged in; Handle the maintenance of user login status; Protect routes that require authentication;
import { getUserWithUsername } from "../data/users-dao.js";
import { getUsernameFromJWT } from "../utils/jwt-utils.js";

export async function requiresAuthentication(req, res, next) {
    if (!req.cookies.authToken) return res.sendStatus(401);

   
    const username = getUsernameFromJWT(req.cookies.authToken);
    const user = await getUserWithUsername(username);
    if (!user) return res.sendStatus(401);
    req.user = user;
    return next();

}

export function isAdmin(req, res, next) {
    if (!req.user || !req.user.admin) {
        return res.sendStatus(403);
    }
    next();
}