import { Room } from "../models/room.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose"
import { Patient } from "../models/patient.model.js"



//🎯add room

const addRoom = asyncHandler(async (req, res) => {

    const { roomNumber, roomType } = req.body

    const allowedRoomTypes = ["General", "Private", "Semi-Private", "ICU"]

    if (!roomNumber || !roomType) {
        throw new ApiError(400, "roomNumber and roomType is required")
    }
    if (!allowedRoomTypes.includes(roomType)) {
        throw new ApiError(409, "Invalid room type")
    }
    

    const existRoom = await Room.findOne({
        roomNumber
    })

    if (existRoom) {
        throw new ApiError(409, "room is already exist")
    }

    const newRoom = await Room.create({
        roomNumber,
        roomType,
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                newRoom,
                "new room added successfully"
            )
        )



})

//🎯get room by Id

const getRoomById = asyncHandler(async (req, res) => {

    const { roomId } = req.params

    const room = await Room.findById(roomId)
        .populate("patient", "name gender enrollmentId disease age contactNumber")

    if (!room) {
        throw new ApiError(404, "room not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                room,
                "room fetched successfully"
            )
        )


})

//🎯get All room

const getAllRoom = asyncHandler(async (req, res) => {

    const rooms = await Room.find()
        .populate("patient", "name age gender disease contactNumber enrollmentId")

    if (!rooms) {
        throw new ApiError(404, "rooms not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                rooms,
                "all rooms fetched successfully"
            )
        )

})

//🎯assign room to a patient

const assignRoomToPatient = asyncHandler(async (req, res) => {

    const { roomId, patientId } = req.params

    const room = await Room.findById(roomId)

    if (!room) {
        throw new ApiError(404, "room not found")
    }

    const patientExist = await Patient.findById(patientId)

    if (!patientExist) {
        throw new ApiError(404, "patient not found")
    }

    if (room.isOccupied) {
        throw new ApiError(402, "room is already occupied")
    }

    room.patient = patientId
    room.isOccupied = true

    await room.save()

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                room,
                "room assigned successfully"
            )
        )

})

//🎯vacate room 

const vacateRoom = asyncHandler(async (req, res) => {

    const { roomId } = req.params

    const room = await Room.findById(roomId)

    if (!room) {
        throw new ApiError(404, "room not found")
    }

    if (!room.isOccupied) {
        throw new ApiError(402, "room is already vacate")
    }

    room.patient = null
    room.isOccupied = false

    await room.save()

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "room vacate successfully"
            )
        )

})




export {
    addRoom,
    getRoomById,
    getAllRoom,
    assignRoomToPatient,
    vacateRoom
}
