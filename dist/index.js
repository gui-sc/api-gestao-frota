"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const DriverRouter_1 = __importDefault(require("./routes/DriverRouter"));
const VehicleRouter_1 = __importDefault(require("./routes/VehicleRouter"));
const AdminRouter_1 = __importDefault(require("./routes/AdminRouter"));
const database_1 = __importDefault(require("./database"));
database_1.default.sync().then(() => {
    console.log('Database connected!');
}).catch((error) => {
    console.log("Error: " + error);
});
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/driver', DriverRouter_1.default);
app.use('/vehicle', VehicleRouter_1.default);
app.use('/admin', AdminRouter_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map