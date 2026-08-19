import { Sequelize } from "sequelize";

const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

export const sequelize = new Sequelize(DB_NAME || "", DB_USERNAME || "", DB_PASSWORD, {
    host: DB_HOST,
    port: Number(DB_PORT),
    dialect: "postgres",
    logging: false,
    timezone: "+08:00"
});