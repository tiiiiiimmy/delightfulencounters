//Combine different API modules together; Basic routing for configuring APIs
import express from "express";

const router = express.Router();

// import child routes
import authRoutes from "./api-auth.js";
router.use("/auth", authRoutes);
import userRoutes from "./api-users.js";
router.use("/users", userRoutes);
import adminRoutes from "./api-admin.js";
router.use("/admin", adminRoutes);
import articlesRoutes from "./api-articles.js";
router.use("/articles", articlesRoutes);

export default router;


