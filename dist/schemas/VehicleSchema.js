"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleSchema = void 0;
const zod_1 = require("zod");
exports.VehicleSchema = zod_1.z.object({
    model: zod_1.z.string(),
    brand: zod_1.z.string(),
    year: zod_1.z.number(),
    chassis: zod_1.z.string(),
    licenseDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform(value => new Date(value)),
    licenseDueDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform(value => new Date(value)),
    plate: zod_1.z.string(),
    color: zod_1.z.string(),
    active: zod_1.z.boolean(),
    initialDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform(value => new Date(value)),
    finalDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform(value => new Date(value)),
    renavam: zod_1.z.number(),
});
//# sourceMappingURL=VehicleSchema.js.map