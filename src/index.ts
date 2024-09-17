import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import DriverRouter from './routes/DriverRouter';
import VehicleRouter from './routes/VehicleRouter';
import sequelize from './database';

sequelize.sync().then(() => {
    console.log('Database connected!');
});

const app = express();
const PORT = process.env.PORT;
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/driver', DriverRouter);
app.use('/vehicle', VehicleRouter);




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
