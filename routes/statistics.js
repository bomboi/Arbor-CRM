const router = require('express').Router();
const isAuthenticated = require('../routes/auth').isAuthenticated;
const Order = require('../models/Order');

router.use(isAuthenticated);

router.get('/get', async (req, res) => {
    const thisYear = await Order.aggregate([{ $group: {
        _id: { month:{$month: "$latestVersionDate"} , year: {$year: "$latestVersionDate"}},
        total: { $sum: 1 }
      }}]).exec();
    // const lastYear = await Order.and({latestVersionDate: {$gt: }})
    console.log(thisYear)
    res.status(200).send({
        first: thisYear
    });
})

module.exports = router;