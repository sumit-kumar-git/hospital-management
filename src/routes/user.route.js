
import { Router } from "express";
import { loginUser, logoutUser, registerUser,refreshAccessToken,changeCurrentPassword,updateUserDetails,getUserById,deleteAUser } from "../controllers/user.controller.js";
import { auth } from "../midllewares/auth.middleware.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(auth, logoutUser)
router.route("/refresh-accessToken").post(auth,refreshAccessToken)
router.route("/change-password").post(auth,changeCurrentPassword)
router.route("/:userId")
      .get(auth,authorizeRoles("admin","staff"),getUserById)
      .patch(auth,authorizeRoles("admin","staff"),updateUserDetails)
      .delete(auth,authorizeRoles("admin"),deleteAUser)
      

export default router