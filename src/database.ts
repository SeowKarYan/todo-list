import { sequelize } from "./sequelize.ts";

import List from "./model/list.ts";
import User from "./model/user.ts";

export const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true })
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Unable to sync the database:', error);
    }
}

export const disconnectDatabase = async () => {
    try {
        await sequelize.close()
        console.log('Database disconnected successfully.');
    } catch (error) {
        console.error('Unable to disconnect the database:', error);
    }
}

User.hasMany(List);
List.belongsTo(User);