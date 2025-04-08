import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const authMiddleware = async (req, res, next) => {

    
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token);
    

    if (!token) {
        return res.status(401).json({
            message: "User not authenticated",
            success: false
        })
    };

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        

        req.user = await User.findById(decoded.id);

        if (!req.user) return res.status(401).json({
            message: "User not found",
            success: true
        });


        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};