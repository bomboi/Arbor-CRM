const router = require('express').Router();
const { logId } = require('../utils');
const Client = require('./../models/Client');
const User = require('./../models/User');
const Settings = require('./../models/Settings');
const Session = require('./../models/Session');
const isAuthenticated = require('../routes/auth').isAuthenticated;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

router.use(isAuthenticated);

router.get('/all', async (req, res) => {
    try {
        let clients = await Client.find({}).exec();
        console.info(logId(req), clients);
        res.status(200).send(clients);
    }
    catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
})

router.post('/add', async (req, res) => {
    try {
        let clients = await Client.find({username: {'$regex': req.body.username, '$options': 'i'}}).exec();
        if (clients.length == 0) {
            const session = await mongoose.startSession();
            session.startTransaction();

            // Creating the new client.
            let client = new Client();
            client.username = req.body.username;
            client.name = req.body.name;
            client.active = false;
            await client.save();

            // Creating default settings for the new client.
            let settings = new Settings();
            settings.defaultDeadlineStart = 10;
            settings.defaultDeadlineEnd = 20;
            settings.defaultOrderNote = '';
            settings.defaultCompanyInfo = '';
            settings.defaultProductDiscount = 10;
            settings.currentNumberOfMonthlyOrders = 0;
            settings.clientId = client._id;
            await settings.save();

            // Creating new admin user for the new client.
            let user = new User();
            user.username = req.body.username + '_admin';
            user.firstName = 'Admin';
            user.lastName = 'Account';
            user.role = 'admin';
            user.active = true;
            user.clientId = client._id;
            let salt = await bcrypt.genSalt(12);
            let hash = await bcrypt.hash('password', salt);
            user.password = hash;
            await user.save();

            await session.commitTransaction();
            session.endSession();

            res.status(200).send(client);

        }
        else res.sendStatus(400);
    }
    catch (err) {
        console.log(logId(req), err);
        res.sendStatus(400);
    }
})

router.post('/delete', async (req, res) => {
    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        let client = await Client.findOne({username: {'$regex': req.body.username, '$options': 'i'}}).exec();
        await User.deleteMany({clientId: client._id}).exec();
        await Settings.deleteMany({clientId: client._id}).exec();
        await Client.deleteOne({_id: client._id}).exec();

        await session.commitTransaction();
        session.endSession();

        res.sendStatus(200);
    }
    catch (err) {
        console.log(logId(req), err);
        res.sendStatus(400);
    }
})

router.post('/set-active', async (req, res) => {
    try {
        let client = await Client.findOne({username: req.body.username}).exec();
        console.log(req.body.username)
        if (client) {
            client.active = req.body.active
            await client.save();
            if (!req.body.active){
                let sessions = await Session.deleteMany({'session.clientId': client._id}).exec();
            }
            res.sendStatus(200);
        }
        else res.sendStatus(400);
    }
    catch (err) {
        console.log(logId(req), err);
        res.sendStatus(400);
    }
})

module.exports = router;