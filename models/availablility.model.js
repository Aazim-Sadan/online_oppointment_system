import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema(
    {
        professor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        slots: [{ type: Date }]
    }
);
export const Availability = mongoose.model('Availability', availabilitySchema);