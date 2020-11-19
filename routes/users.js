const router = require('express').Router();
const User = require('../models/User');

router.get('/get', (req, res) => {
    if(req.session.user !== undefined) {
        User.findOne({_id : req.session.user})
            .select(['-_id', '-password'])
            .exec((err, user) => {
                console.log(user)
                res.send(user);
            })
    }
    else res.sendStatus(403);
})

module.exports = router;