const router = require('express').Router();
const User = require('../models/User');
const { logId } = require('../utils');
const isAuthenticated = require('../routes/auth').isAuthenticated;
const bcrypt = require('bcrypt');

router.use(isAuthenticated);

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

router.get('/all', async (req, res) => {
    if(req.session.user !== undefined) {
        let users = await User.find({clientId: req.session.clientId, deleted: false}).exec();

        res.status(200).send(users);
    }
    else res.sendStatus(403);
})

router.post('/add', async (req, res) => {
    try {
        let users =  await User.find({clientId: req.session.clientId, username: { "$regex": req.body.username, "$options": "i" }}).exec();
        if(users.length == 0) {
            let user = User();
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.username = req.body.username;
            user.role = req.body.role;
            user.active = true;
            let salt = await bcrypt.genSalt(12);
            let hash = await bcrypt.hash('password', salt);
            user.password = hash;
            user.clientId = req.session.clientId;
    
            await user.save();
            res.status(200).send(user);
        }
        else {
            res.sendStatus(500);
        }
    }
    catch (error) {
        console.log(logId(req), error);
        res.sendStatus(500);
    }
})

router.post('/update', async (req, res) => {
    try {
        let user =  await User.findOne({clientId: req.session.clientId, _id: req.body._id}).exec();
        if(user) {
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.username = req.body.username;
            user.role = req.body.role;
    
            await user.save();
            res.status(200).send(user);
        }
        else {
            res.sendStatus(500);
        }
    }
    catch (error) {
        console.log(logId(req), error);
        res.sendStatus(500);
    }
})

router.post('/set-active', async (req, res) => {
    try {
        let user =  await User.findOne({clientId: req.session.clientId, _id: req.body._id}).exec();
        if(user) {
            user.active = req.body.active == 'true';
    
            await user.save();
            res.status(200).send(user);
        }
        else {
            res.sendStatus(500);
        }
    }
    catch (error) {
        console.log(logId(req), error);
        res.sendStatus(500);
    }
})

router.post('/delete', async (req, res) => {
    try {
        let user =  await User.findOne({clientId: req.session.clientId, _id: req.body.id}).exec();
        if(user) {
            user.deleted = true;
            user.active = false;
    
            await user.save();
            res.status(200).send(user);
        }
        else {
            res.sendStatus(500);
        }
    }
    catch (error) {
        console.log(logId(req), error);
        res.sendStatus(500);
    }
})

module.exports = router;