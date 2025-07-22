const { DataTypes } = require('sequelize');
const db = require('../config/db');

const ContactRequest = db.define('ContactRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  service_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'services',
      key: 'id'
    }
  },
  purpose: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Purpose is required'
      },
      len: {
        args: [10, 500],
        msg: 'Purpose must be between 10 and 500 characters'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'processed', 'rejected'),
    defaultValue: 'pending',
    validate: {
      isIn: {
        args: [['pending', 'processed', 'rejected']],
        msg: 'Invalid status value'
      }
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'requests',
  timestamps: false
});

module.exports = ContactRequest;
