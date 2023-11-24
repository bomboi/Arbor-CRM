const router = require('express').Router();
const isAuthenticated = require('../routes/auth').isAuthenticated;
const Order = require('../models/Order');
const date_fns = require('date-fns');
const { logId } = require('../utils');

router.use(isAuthenticated);

router.get('/get', async (req, res) => {
    let today = new Date();
    let beginning = new Date(today.getFullYear(), today.getMonth(), 1);
    let prevMonthBeginning = date_fns.subMonths(beginning, 1);
    let twoYearsAgo = date_fns.subYears(beginning, 2);

    const orderCount = await Order.aggregate([
        { 
            $match: {
                $expr: {
                    $and: [
                        { $gt: ['$latestVersionDate', beginning] },
                        { $lt: ['$latestVersionDate', today] }
                    ]
                }
            }
        },
        {
            $group: {
                _id: { month: { $month: '$latestVersionDate' }},
                total: { $sum: 1 },
                price: { $sum: '$totalAmount' }
            }
        }
    ]).exec();

    const orderCountLastMonth = await Order.aggregate([
        { 
            $match: {
                $expr: {
                    $and: [
                        { $gt: ['$latestVersionDate', prevMonthBeginning] },
                        { $lt: ['$latestVersionDate', beginning] }
                    ]
                }
            }
        },
        {
            $group: {
                _id: { month: { $month: '$latestVersionDate' }},
                total: { $sum: 1 },
                price: { $sum: '$totalAmount' }
            }
        }
    ]).exec();

    const ordersPerMonth = await Order.aggregate([
        { 
            $match: {
                $expr: {
                    $and: [
                        { $gt: ['$latestVersionDate', twoYearsAgo] },
                        { $lt: ['$latestVersionDate', today] }
                    ]
                }
            }
        },
        {
            $group: {
                _id: { mesec: { $month: '$latestVersionDate'}, godina: { $year: '$latestVersionDate' }},
                brPorudz: { $sum: 1 },
                promet: { $sum: '$totalAmount' }
            }
        },
        {
            $sort: { "_id.godina": 1, "_id.mesec": 1 }
        }
    ]).exec();
    
    console.log(logId(req), orderCountLastMonth)
    res.status(200).send({
        orderCount: orderCount.length == 0 ? 0 : orderCount[0].total,
        orderPrice: orderCount.length == 0 ? 0 : orderCount[0].price,
        orderCountLastMonth: orderCountLastMonth.length == 0 ? 0 : orderCountLastMonth[0].total,
        orderPriceLastMonth: orderCountLastMonth.length == 0 ? 0 : orderCountLastMonth[0].price,
        ordersPerMonth: ordersPerMonth
    });
})



module.exports = router;