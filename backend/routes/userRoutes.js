import {Router} from "express";
import {authUser, getUserProfile, logoutUser, registerUser, updateUserProfile} from "../controllers/userController.js";
import {protect} from "../middleware/authMiddleware.js";
const router = Router()

router.post('/', authUser)
router.post('/auth', authUser)
router.post('/logout', logoutUser)
router.post('/register', registerUser)
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile)


export default router