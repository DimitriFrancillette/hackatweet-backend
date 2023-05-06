const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
  description: String,
  likes: number,
  hashtag: { type: mongoose.Schema.Types.ObjectId, ref: 'hashtags' },
});

const Tweet = mongoose.model('tweets', tweetSchema);

module.exports = Tweet;