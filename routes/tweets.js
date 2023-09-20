const express = require('express');
const router = express.Router();
const Tweet = require('../models/tweet');
const { checkBody } = require('../modules/checkBody');
const moment = require('moment');


// GET ALL TWEETS
router.get('/', (req, res) => {
  Tweet.find().populate('user').then(data => {
    res.json(data);
  })

});

// ADD A TWEET IN DB
router.post('/', (req, res) => {
  if (!checkBody(req.body, ['description'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  const date = moment().format();

  const newTweet = new Tweet({
    description: req.body.description,
    likes: 0,
    postedTime: date,
    user: req.body.user,
  });

  newTweet.save().then(newDoc => {
    console.log(newDoc)
    res.json({ result: true });
  })

});

// REMOVE A TWEET FROM DB
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  Tweet.deleteOne({ _id: id }).then(data => {
    if (data.deletedCount === 0) {
      res.json({ result: false, error: "Tweet not found" });
    } else {
      res.json({ result: true, data});
    }
  }).catch(err => {
    res.json({ error: "This is not a valid id", err });
  });
});





module.exports = router;