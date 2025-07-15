'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReportStatusHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ReportStatusHistory.belongsTo(models.Report, { foreignKey: 'report_id' });
    }
  }
  ReportStatusHistory.init({
    report_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    changed_by: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ReportStatusHistory',
  });
  return ReportStatusHistory;
};