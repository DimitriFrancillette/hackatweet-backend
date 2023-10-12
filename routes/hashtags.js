const express = require('express');
const router = express.Router();
const {getHashtags, addHashtag, removeHashtag} = require('../controller/hashtagController');


router.get('/', getHashtags);
router.post('/', addHashtag);
router.delete('/', removeHashtag);

module.exports = router;