const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Brief = db.define('Brief', {
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
  details: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Brief details are required'
      },
      len: {
        args: [50, 5000],
        msg: 'Brief must be between 50 and 5000 characters'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('submitted', 'reviewed', 'approved'),
    defaultValue: 'submitted',
    validate: {
      isIn: {
        args: [['submitted', 'reviewed', 'approved']],
        msg: 'Invalid status value'
      }
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'job_offers',
  timestamps: false
});

module.exports = Brief;
