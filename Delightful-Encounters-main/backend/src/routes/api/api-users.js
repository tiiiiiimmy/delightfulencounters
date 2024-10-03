
import express from "express";
import multer from "multer";
import path from "path";
import { v4 as uuid } from "uuid";
import fs from "fs";

import { requiresAuthentication } from "../../middleware/auth-middleware.js";
import { checkUsername, getUserId, createUser, updateUser, deleteUser, getUesrInfo } from "../../data/users-dao.js";

const router = express.Router();

//get username
router.get("/", requiresAuthentication, async (req, res) => {

  const { username } = req.user;
  const user = await getUserId(username);
 const userId = user.user_id;
  return res.json(userId);
 
});


router.get("/get-userId/:username", async (req, res) => {
  const username = req.params.username;
  const userId = await getUserId(username);

  return res.json(userId);
});


//get user info
router.get("/get-user/:userId", async (req, res) => {
  const user = req.params;
  console.log(user);
  const result = await getUesrInfo(user.userId);

  if (result) {
    return res.status(200).json(result);
  }
  return res.status(404).json({ message: 'User not found' });

})

//Check if the provided username is available.
router.get('/check-username/:username', async (req, res) => {
  const { username } = req.params;

  const userExists = await checkUsername(username);
  if (userExists) {
    return res.status(409).json({ message: 'Username already exists' });
  }
  return res.status(200).json({ message: 'Username is available' });
});



const upload = multer({ dest: 'temp' });


// create user
router.post("/", upload.single("image-file"), async (req, res) => {
  const user = req.body;
  if (req.file) {
    const originalname = req.file.originalname;
    const fileExtension = originalname.substring(originalname.lastIndexOf("."));
    const newFileName = uuid() + fileExtension;

    fs.renameSync(req.file.path, `public/images/${newFileName}`);
    user.avatar = `${newFileName}`;
  }

  const { success, message } = await createUser(user);
  if (!success) {
    return res.status(409).json({ message });
  }
  return res.status(201).json({ message: 'Registered successfully, please log in' });
});


//delete user by himself
router.delete('/', requiresAuthentication, async (req, res) => {

  const userDeleted = await deleteUser(req.user.user_id);  // 使用 await 来等待删除操作完成
  if (!userDeleted) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.clearCookie("authToken").json({ message: 'Account deleted successfully' });
});


//update user information
router.put('/', upload.single("image-file"), requiresAuthentication, async (req, res) => {

  
  const userInfo = req.body;
  if (req.file) {
    const originalname = req.file.originalname;
    const fileExtension = originalname.substring(originalname.lastIndexOf("."));
    const newFileName = uuid() + fileExtension;
    
    fs.renameSync(req.file.path, `public/images/${newFileName}`);
    userInfo.avatar = `${newFileName}`;
  }

  try {
    const { success, message } = await updateUser(req.user.user_id, userInfo);
    if (!success) {
      return res.status(400).json({ message });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }

});

//delete user
router.delete('/delete/:userId', requiresAuthentication, async (req, res) => {
  const { userId } = req.params;
  const { user } = req; // Assuming req.user contains the authenticated user's details

  // Check if the authenticated user is an admin or if they are trying to delete their own account
  if (user.user_id == userId) {
    const success = await deleteUser(userId);

    if (!success) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User deleted successfully' });
  } else {
    // If the user is not an admin and trying to delete someone else's account
    return res.status(403).json({ message: 'Forbidden' });
  }
});

export default router;