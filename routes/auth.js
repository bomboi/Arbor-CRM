const router = require('express').Router();
const User = require('../models/User');
const Session = require('../models/Session')
const bcrypt = require('bcrypt');

const isAuthenticated = async (req, res, next) => {
    if(req.session.user != undefined) next();
    else res.sendStatus(401);
}

router.get('/authenticated', async (req, res) => {
    console.log('authenticate')
    if(req.session.user != undefined) res.sendStatus(200)
    else res.sendStatus(401);
})

router.post('/register', async (req, res) => {
    const user = new User({
        username: 'matija',
        firstName: 'Matija',
        lastName: 'Bojovic',
        password: 'password',
        role: 'admin'
    });
    try {
        const saved = await user.save();
        res.status(200).send(saved);
    }
    catch(err) {
        res.status(400).send(err);
    }
})

router.post('/login', async (req, res) => {
    console.log(req.session.id)
    const user = User.findOne({'username': req.body.username}, (err, user) => {
        if(err) {
            console.log(err);
            res.send(401);
        }
        console.log(user)
        if(user) {
            bcrypt.compare(req.body.password, user.password, function(err, result) {
                if(err) {
                    console.log(err);
                    res.send();
                }
                req.session.user = user._id;
                res.sendStatus(200);
            });
        }
    });
})

router.get('/logout', async (req, res) => {
    console.log(req.session.id)
    try{
        req.session.destroy();
        res.sendStatus(200)
    }
    catch {
        res.sendStatus(500)
    }
})

exports.router = router;
exports.isAuthenticated = isAuthenticated;