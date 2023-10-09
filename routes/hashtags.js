const express = require('express');
const router = express.Router();
const Hashtag = require('../models/hashtag');

// GET ALL HASHTAGS
router.get('/', (req, res) => {
    Hashtag.find().populate({
        path: 'tweet',
        populate: {
            path: 'user'
        }
    }).then(data => {
        res.json(data);
    })
});


// ADD A HASHTAG TWEET
router.post('/', (req, res) => {
    const { name, tweetId } = req.body;

    Hashtag.findOne({ name }).then(data => {
        if (data === null) {
            const newHashtag = new Hashtag({
                name: name,
                tweet: [tweetId],
            });

            newHashtag.save().then(hashtag => {
                res.json({ result: true, hashtag });
            })
            return;
        }

        let newTweetArray = data.tweet;
        const isInArray = newTweetArray.includes(tweetId);

        if (isInArray) {
            res.json({ result: false, message: "tweet already has this hashtag" });
            return
        }

        newTweetArray.push(tweetId);

        Hashtag.updateOne({ _id: data._id }, { tweet: newTweetArray }).then(newData => {
            if (newData.acknowledged === false) {
                res.json({ result: false, error: "modification failed" });
            } else {
                res.json({ result: true, newData, newTweetArray });
            }
        })
    }).catch(err => {
        res.json({ error: "hashtag name is not valid", err });
    });
});

// REMOVE A HASHTAG TWEET
router.delete('/', (req, res) => {
    const { name, tweetId } = req.body;

    Hashtag.findOne({ name }).then(data => {
        if (data !== null) {
            const isInArray = data.tweet.includes(tweetId);

            if (isInArray && data.tweet.length > 1) {
                Hashtag.updateOne({ _id: data._id }, { $pull: { tweet: tweetId } }).then(newData => {
                    if (newData.modifiedCount === 0) {
                        res.json({ result: false, error: "modification failed" });
                    } else {
                        res.json({ result: true, newData });
                    }
                });
                return
            }

            if (isInArray && data.tweet.length < 2) {
                Hashtag.deleteOne({ _id: data._id }).then(data => {
                    if (data.deletedCount === 0) {
                        res.json({ result: false, error: "no hashtag found to delete" });
                    } else {
                        res.json({ result: true, data });
                    }
                })
                return
            }

            res.json({ result: false, error: "this hastag is not in the tweet" });
            return
        }
        res.json({ result: false, error: "no hashtag found" });

    }).catch(err => {
        res.json({ error: "hashtag name is not valid", err });
    });

});

module.exports = router;