'use strict';
module.exports = (sequelize, DataTypes) => {
  var steal = sequelize.define('steal', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    groupId: {
      type: DataTypes.INTEGER
    },
    text: {
      type: DataTypes.TEXT
    },
    isPosted: {
      type: DataTypes.BOOLEAN
    },
    postId: {
      type: DataTypes.INTEGER
    }
  });
  steal.associate = function(models) {
    steal.hasMany(models.attachments)
  }
  return steal;
};
