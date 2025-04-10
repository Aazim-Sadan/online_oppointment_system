import mongoose from 'mongoose';
import { Availability } from '../models/availablility.model.js';

export const addAvailability = async (req, res) => {

    try {
        const { slots } = req.body;


        const availability = await Availability.findOneAndUpdate(
            {
                professor: req.user._id
            },
            {
                $set: { slots }
            },
            {
                new: true, upsert: true
            }
        );

        return res.status(200).json({
            availability,
            success: true
        })

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const getAvailability = async (req, res) => {
    try {
        // const { professorId } = req.params;
        const professorId = req.params.professorId.replace(/['"]+/g, '');



        const availability = await Availability.findOne({
            professor: professorId
        }).populate("professor", "name email");

        console.log("Raw availability:", availability);

        const all = await Availability.find().lean();
        console.log("All availability docs:", all);


        return res.status(200).json({
            availability,
            success: true
        })
    } catch (error) {
        console.error("Error in getAvailability:", error);
        res.status(500).json({ message: "Server Error" });
    }
};