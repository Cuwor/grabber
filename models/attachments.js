'use strict';
module.exports = (sequelize, DataTypes) => {
  var attachments = sequelize.define('attachments', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    postId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'steals',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.TEXT
    },
    ownerId: {
      type: DataTypes.TEXT
    },
    fileId: {
      type: DataTypes.TEXT
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  });
  attachments.associate = function(models) {
    models.attachments.belongsTo(models.steal)
  }
  return attachments;
};
