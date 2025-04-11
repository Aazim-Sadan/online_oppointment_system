import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const register = async (req, res) => {
    try {
        console.log("Inside register handler");
        const { name, email, password, role } = req.body;
        console.log(name, email, password, role);
        

        if (!name || !email || !password || !role) {
            return res.json("All fields are required")
        }

        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email',
                success: false
            })
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ name, email, password: hashedPassword, role });

        return res.status(201).json({
            message: "User registered",
            newUser,
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json("All fields are required")
        }

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.cookie("token", token, { httpOnly: true, secure: true, maxAge: 1 * 24 * 60 * 60 * 1000 })


        return res.status(200).json({
            message: "Wellcome back",
            token,
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email,   
                role: user.role 
            },
            success: true
        })

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};