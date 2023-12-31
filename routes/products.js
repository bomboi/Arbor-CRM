const router = require('express').Router();
const User = require('../models/User');
const Product = require('../models/Product')
const multer  = require('multer');
const upload = multer();
const { logId } = require('../utils');

const mongoose = require('mongoose');
const isAuthenticated = require('../routes/auth').isAuthenticated;

router.use(isAuthenticated);

router.get('/all', async (req, res) => {
    try {
        let products = await Product.find({clientId: req.session.clientId}).sort({category: -1}).exec();

        res.status(200);
        res.send(products);
    }
    catch(error) {
        console.log(logId(req), error);
        res.status(500);
        res.send(error.message);
    }
})

router.post("/upload-prices", upload.single('prices'), async (req, res) => {
    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        let result = await Product.deleteMany({clientId: req.session.clientId}).exec();
        if(result.deletedCount == 0) res.status(500).send("Ovaj proizvod je obrisan!");
        console.log(logId(req), "Svi proizvodi su obrisani!");

        const rows = req.file.buffer.toString('utf-8').split('\n');
        for(let row of rows) {
            const items = row.split(";");
            var product = new Product();
            product.productName = items[0];
            product.price = parseFloat(items[1]);
            product.discountedPrice = parseFloat(items[2]);
            product.secondDiscountedPrice = parseFloat(items[3]);
            product.category = items[4];
            product.clientId = req.session.clientId;
            await product.save();
        }

        console.log(logId(req), "Svi proizvodi su dodati!")

        await session.commitTransaction();
        session.endSession();

        res.status(200);
        res.send("Upload complete!");
    }
    catch(error) {
        console.log(logId(req), error);
        res.status(500);
        res.send(error.message);
    }
});

router.post('/add', async (req, res) => {
    Product.find({clientId: req.session.clientId, productName: { "$regex": req.body.name, "$options": "i" }}, (err, products) => {
            console.log(logId(req), err)
            console.log(logId(req), products)
            if(err == null && products.length == 0) {
                let product = new Product();
                product.productName = req.body.name;
                product.price = req.body.price;
                product.discountedPrice = req.body.discountedPrice;
                product.clientId = req.session.clientId;
                product.save(err=>console.log(logId(req), err));
                res.status(200).send(product)
            }
            else {
                res.sendStatus(400)
            }
    })
})

router.post('/delete', async (req, res) => {
    try {
        let result = await Product.deleteMany({_id: {$in: req.body}}).exec();
        if(result.deletedCount == 0) res.status(500).send("Ovaj proizvod je obrisan!");
        res.sendStatus(200);
    }
    catch(error) {
        res.status(500).send(error.message);
    }
})

router.post('/update', async (req, res) => {
    Product.find({_id: req.body._id}, (err, products) => {
            console.log(logId(req), err)
            console.log(logId(req), products)
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