module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define("post", {
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true
      }, 
    })
    return Post
};
  