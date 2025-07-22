const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Meeting = db.define('Meeting', {
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
  timeslot: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'Invalid date format for timeslot'
      },
      isAfter: {
        args: new Date().toISOString(),
        msg: 'Timeslot must be in the future'
      }
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
    type: DataTypes.ENUM('scheduled', 'completed', 'canceled'),
    defaultValue: 'scheduled',
    validate: {
      isIn: {
        args: [['scheduled', 'completed', 'canceled']],
        msg: 'Invalid status value'
      }
    }
  }
}, {
  tableName: 'meetings',
  timestamps: false
});

module.exports = Meeting;
