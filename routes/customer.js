const router = require('express').Router();
const Customer = require('./../models/Customer');
const { logId } = require('../utils');

router.get('/all', (req, res) => {
    Customer.find({}, (err, customers) => {
        res.status(200).send(customers)
    })
})

router.post('/add', (req, res) => {
    Customer.find({name: {'$regex': req.body.name, '$options': 'i'}}, (error, result) => {
        if(error == null && result.length == 0) {
            let customer = new Customer();
            customer.name = req.body.name;
            // let address = {
            //     street: req.body.street,
            //     floor: req.body.
            // }
            // customer.address = address;
            customer.phone = req.body.phone;
            customer.save();
            res.status(200).send(customer);
        }
        else res.sendStatus(400);
    })
})

module.exports = router;