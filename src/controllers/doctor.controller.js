import { asyncHandler } from "../utils/asyncHandler.js";
import { Doctor } from "../models/doctor.model.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";





//🎯add doctor

const addDoctor = asyncHandler(async (req, res) => {

    const { name, specialization, department, contactNumber, enrollmentId } = req.body

    if (!name || !specialization || !department || !contactNumber || !enrollmentId) {
        throw new ApiError(400, "all fields are required")
    }

    const existedDoctor = await Doctor.findOne({
       enrollmentId
    })

    if (existedDoctor) {
        throw new ApiError(401, "doctor already exist")
    }

    const newDoctor = await Doctor.create({
        name,
        specialization,
        department,
        contactNumber,
        enrollmentId

    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                newDoctor,
                "doctor added successfully"
            )
        )

})

//🎯get doctor by Id

const getDoctorById = asyncHandler(async (req, res) => {

    const { doctorId } = req.params

    const doctor = await Doctor.findById(doctorId)

    if (!doctor) {
        throw new ApiError(404, "doctor not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                doctor,
                "doctor fetched successfully"
            )
        )

})

//🎯get all doctor

const getAllDoctors = asyncHandler(async (req, res) => {

    const doctors = await Doctor.find()

    if (!doctors) {
        throw new ApiError(404, "doctors not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                doctors,
                "doctors fetched successfully"
            )
        )

})

//🎯upadte doctor profile of a specific doctor

const updateDoctor = asyncHandler(async (req, res) => {

    const { name, specialization, department, contactNumbar } = req.body

    const { doctorId } = req.params

    const doctor = await Doctor.findById(doctorId)

    if (!doctor) {
        throw new ApiError(404, "doctor not found")
    }
    //🔊admin can update 

    doctor.name = name || doctor.name
    doctor.specialization = specialization || doctor.specialization
    doctor.department = department || doctor.department
    doctor.contactNumbar = contactNumbar || doctor.contactNumbar

    await doctor.save()

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                doctor,
                "doctor updated successfully"
            )
        )


})

//🎯resignation  of a specific doctor

const resignADoctor = asyncHandler(async (req, res) => {

    const { doctorId } = req.params

    const doctor = await Doctor.findById(doctorId)

    if (!doctor) {
        throw new ApiError(404, "doctor not found")
    }

    if (!doctor.isActive) {
        throw new ApiError(404, "doctor is already resigned")
    }

    //🔊only admin can do this

    doctor.isActive = false

    await doctor.save()

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "doctor resign successfully"

            )
        )

})

//🎯toggle doctor availability

const toggleDoctorAvailability = asyncHandler(async (req, res) => {

    const { doctorId } = req.params

    const doctor = await Doctor.findById(doctorId)

    if (!doctor) {
        throw new ApiError(404, "doctor not found")
    }

    //🔊only admin can do this

    doctor.isAvailable = !doctor.isAvailable

    await doctor.save()

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                { message: `currently doctor ${doctor.name} is ${doctor.isAvailable ? "available" : "unavailable"}` }

            )
        )

})




export {
    addDoctor,
    getDoctorById,
    getAllDoctors,
    updateDoctor,
    resignADoctor,
    toggleDoctorAvailability
}