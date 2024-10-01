const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
  description: String,
  likes: [String],
  postedTime: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
});

const Tweet = mongoose.model('tweets', tweetSchema);

module.exports = Tweet;