const router = require('express').Router();
const isAuthenticated = require('../routes/auth').isAuthenticated;
const Settings = require('../models/Settings');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { logId } = require('../utils');

router.use(isAuthenticated);

function compareAsync(param1, param2) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(param1, param2, function(err, res) {
            if (err) {
                 reject(err);
            } else {
                console.log(logId(req), res);
                 resolve(res);
            }
        });
    });
}

router.get('/order-defaults', async (req, res) => {
    try {
        const defaults = await Settings.find({clientId: req.session.clientId}).exec();
        console.log(logId(req), data)
        res.status(200).send(data);
    }
    catch(error) {
        console.log(logId(req), error)
        res.status(500);
        res.send(error.message);
    }
})

router.get('/default-deadline', async (req, res) => {
    try {
        const defaults = await Settings.findOne({clientId: req.session.clientId}).exec();
        
        res.status(200);
        res.send({defaultDeadlineTo: defaults.defaultDeadlineEnd, defaultDeadlineFrom: defaults.defaultDeadlineStart});
    }
    catch(error) {
        console.log(logId(req), error)
        res.status(500);
        res.send(error.message);
    }
})

router.post('/default-deadline', async (req, res) => {
    try{
        const defaults = await Settings.findOne({clientId: req.session.clientId}).exec();
    
        defaults.defaultDeadlineStart = req.body.from;
        defaults.defaultDeadlineEnd = req.body.to;
        await defaults.save();
    
        res.sendStatus(200);
    }
    catch(error) {
        console.log(logId(req), error)
        res.status(500);
        res.send(error.message);
    }
})

router.get('/company-info', async (req, res) => {
    try {
        const defaults = await Settings.findOne({clientId: req.session.clientId}).exec();
        
        res.status(200).send(defaults.defaultCompanyInfo);
    }
    catch(error) {
        console.log(logId(req), error)
        res.status(500);
        res.send(error.message);
    }
})

router.post('/company-info', async (req, res) => {
    try {
        const defaults = await Settings.findOne({clientId: req.session.clientId}).exec();
    
        defaults.defaultCompanyInfo = req.body.text;
        await defaults.save();
    
        res.sendStatus(200);
    }
    catch(error) {
        console.log(logId(req), error)
        res.status(500);
        res.send(error.message);
    }
})

router.post('/change-password', async (req, res) => {
    try {
        let user = await User.findOne({_id: req.session.user}).exec();
        console.log(logId(req), user);
        const result = await bcrypt.compare(req.body.old, user.password);
        console.log(logId(req), result);
        if(result) {
            let salt = await bcrypt.genSalt(12);
            let hash = await bcrypt.hash(req.body.new, salt);
            user.password = hash;
            await user.save();
            res.sendStatus(200);
        }
        else {
            res.status(500);
            res.send("Stara sifra je pogresna!");
        }
    }
    catch(error) {
        console.log(logId(req), error)
        res.status(500);
        res.send(error.message);
    }
})

router.get('/order-note', async (req, res) => {
    try {
        const defaults = await Settings.findOne({clientId: req.session.clientId}).exec();
        
        res.status(200).send(defaults.defaultOrderNote);
    }
    catch(error) {
        console.log(logId(req), error)
        res.status(500);
        res.send(error.message);
    }
})

router.post('/order-note', async (req, res) => {
    try {
        const defaults = await Settings.findOne({clientId: req.session.clientId}).exec();
    
        defaults.defaultOrderNote = req.body.text;
        await defaults.save();
    
        res.sendStatus(200);
    }
    catch(error) {
        console.log(logId(req), error)
        res.status(500);
        res.send(error.message);
    }
})

module.exports = router;