module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define("comment", {
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      image: {
        type: Sequelize.STRING,
      }
    });
  
    return Comment;
  };
  