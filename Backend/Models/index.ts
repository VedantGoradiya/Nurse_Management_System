import { Model } from 'sequelize';
import User from './user.model.js';
import Nurse from './nurse.model.js';
import Ward from './ward.model.js';

// Define associations with proper typing
User.hasOne(Nurse, { 
  foreignKey: 'userId', 
  as: 'nurse' 
});

Nurse.belongsTo(User, { 
  foreignKey: 'userId', 
  as: 'user' 
});

Nurse.belongsTo(Ward, { 
  foreignKey: 'wardId', 
  as: 'ward' 
});

Ward.hasMany(Nurse, { 
  foreignKey: 'wardId', 
  as: 'nurses' 
});

export { User, Nurse, Ward };
