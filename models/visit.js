/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('visit', {
    visit_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    study_subject_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'study_subject',
        key: 'subject_id'
      }
    },
    visit_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    next_appointment_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      field: 'updated_at',
      type: DataTypes.DATE,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'user',
        key: 'user_id'
      }
    }
  }, {
    tableName: 'visit'
  });
};
