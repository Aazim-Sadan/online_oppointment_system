import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        professor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        time: Date,
        status: {
            type: String,
            enum: ['booked', 'cancelled'],
            default: 'booked'
        }
    }
);
export const Appointment = mongoose.model('Appointment', appointmentSchema);