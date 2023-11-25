const router = require('express').Router();
const { logId } = require('../utils');
const Client = require('./../models/Client');
const Session = require('./../models/Session');
const isAuthenticated = require('../routes/auth').isAuthenticated;

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
            let client = new Client();
            client.username = req.body.username;
            client.name = req.body.name;
            client.active = false;
            await client.save();
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
        await Client.deleteOne({username: {'$regex': req.body.username, '$options': 'i'}}).exec();
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
                // for(session of sessions) {
                //     req.session.destroy(session._id);
                // }
                // console.log('ss')
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