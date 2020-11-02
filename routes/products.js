const router = require('express').Router();
const User = require('../models/User');
const Product = require('../models/Product')
const isAuthenticated = require('../routes/auth').isAuthenticated;

router.use(isAuthenticated);

router.get('/all', async (req, res) => {
    Product.find({}, (err, products) => {
            console.log(err)
            console.log(products)
            res.status(200).send(products)
    })
})

router.post('/add', async (req, res) => {
    Product.find({productName: { "$regex": req.body.name, "$options": "i" }}, (err, products) => {
            console.log(err)
            console.log(products)
            if(err == null && products.length == 0) {
                let product = new Product();
                product.productName = req.body.name;
                product.price = req.body.price;
                product.save(err=>console.log(err));
                res.status(200).send(product)
            }
            else {
                res.sendStatus(400)
            }
    })
})

router.post('/update', async (req, res) => {
    Product.find({_id: req.body._id}, (err, products) => {
            console.log(err)
            console.log(products)
            if(err == null && products.length == 0) {
                res.sendStatus(400)
            }
            else {
                let product = products[0];
                product.productName = req.body.productName;
                product.price = req.body.price;
                // calculate discountedPrice
                if(req.body.materialLength) product.materialLength = req.body.materialLength; 
                if(req.body.category) product.category = req.body.category;  
                product.save();
                res.sendStatus(200);

            }
    })
})

module.exports = router;