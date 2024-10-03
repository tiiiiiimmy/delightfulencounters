import express from "express";
const router = express.Router();
import { requiresAuthentication, isAdmin } from "../../middleware/auth-middleware.js";
import { deleteUser, getAllUsers } from "../../data/users-dao.js";
import { getArticlesCount } from "../../data/articles-dao.js";
router.delete('/:userId', requiresAuthentication, isAdmin,async (req, res) => {
    const { userId } = req.params;
    const success =await deleteUser(userId);
    //deleteUser needs to be implemented

    if (!success) {
        return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User deleted successfully' });
});


router.get('/get-userslist', requiresAuthentication, isAdmin, async (req, res) => {
    const users = await getAllUsers();
    return res.json(users);
});

router.get('/get-articles-count/:userId', requiresAuthentication, isAdmin, async (req, res) => {
    const { userId } = req.params;
    const count = await getArticlesCount(userId);
    return res.json( count );
});



export default router;