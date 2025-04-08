import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: String,
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: { type: String, enum: ['student', 'professor'], required: true },
    }
)

export const User = mongoose.model('User', userSchema)