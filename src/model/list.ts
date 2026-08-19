import type { InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute } from "sequelize";
import { Model, DataTypes } from "sequelize";
import { sequelize } from "../sequelize.ts";
import type User from "./user.ts";

class List extends Model<InferAttributes<List>, InferCreationAttributes<List>> {
    declare id: CreationOptional<number>;
    declare title: string;
    declare description: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare userId: ForeignKey<User['id']>;
    declare user?: NonAttribute<User>;
}

List.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            comment: "todo list title"
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: "todo list description"
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        comment: "To store all todo list",
        tableName: "list",
        modelName: "list",
    }
);

export default List;