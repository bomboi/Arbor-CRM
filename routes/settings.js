const router = require('express').Router();
const isAuthenticated = require('../routes/auth').isAuthenticated;
const Setting = require('../models/Settings');

router.use(isAuthenticated);

router.get('/order-defaults', async (req, res) => {
    const defaults = await Setting.find({name: {$in: ['DefaultDeadlineTo', 'DefaultDeadlineFrom', 'DefaultCompanyInfo', 'DefaultOrderNote']}}).exec();
    const reducer = (acc, value) => { acc[value.name] = value.value; return acc};
    const data = defaults.reduce(reducer, {})
    console.log(data)
    res.status(200).send(data);

})

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

router.get('/company-info', async (req, res) => {
    const info = await Setting.findOne({name: 'DefaultCompanyInfo'}).exec();
    res.status(200).send(info.value);
})

router.post('/company-info', async (req, res) => {
    const info = await Setting.findOne({name: 'DefaultCompanyInfo'}).exec();
    info.value = req.body.text;
    info.save();
    res.sendStatus(200);
})

router.get('/order-note', async (req, res) => {
    const note = await Setting.findOne({name: 'DefaultOrderNote'}).exec();
    res.status(200).send(note.value);
})

router.post('/order-note', async (req, res) => {
    const note = await Setting.findOne({name: 'DefaultOrderNote'}).exec();
    note.value = req.body.text;
    note.save();
    res.sendStatus(200);
})

module.exports = router;