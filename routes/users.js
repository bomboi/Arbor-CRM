const router = require('express').Router();
const User = require('../models/User');
const { logId } = require('../utils');

router.get('/get', (req, res) => {
    if(req.session.user !== undefined) {
        User.findOne({_id : req.session.user})
            .select(['-_id', '-password'])
            .exec((err, user) => {
                console.log(logId(req), user)
                res.send(user);
            })
    }
    else res.sendStatus(403);
})

module.exports = router;