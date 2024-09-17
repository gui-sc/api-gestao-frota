"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverSchema = void 0;
const zod_1 = require("zod");
exports.DriverSchema = zod_1.z.object({
    name: zod_1.z.string(),
    cpf: zod_1.z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
    active: zod_1.z.boolean(),
    register: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform(value => new Date(value)),
    initialDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform(value => new Date(value)),
    finalDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform(value => new Date(value)),
});
//# sourceMappingURL=DriverSchema.js.map