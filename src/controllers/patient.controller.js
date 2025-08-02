import { Patient } from "../models/patient.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";






//🎯add new patient

const addPatient = asyncHandler(async (req, res) => {

    const { name, age, disease, gender, adress, contactNumber, doctorAssigned, enrollmentId } = req.body

    const allowedGender = ["M", "F", "O"]

    // if (!name || !age || !disease || !gender || !contactNumber || !doctorAssigned || !enrollmentId) {
    //     throw new ApiError(400, "required field is missing")
    // }

    if (
        [name, age, disease, gender, contactNumber, doctorAssigned, enrollmentId].some((field) => field.trim().toString() === "")
    ) {
        throw new ApiError(400, "required field is missing")
    }

    if (!allowedGender.includes(gender)) {
        throw new ApiError(400, "Invalid gender")
    }

    const existedPatient = await Patient.findOne({
        $or: [{ enrollmentId }]
    })

    if (existedPatient) {
        throw new ApiError(409, "patient with this enrollmentId is already exist")
    }

    const patient = await Patient.create({
        name,
        age,
        disease,
        gender,
        adress,
        contactNumber,
        doctorAssigned,
        enrollmentId,
        admissionDate: Date.now()

    })

    if (!patient) {
        throw new ApiError(403, "something went wrong while adding patient")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                patient,
                "patient added successfully"
            )
        )


})



//🎯get patient by Id

const getPatientById = asyncHandler(async (req, res) => {

    const { patientId } = req.params

    const patient = await Patient.findById(patientId)

    if (!patient) {
        throw new ApiError(404, "patient not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                patient,
                "patient fetched successfully"
            )
        )

})

//🎯get all patient

const getAllPatient = asyncHandler(async (req, res) => {

    const patients = await Patient.find()

    if (!patients) {
        throw new ApiError(404, "patients not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                patients,
                "petients fetched successfully"
            )
        )

})

//🎯update patient profile of specific patient

const updatePatient = asyncHandler(async (req, res) => {

    const { name, age, gender, adress, contactNumber, disease, doctorAssigned } = req.body

    const { patientId } = req.params

    const patient = await Patient.findById(patientId)

    if (!patient) {
        throw new ApiError(404, "patient not found")
    }

    //🔊 only admin can update

    patient.name = name || patient.name
    patient.age = age || patient.age
    patient.gender = gender || patient.gender
    patient.adress = adress || patient.adress
    patient.contactNumber = contactNumber || patient.contactNumber
    patient.doctorAssigned = doctorAssigned || patient.doctorAssigned
    patient.disease = disease || patient.disease

    await patient.save()

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                patient,
                "patient details updated successfully"
            )
        )


})

//🎯delete or discharge a specific patient 

const dischargePatient = asyncHandler(async (req, res) => {

    const { patientId } = req.params

    const patient = await Patient.findById(patientId)

    if (!patient) {
        throw new ApiError(404, "patient not found")
    }

    if (!patient.isAdmitted) {
        throw new ApiError(400,"patient is already discharged")
    }

    patient.isAdmitted = false
    patient.disChargeDate = Date.now()

    await patient.save()

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                { message: `patient ${patient.name} discharged successfully` }
            )
        )

})





export {
    addPatient,
    getPatientById,
    getAllPatient,
    updatePatient,
    dischargePatient
}
