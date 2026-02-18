import { editProfile, followOrUnfollow, getSuggestedUser, getUserProfile, loginUser, logoutUser, registerUser } from "../controllers/user.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { Router } from "express";

const router = Router();
//unsecure routes
router.post('/register', registerUser)
router.post('/login', loginUser)

//secure routes
router.post("/logout", isAuthenticated, logoutUser);
router.get("/profile/:id", isAuthenticated, getUserProfile);
router.put("/profile/edit", isAuthenticated, upload.single("profilePic"), editProfile);
router.get("/suggested", isAuthenticated, getSuggestedUser)
router.post("/followOrUnfollow/:id", isAuthenticated, followOrUnfollow)

export default router;