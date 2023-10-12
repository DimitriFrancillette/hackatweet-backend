const Tweet = require('../models/tweet');
const { checkBody } = require('../modules/checkBody');
const moment = require('moment');

const getTweets = async (req, res) => {
    try {
        await Tweet.find().populate('user').then(data => {
            res.json(data);
        })
    } catch (error) {
        return res.json({ result: false, error });
    }
};

const addTweet = async (req, res) => {
    if (!checkBody(req.body, ['description'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return;
    }

    try {
        const date = moment().format();

        const newTweet = new Tweet({
            description: req.body.description,
            likes: [],
            postedTime: date,
            user: req.body.user,
        });

        await newTweet.save().then(newDoc => {
            res.json({ result: true, newTweet });
        })

    } catch (error) {
        return res.json({ result: false, error });
    }
};

const deleteTweet = async (req, res) => {
    const { id } = req.params;

    try {
        await Tweet.deleteOne({ _id: id }).then(data => {
            if (data.deletedCount === 0) {
                res.json({ result: false, error: "Tweet not found" });
            } else {
                res.json({ result: true, data });
            }
        })
    } catch (error) {
        return res.json({ result: false, error });
    }
};


const addLike = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    let previousArray = [];

    try {
        await Tweet.findOne({ _id: id }).then(data => {
            previousArray = data.likes

            let newArray = [...previousArray, userId]

            Tweet.updateOne({ _id: id }, { likes: newArray }).then(data => {
                if (data.acknowledged === false) {
                    res.json({ result: false, error: "modification failed" });
                } else {
                    res.json({ result: true, newArray });
                }
            })
        })

    } catch (error) {
        return res.json({ result: false, error });
    }
};


const removeLike = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    let previousArray = [];

    try {
        await Tweet.findOne({ _id: id }).then(data => {
            previousArray = data.likes;

            let newArray = previousArray.filter(e => e !== userId);

            Tweet.updateOne({ _id: id }, { likes: newArray }).then(data => {
                if (data.acknowledged === false) {
                    res.json({ result: false, error: "modification failed" });
                } else {
                    res.json({ result: true, newArray });
                }
            })
        }).catch(err => {
            res.json({ error: "Tweet id not valid", err });
        });

    } catch (error) {
        return res.json({ result: false, error });
    }


};

module.exports = {
    getTweets,
    addTweet,
    deleteTweet,
    addLike,
    removeLike
};