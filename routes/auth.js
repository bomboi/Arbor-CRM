const router = require('express').Router();
const User = require('../models/User');
const Client = require('../models/Client');
const Session = require('../models/Session')
const bcrypt = require('bcrypt');
const { logId } = require('../utils');

const isAuthenticated = async (req, res, next) => {
    if(req.session.user != undefined) next();
    else res.sendStatus(401);
}

router.get('/authenticated', async (req, res) => {
    console.log(logId(req), 'authenticate')
    if(req.session.user != undefined) res.sendStatus(200)
    else res.sendStatus(401);
})

// TODO: generic adding
router.post('/register', async (req, res) => {
    const user = new User(req.body);
    // TODO: Check if the user exists.
    try {
        const saved = await user.save();
        res.status(200).send(saved);
    }
    catch(err) {
        res.status(400).send(err);
    }
})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({'username': req.body.username}).exec();
        if(user) {
            let client = await Client.findOne({_id: user.clientId}).exec();
            if (!(user.role == 'superadmin' || client.active)) res.sendStatus(401);
            else {
                bcrypt.compare(req.body.password, user.password, function(err, result) {
                    if(err) {
                        console.log(logId(req), err);
                        res.sendStatus(500);
                    }
                    else if(result) {
                        req.session.user = user._id;
                        req.session.clientId = user.clientId;
                        res.sendStatus(200);
                    }
                    else {
                        res.status(500);
                        res.send("Uneta sifra je pogresna.");
                    }
                });
            }
        }
    }
    catch (error) {
        console.error(logId(req), error);
        res.sendStatus(401);
    }
})

router.get('/logout', async (req, res) => {
    console.log(logId(req), req.session.id)
    try{
        req.session.destroy();
        res.sendStatus(200);
    }
    catch (error) {
        console.error(logId(req), error);
        res.sendStatus(500);
    }
})

exports.router = router;
exports.isAuthenticated = isAuthenticated;