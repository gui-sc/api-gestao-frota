import { Sequelize } from "sequelize";

const DATABASE = process.env.DATABASE;
const PGUSER = process.env.PGUSER;
const PGPASSWORD = process.env.PGPASSWORD;
const PGHOST = process.env.PGHOST;

const sequelize = new Sequelize (DATABASE!, PGUSER!, PGPASSWORD!, {
    host: PGHOST,
    dialect: 'postgres'
});

export default sequelize;

