/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  
  var MessageSchedule = sequelize.define('message_schedule', {
    message_schedule_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    study_subject_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'study_subject',
        key: 'study_subject_id'
      }
    },
    message_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'message',
        key: 'message_id'
      }
    },
    scheduled_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    message_rotation_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'message_rotation',
        key: 'message_rotation_id'
      }
    },
    message_status: {
      type: DataTypes.INTEGER(11),
      allowNull: true
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
      allowNull: true,
      references: {
        model: 'user',
        key: 'user_id'
      }
    }
  }, {
    tableName: 'message_schedule'
  });

  MessageSchedule.associate = function (models) {
    MessageSchedule.belongsTo(models.message, {foreignKey: 'message_id' })
    MessageSchedule.belongsTo(models.study_subject, {foreignKey: 'study_subject_id' })
  };

  return MessageSchedule;
};
