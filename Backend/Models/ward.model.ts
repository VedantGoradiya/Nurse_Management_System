import { DataTypes, Model } from 'sequelize';
import sequelize from '../Config/database.js';

import { WardModelAttributes } from '../types/ward.types';

interface WardCreationAttributes extends Omit<WardModelAttributes, 'id'> {}

class Ward extends Model<WardModelAttributes, WardCreationAttributes> implements WardModelAttributes {
  public id!: number;
  public wardName!: string;
  public wardColor!: string;
}

Ward.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    wardName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    wardColor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'wards',
    timestamps: false,
  }
);

export default Ward;
