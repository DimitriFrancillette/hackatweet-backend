const express = require('express');
const router = express.Router();
const {getTweets, addTweet, deleteTweet, addLike, removeLike} = require('../controller/tweetController');


router.get('/', getTweets);
router.post('/', addTweet);
router.delete('/:id', deleteTweet);
router.patch('/like/:id', addLike);
router.patch('/unlike/:id', removeLike);

module.exports = router;