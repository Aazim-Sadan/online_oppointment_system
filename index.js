import express from 'express';
import dotenv from 'dotenv';
import  connectDB  from './config/db.js';
import authRoutes from './routes/auth.route.js';
import availabilityRoutes from './routes/availability.route.js';
import appointmentRoutes from './routes/appointment.route.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/availability', availabilityRoutes);
app.use('/appointments', appointmentRoutes);


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})