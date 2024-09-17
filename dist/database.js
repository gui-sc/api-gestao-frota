"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const DATABASE = process.env.DATABASE;
const PGUSER = process.env.PGUSER;
const PGPASSWORD = process.env.PGPASSWORD;
const PGHOST = process.env.PGHOST;
const sequelize = new sequelize_1.Sequelize(DATABASE, PGUSER, PGPASSWORD, {
    host: PGHOST,
    dialect: 'postgres'
});
exports.default = sequelize;
//# sourceMappingURL=database.js.map