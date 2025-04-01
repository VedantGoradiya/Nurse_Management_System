import { DataTypes, Model } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../Config/database";

import { UserModelAttributes } from "../types/user.types";

interface UserCreationAttributes extends Omit<UserModelAttributes, 'id'> {}

class User extends Model<UserModelAttributes, UserCreationAttributes> {
  public id!: number;
  public email!: string;
  public password!: string;
  public role!: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: false,
  }
);

// Hook to hash the password before saving it
User.beforeCreate(async (user: User) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

export default User;