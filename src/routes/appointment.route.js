import { Router } from "express";
import { createAppointment, getAppointmentById, getAllAppointments, updateAppointment, cancelAppointment } from "../controllers/appointment.controller.js";
import { auth,authorizeRoles } from "../midllewares/auth.middleware.js";


const router = Router()
router.use(auth)
router.use(authorizeRoles("admin","staff"))

router.route("/")
      .post(createAppointment)
      .get(getAllAppointments)

router.route("/:appointmentId")
    .get(getAppointmentById)
    .patch(updateAppointment)
    .delete(cancelAppointment)


export default router