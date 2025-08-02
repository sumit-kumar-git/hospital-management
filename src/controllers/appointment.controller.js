import { Appointment } from "../models/appointment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Patient } from "../models/patient.model.js";
import { Doctor } from "../models/doctor.model.js"



//🎯create or booking appointment

const createAppointment = asyncHandler(async (req, res) => {

    const { patient, doctor, reason, appointmentDate } = req.body

    if (
        [patient, doctor, reason, appointmentDate].some((field) => field.trim().toString() === "")
    ) {
        throw new ApiError(404, "required field is missing")
    }

    const patientExist = await Patient.findById(patient)

    if (!patientExist) {
        throw new ApiError(404, "patient not found")
    }

    const doctorExist = await Doctor.findById(doctor)

    if (!doctorExist) {
        throw new ApiError(404, "doctor not found")
    }

    const newAppointment = await Appointment.create({
        patient,
        doctor,
        appointmentDate,
        reason
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                newAppointment,
                "appointment booking successfully"

            )
        )

})

//🎯get all appointments

const getAllAppointments = asyncHandler(async (req, res) => {

    const appointments = await Appointment.find()
        .populate("doctor", "name specialization department")
        .populate("patient", "name disease gender age")

    if (!appointments) {
        throw new ApiError(404, "appointments not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                appointments,
                "All appointments fetched successfully"
            )
        )

})

//🎯get appointment by Id

const getAppointmentById = asyncHandler(async (req, res) => {

    const { appointmentId } = req.params

    const appointment = await Appointment.findById(appointmentId)
        .populate("doctor", "name specialization department")
        .populate("patient", "name disease gender")

    if (!appointment) {
        throw new ApiError(404, "appointment not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                appointment,
                "appointment fetched successfully"
            )
        )

})

//🎯update a specific appointment

const updateAppointment = asyncHandler(async (req, res) => {

    const { appointmentId } = req.params

    const { doctor, reason, appointmentDate, appointmentStatus } = req.body

    const appointment = await Appointment.findById(appointmentId)

    if (!appointment) {
        throw new ApiError(404, "appointment not found")
    }

    appointment.doctor = doctor || appointment.doctor
    appointment.reason = reason || appointment.reason
    appointment.appointmentDate = appointmentDate || appointment.appointmentDate
    appointment.appointmentStatus = appointmentStatus || appointment.appointmentStatus

    await appointment.save()

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                appointment,
                "appointment updated successfully"
            )
        )


})

//🎯delete or cancelled a specific appointment

const cancelAppointment = asyncHandler(async (req, res) => {

    const { appointmentId } = req.params

    const appointment = await Appointment.findById(appointmentId)

    if (!appointment) {
        throw new ApiError(404, "appointment not found")
    }

    if (appointment.appointmentStatus === "Cancelled") {
        throw new ApiError(403, "appointment is alreday cancelled")
    }

    //🔊only admin can cancelled the appointment

    appointment.appointments = "Cancelled"

    await appointment.save()

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "appointment cancelled successfully"
            )
        )


})




export {
    createAppointment,
    getAppointmentById,
    getAllAppointments,
    updateAppointment,
    cancelAppointment
}


