const router = require('express').Router();
const isAuthenticated = require('../routes/auth').isAuthenticated;
const Order = require('../models/Order');

router.use(isAuthenticated);

router.get('/get', async (req, res) => {
    let today = new Date();
    let beginning = new Date(today.getFullYear(), today.getMonth(), 1);
    let prevMonthBeginning = new Date(today.getFullYear(), today.getMonth() - 1, 1);

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

    res.status(200).send({
        orderCount: orderCount.length == 0 ? 0 : orderCount[0].total,
        orderPrice: orderCount.length == 0 ? 0 : orderCount[0].price,
        orderCountLastMonth: orderCountLastMonth.length == 0 ? 0 : orderCountLastMonth[0].total,
        orderPriceLastMonth: orderCountLastMonth.length == 0 ? 0 : orderCountLastMonth[0].price
    });
})

// const orderCountLastMonth = await Order.aggregate([
//     { 
//         $match: {
//             $expr: {
//                 $and: [
//                     { $gt: ['$latestVersionDate', prevMonthBeginning] },
//                     { $lt: ['$latestVersionDate', today] }
//                 ]
//             }
//         }
//     },
//     {
//         $group: {
//             _id: { mesec: { $month: '$latestVersionDate'}, godina: { $year: '$latestVersionDate' }},
//             brPorudz: { $sum: 1 },
//             promet: { $sum: '$totalAmount' }
//         }
//     },
//     {
//         $sort: { "_id.godina": 1, "_id.mesec": 1 }
//     }
// ]).exec();

// console.log(orderCountLastMonth)


module.exports = router;