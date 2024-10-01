const User = require('../models/user');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

const signUpUser = async (req, res) => {
    if (!checkBody(req.body, ['firstname', 'username', 'password'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return;
    }

    try {
        // Check if the user has not already been registered
        await User.findOne({ username: req.body.username }).then(data => {
            if (data === null) {
                const hash = bcrypt.hashSync(req.body.password, 10);

                const newUser = new User({
                    firstname: req.body.firstname,
                    username: req.body.username,
                    password: hash,
                    token: uid2(32),
                });

                newUser.save().then(newDoc => {
                    res.json({ result: true, firstname: newDoc.firstname, username: newDoc.username, token: newDoc.token, userId: newDoc._id });
                });
            } else {
                // User already exists in database
                res.json({ result: false, error: 'User already exists' });
            }
        });

    } catch (error) {
        return res.json({ result: false, error });
    }

};

//SIGN IN AS A USER
const signInUser = async (req, res) => {
    if (!checkBody(req.body, ['username', 'password'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return;
    }

    try {
        await User.findOne({ username: req.body.username }).then(data => {
            if (data && bcrypt.compareSync(req.body.password, data.password)) {
                res.json({ result: true, firstname: data.firstname, username: data.username, token: data.token, userId: data._id });
            } else {
                res.json({ result: false, error: 'User not found or wrong password' });
            }
        })

    } catch (error) {
        return res.json({ result: false, error });

    }


};

module.exports = {
    signUpUser,
    signInUser
};