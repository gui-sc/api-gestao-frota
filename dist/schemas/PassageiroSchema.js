"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassageiroSchema = void 0;
const zod_1 = require("zod");
exports.PassageiroSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
    active: zod_1.z.boolean(),
    register: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform(value => new Date(value)),
    initialDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform(value => new Date(value)),
    finalDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform(value => new Date(value)),
});
//# sourceMappingURL=PassageiroSchema.js.map