import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import DriverRouter from './routes/DriverRouter';
import VehicleRouter from './routes/VehicleRouter';
import AdminRouter from './routes/AdminRouter';
import TravelRouter from './routes/TravelRouter';
import ChatRouter from './routes/ChatRouter';
import DatesRouter from './routes/ImportantDateRouter';
import UserRouter from './routes/UserRouter';
import sequelize from './database';

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
app.use('/travel', TravelRouter);
app.use('/chat', ChatRouter);
app.use('/dates', DatesRouter);
app.use('/user', UserRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});