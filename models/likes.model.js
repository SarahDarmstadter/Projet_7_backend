module.exports = (sequelize, Sequelize) => {
    const Like = sequelize.define("likes", {
      nombreLike: {
        type: Sequelize.INTEGER,
        default: 0
      },
      
    });
  return Like;
};
  