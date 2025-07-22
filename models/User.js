const { DataTypes } = require('sequelize');
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = db.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Full name is required'
      },
      len: {
        args: [3, 50],
        msg: 'Full name must be between 3 and 50 characters'
      }
    }
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Phone number already in use'
    },
    validate: {
      notEmpty: {
        msg: 'Phone number is required'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Email already in use'
    },
    validate: {
      isEmail: {
        msg: 'Please provide a valid email'
      },
      notEmpty: {
        msg: 'Email is required'
      }
    }
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Password is required'
      },
      len: {
        args: [6, 100],
        msg: 'Password must be at least 6 characters'
      }
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'users',
  timestamps: false,
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password_hash')) {
        user.password_hash = await bcrypt.hash(user.password_hash, 10);
      }
    }
  }
});

// Method to compare passwords
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password_hash);
};

// Associations
User.associate = (models) => {
  User.hasMany(models.ContactRequest, { foreignKey: 'user_id' });
  User.hasMany(models.Meeting, { foreignKey: 'user_id' });
  User.hasMany(models.Brief, { foreignKey: 'user_id' });
};

module.exports = User;
