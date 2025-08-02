import { Router } from "express";
import { addRoom, getRoomById, getAllRoom, assignRoomToPatient, vacateRoom } from "../controllers/room.controller.js";
import { auth,authorizeRoles } from "../midllewares/auth.middleware.js";

const router = Router()
router.use(auth)


router.route("/")
      .post(authorizeRoles("admin"),addRoom)
      .get(authorizeRoles("admin","staff"),getAllRoom)
router.route("/:roomId")
    .get(authorizeRoles("admin","staff"),getRoomById)
    .delete(authorizeRoles("admin","staff"),vacateRoom)
router.route("/:roomId/:patientId/assign-roomToPatient").post(authorizeRoles("admin","staff"),assignRoomToPatient)    


export default router