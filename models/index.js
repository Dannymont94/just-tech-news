const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');
const Comment = require('./Comment');

// create associations
// one user can make many posts
User.hasMany(Post, {
  foreignKey: 'user_id'
});

// posts are made by only one user
Post.belongsTo(User, {
  foreignKey: 'user_id'
});

User.belongsToMany(Post, {
  through: Vote,
  as: 'voted_posts',
  foreignKey: 'user_id'
});

Post.belongsToMany(User, {
  through: Vote,
  as: 'voted_posts',
  foreignKey: 'post_id'
});

// By also creating one-to-many associations directly between these models, we can perform aggregated SQL functions between models
// In this case, we'll see a total count of votes for a single post when queried
Vote.belongsTo(User, {
  foreignKey: 'user_id',
});

Vote.belongsTo(Post, {
  foreignKey: 'post_id'
});

User.hasMany(Vote, {
  foreignKey: 'user_id'
});

Post.hasMany(Vote, {
  foreignKey: 'post_id'
});

Comment.belongsTo(User, {
  foreignKey: 'user_id'
});

Comment.belongsTo(Post, {
  foreignKey: 'post_id'
});

User.hasMany(Comment, {
  foreignKey: 'user_id'
});

Post.hasMany(Comment, {
  foreignKey: 'post_id'
});

module.exports = { User, Post, Vote, Comment };