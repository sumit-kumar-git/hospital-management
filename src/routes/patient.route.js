import { Router } from "express";
import { addPatient, getPatientById, getAllPatient, updatePatient,  dischargePatient } from "../controllers/patient.controller.js";
import { auth,authorizeRoles } from "../midllewares/auth.middleware.js";



const router = Router()

router.use(auth)
router.use(authorizeRoles("admin","staff"))

router.route("/")
      .post(addPatient)
      .get(getAllPatient)

router.route("/:patientId")
    .get(getPatientById)
    .patch(updatePatient)
    .delete(dischargePatient)


export default router