'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here


    Report.hasMany(models.ReportComment, {
      foreignKey: 'report_id',
      as: 'comments', // <--- pastikan alias ini cocok
    });

    Report.hasMany(models.ReportStatusHistory, {
      foreignKey: 'report_id',
      as: 'statushistory', // <--- pastikan alias ini cocok
    });

    }
  }
Report.init({
  user_uid: DataTypes.STRING,
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  image_url: DataTypes.STRING,
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending', // ✅ Nilai default
  },
  }, {
    sequelize,
    modelName: 'Report',
  });
  return Report;
};