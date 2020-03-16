/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var SmsLog = sequelize.define('sms_log', {
    sms_log_id: {
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
    message_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'message',
        key: 'message_id'
      }
    },
    sms_text: {
      type: DataTypes.STRING(160),
      allowNull: true
    },
    contact_sent_to: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    date_sent: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    sent_by: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'user',
        key: 'user_id'
      }
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
    send_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'sms_log'
  });

  SmsLog.associate = function (models) {
    SmsLog.belongsTo(models.study_subject, {foreignKey: 'study_subject_id' })
  };
  
  return SmsLog;
};
