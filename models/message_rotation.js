/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('message_rotation', {
    message_rotation_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    message_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'message',
        key: 'message_id'
      }
    },
    week: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    month: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
      allowNull: false,
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
    tableName: 'message_rotation'
  });
};
