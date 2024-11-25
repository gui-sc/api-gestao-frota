import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import path from 'path';
import DriverRouter from './routes/DriverRouter';
import VehicleRouter from './routes/VehicleRouter';
import TravelRouter from './routes/TravelRouter';
import ChatRouter from './routes/ChatRouter';
import DatesRouter from './routes/ImportantDateRouter';
import DeclineMessageRouter from './routes/DriverDeclineMessageRouter';
import UserRouter from './routes/UserRouter';
import DocsRouter from './routes/DocsRouter';
import sequelize from './database';

sequelize.sync().then(() => {
    console.log('Database connected!');
}).catch((error) => {
    console.log("Error: " + error);
});

const app = express();
const PORT = process.env.PORT;
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', DocsRouter);
app.use('/driver', DriverRouter);
app.use('/vehicle', VehicleRouter);
app.use('/travel', TravelRouter);
app.use('/chat', ChatRouter);
app.use('/dates', DatesRouter);
app.use('/user', UserRouter);
app.use('/declineMessage', DeclineMessageRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});