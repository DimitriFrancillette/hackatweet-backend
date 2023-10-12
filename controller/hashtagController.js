const Hashtag = require('../models/hashtag');


const getHashtags = async (req, res) => {
    try {
        await Hashtag.find().populate({
            path: 'tweet',
            populate: {
                path: 'user'
            }
        }).then(data => {
            res.json(data);
        })
    } catch (error) {
        return res.json({ result: false, error });
    }
};


const addHashtag = async (req, res) => {
    const { name, tweetId } = req.body;

    try {
        await Hashtag.findOne({ name }).then(data => {
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
        })

    } catch (error) {
        return res.json({ result: false, error });

    }


};

// REMOVE A HASHTAG TWEET

const removeHashtag = async (req, res) => {
    const { name, tweetId } = req.body;

    try {
        await Hashtag.findOne({ name }).then(data => {
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
        })

    } catch (error) {
        return res.json({ result: false, error });
    }
};

module.exports = {
    getHashtags,
    addHashtag,
    removeHashtag
};