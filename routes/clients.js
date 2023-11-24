const router = require('express').Router();
const { logId } = require('../utils');
const Client = require('./../models/Client');
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
        let clients = await Client.find({name: {'$regex': req.body.username, '$options': 'i'}}).exec();
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

router.post('/set-active', async (req, res) => {
    try {
        let client = await Client.findOne({name: {'$regex': req.body.username, '$options': 'i'}}).exec();
        if (client) {
            client.active = req.body.active
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

module.exports = router;