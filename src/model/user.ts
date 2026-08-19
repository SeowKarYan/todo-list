import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from "sequelize";
import { Model, DataTypes } from "sequelize";
import { sequelize } from "../sequelize.ts";
import type List from "./list.ts";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>;
    declare username: string;
    declare password: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare lists?: NonAttribute<List[]>;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            comment: "username for login"
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "password for login"
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        comment: "To store all user",
        tableName: "user",
        modelName: "user",
    }
);

export default User;