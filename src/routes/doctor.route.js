import { Router } from "express";
import { addDoctor, getDoctorById, getAllDoctors, updateDoctor, resignADoctor, toggleDoctorAvailability } from "../controllers/doctor.controller.js";
import { auth,authorizeRoles } from "../midllewares/auth.middleware.js";




const router = Router()

router.use(auth)

router.route("/")
      .post(authorizeRoles("admin"),addDoctor)
      .get(authorizeRoles("admin","staff"), getAllDoctors)

router.route("/:doctorId")
    .get(authorizeRoles("admin","staff"),getDoctorById)
    .patch(authorizeRoles("admin"),updateDoctor)
    .delete(authorizeRoles("admin"),resignADoctor)


router.route("/:doctorId/toggle-doctorAvailability").post(authorizeRoles("admin"),toggleDoctorAvailability)



export default router