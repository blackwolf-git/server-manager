const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Service = db.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Service name is required'
      },
      len: {
        args: [3, 100],
        msg: 'Service name must be between 3 and 100 characters'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: {
        msg: 'Price must be a valid decimal number'
      },
      min: {
        args: [0],
        msg: 'Price cannot be negative'
      }
    }
  }
}, {
  tableName: 'services',
  timestamps: false
});

// Associations
Service.associate = (models) => {
  Service.hasMany(models.ContactRequest, { foreignKey: 'service_id' });
};

module.exports = Service;
