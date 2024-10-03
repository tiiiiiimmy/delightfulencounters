//User login, logout, and registration

import express from "express";
const router = express.Router();
import { getUserWithCredentials } from "../../data/users-dao.js";
import { createUserJWT } from "../../utils/jwt-utils.js";

//login 
router.post("/login", async (req, res) => {
    // Get user with provided login details; return 401 if not found
    const { username, password } = req.body;
    console.log(username, password);
    const user = await getUserWithCredentials(username, password);
    if (!user) return res.sendStatus(401);

    // Create user JWT token and send it back as a HTTP-only cookie along with a 204 status.
    const jwtToken = createUserJWT(user.username);

    // Expires 24 hours from now
    const expires = new Date(Date.now() + 86400000);

    // Send the JWT token in an HTTP-only cookie named authToken which expires in 24 hours.
    return res.cookie("authToken", jwtToken, { httpOnly: true, expires }).status(200).json({ username });
});

//logout
router.delete("/logout", (req, res) => {
    return res.cookie("authToken", "", {
        httpOnly: true,
        expires: new Date(0)
    }).sendStatus(204);
});
export default router;