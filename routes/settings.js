const router = require('express').Router();
const isAuthenticated = require('../routes/auth').isAuthenticated;
const Setting = require('../models/Settings');
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
    const defaults = await Setting.find({clientId: req.session.clientId, name: {$in: ['DefaultDeadlineTo', 'DefaultDeadlineFrom', 'DefaultCompanyInfo', 'DefaultOrderNote']}}).exec();
    const reducer = (acc, value) => { acc[value.name] = value.value; return acc};
    const data = defaults.reduce(reducer, {})
    console.log(logId(req), data)
    res.status(200).send(data);

})

router.get('/default-deadline', async (req, res) => {
    const defaultDeadlineTo = await Setting.findOne({clientId: req.session.clientId, name: 'DefaultDeadlineTo'}).exec();
    const defaultDeadlineFrom = await Setting.findOne({clientId: req.session.clientId, name: 'DefaultDeadlineFrom'}).exec();
    res.status(200);
    res.send({defaultDeadlineTo: defaultDeadlineTo.value, defaultDeadlineFrom: defaultDeadlineFrom.value});
})

router.post('/default-deadline', async (req, res) => {
    const defaultDeadlineTo = await Setting.findOne({clientId: req.session.clientId, name: 'DefaultDeadlineTo'}).exec();
    const defaultDeadlineFrom = await Setting.findOne({clientId: req.session.clientId, name: 'DefaultDeadlineFrom'}).exec();
    defaultDeadlineTo.value = req.body.to;
    defaultDeadlineTo.save();
    defaultDeadlineFrom.value = req.body.from;
    defaultDeadlineFrom.save();
    res.sendStatus(200);
})

router.get('/company-info', async (req, res) => {
    const info = await Setting.findOne({clientId: req.session.clientId, name: 'DefaultCompanyInfo'}).exec();
    res.status(200).send(info.value);
})

router.post('/company-info', async (req, res) => {
    const info = await Setting.findOne({clientId: req.session.clientId, name: 'DefaultCompanyInfo'}).exec();
    info.value = req.body.text;
    info.save();
    res.sendStatus(200);
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
    const note = await Setting.findOne({clientId: req.session.clientId, name: 'DefaultOrderNote'}).exec();
    res.status(200).send(note.value);
})

router.post('/order-note', async (req, res) => {
    const note = await Setting.findOne({clientId: req.session.clientId, name: 'DefaultOrderNote'}).exec();
    note.value = req.body.text;
    note.save();
    res.sendStatus(200);
})

module.exports = router;