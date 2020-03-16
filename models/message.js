/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('message', {
    message_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    text_en: {
      type: DataTypes.STRING(160),
      allowNull: true
    },
    text_luo: {
      type: DataTypes.STRING(160),
      allowNull: true
    },
    intent: {
      type: DataTypes.STRING(75),
      allowNull: true
    },
    message_type_id: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      references: {
        model: 'message_type',
        key: 'message_type_id'
      }
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
    tableName: 'message'
  });
};
