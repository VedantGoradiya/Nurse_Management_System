import { DataTypes, Model } from 'sequelize';
import sequelize from '../Config/database.js';

import { NurseModelAttributes } from '../types/nurse.types';

interface NurseCreationAttributes extends Omit<NurseModelAttributes, 'employeeId'> {}

class Nurse extends Model<NurseModelAttributes, NurseCreationAttributes> {
  public employeeId!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public wardId!: number;
}

Nurse.init(
  {
    employeeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    wardId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'wards',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'nurses',
    timestamps: false,
  }
);

export default Nurse;
