const User = require('./User');
const Post = require('./Post');

// create associations
// one user can make many posts
User.hasMany(Post, {
  foreignKey: 'user_id'
});

// posts are made by only one user
Post.belongsTo(User, {
  foreignKey: 'user_id'
});

module.exports = { User, Post };