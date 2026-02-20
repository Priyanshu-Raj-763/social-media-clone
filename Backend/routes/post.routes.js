import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { addComment, bookmarkPost, createPost, deletePost, getAllCommentsOfPost, getAllPost, getUserPost, likeDislikePost } from "../controllers/post.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.post("/create", isAuthenticated, upload.single("image"), createPost);
router.get("/getpost", isAuthenticated, getAllPost);
router.get("/user/getpost", isAuthenticated, getUserPost);
router.post("/likeOrDislike/:id", isAuthenticated, likeDislikePost);
router.post("/create/comment/:id", isAuthenticated, addComment);
router.get("/getcomment/:id", isAuthenticated, getAllCommentsOfPost);
router.delete("/delete/:id", isAuthenticated, deletePost);
router.patch("/bookmark/:id", isAuthenticated, bookmarkPost);





export default router;