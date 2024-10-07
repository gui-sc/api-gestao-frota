import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import DriverRouter from './routes/DriverRouter';
import VehicleRouter from './routes/VehicleRouter';
import AdminRouter from './routes/AdminRouter';
import sequelize from './database';
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

sequelize.sync().then(() => {
    console.log('Database connected!');
}).catch((error) => {
    console.log("Error: " + error);
});

const app = express();
const PORT = process.env.PORT;
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/driver', DriverRouter);
app.use('/vehicle', VehicleRouter);
app.use('/admin', AdminRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
