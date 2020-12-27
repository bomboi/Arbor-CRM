const router = require('express').Router();
const isAuthenticated = require('../routes/auth').isAuthenticated;
const Setting = require('../models/Settings');

router.use(isAuthenticated);

router.get('/default-deadline', async (req, res) => {
    const defaultDeadlineTo = await Setting.findOne({name: 'DefaultDeadlineTo'}).exec();
    const defaultDeadlineFrom = await Setting.findOne({name: 'DefaultDeadlineFrom'}).exec();
    res.status(200);
    res.send({defaultDeadlineTo: defaultDeadlineTo.value, defaultDeadlineFrom: defaultDeadlineFrom.value});
})

router.post('/default-deadline', async (req, res) => {
    const defaultDeadlineTo = await Setting.findOne({name: 'DefaultDeadlineTo'}).exec();
    const defaultDeadlineFrom = await Setting.findOne({name: 'DefaultDeadlineFrom'}).exec();
    defaultDeadlineTo.value = req.body.to;
    defaultDeadlineTo.save();
    defaultDeadlineFrom.value = req.body.from;
    defaultDeadlineFrom.save();
    res.sendStatus(200);
})

module.exports = router;