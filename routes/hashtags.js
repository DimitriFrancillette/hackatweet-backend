const express = require('express');
const router = express.Router();
const Hashtag = require('../models/hashtag');

// GET ALL HASHTAGS
router.get('/', (req, res) => {
    Hashtag.find().then(data => {
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


module.exports = router;
