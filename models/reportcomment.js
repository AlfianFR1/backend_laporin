'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReportComment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ReportComment.belongsTo(models.Report, { foreignKey: 'report_id' });
    }
  }
  ReportComment.init({
    report_id: DataTypes.INTEGER,
    user_uid: DataTypes.STRING,
    actor: DataTypes.STRING,
    type:DataTypes.STRING,
    comment: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'ReportComment',
  });
  return ReportComment;
};