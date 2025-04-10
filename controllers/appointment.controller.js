import { Appointment } from "../models/appointment.model.js"

export const bookAppointment = async (req, res) => {
    try {
        const { professorId, time } = req.body;
        

        if (!professorId || !time) {
            return res.status(400).json({
                message: "Professor ID and time are required."
            });
        }

        const existingAppointment = await Appointment.findOne({
            student: req.user._id,
            professor: professorId,
            time,
            status: 'booked'
        });

        if (existingAppointment) {
            return res.status(400).json({
                message: "You have already booked an appointment with this professor."
            });
        }

        const appointment = await Appointment.create({
            student: req.user._id,
            professor: professorId,
            time,
        });

        return res.status(201).json({
            message: "Appointment booked succuessfully",
            appointment,
            success: true
        });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong while booking the appointment." });
    }
};

export const cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Appointment ID is required."
            });
        }

        const appointment = await Appointment.findByIdAndUpdate(
            id,
            { status: 'cancelled' },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found."
            });
        }


        return res.status(200).json({
            message: "Appointment cancelled successfully",
            appointment,
            success: true
        });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong while cancelling the appointment." });
    }
};


export const getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({
            student: req.user._id,
            status: 'booked',
        });

        return res.status(201).json({
            message: "Appointment fetched succuessfully",
            appointments,
            success: true
        });
        
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong while retrieving your appointments." });
    }
};
