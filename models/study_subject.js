/* jshint indent: 2 */
var models = require('../models');

module.exports = function(sequelize, DataTypes) {
  var StudySubject = sequelize.define('study_subject', {
    study_subject_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    study_id: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    subject_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    enrollment_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    telephone_contact: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    alt_telephone_contact: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    study_welcome_message: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 0 
    },
    study_completion_message: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 0    
    },
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      field: 'updated_at',
      type: DataTypes.DATE,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'study_subject',
  });

  StudySubject.associate = function (models) {
    StudySubject.hasMany(models.visit, {foreignKey: 'study_subject_id' }),
    StudySubject.hasMany(models.message_schedule, {foreignKey: 'study_subject_id' })
  };

  return StudySubject;
};
