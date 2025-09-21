import { protect } from '../middleware/protectRoute';
import {Router} from 'express';
import { deleteUser, getAllUsers, getMe, updateUser } from '../controllers/userController';
import { restrictedTo } from '../middleware/adminProtected';
import  upload  from '../middleware/melter';

const router = Router();

router.route("/").get(protect, restrictedTo("admin"), getAllUsers);
router.route("/me").get(protect, getMe);
router.route("/:id",).patch(upload.single("profilePic"),protect, updateUser).delete(protect, deleteUser)

export default router;

