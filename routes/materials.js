const router = require('express').Router();
const User = require('../models/User');
const Material = require('../models/Material')
const isAuthenticated = require('../routes/auth').isAuthenticated;

router.use(isAuthenticated);

router.get('/producers', async (req, res) => {
    console.log(req.query)
    // const regex = req.query+'/i';
    Material.find({producer: { "$regex": req.query.value, "$options": "i" }},
        (err, materials) => {
            console.log(err)
            console.log(materials)
            res.send(materials.map(res=>res.producer))
    })
})

router.post('/producers/save', async (req, res) => {
    console.log(req.body)
    // TODO: Do not save if it exists
    Material.find({producer: { "$regex": req.query.value, "$options": "i" }},
        (err, materials) => {
            console.log(err)
            console.log(materials)
            if(err == null && materials.length == 0) {
                let material = new Material();
                material.producer = req.query.value;
                material.names = [];
                material.save();
                res.sendStatus(200)
            }
            else {
                res.sendStatus(400)
            }
    })
})

router.get('/names', async (req, res) => {
    const regex = { names: { $regex: req.query.name, $options: "i" } };
    if(req.query.producer != undefined) {
        regex['producer'] = { "$regex": req.query.producer, "$options": "i" }
    }
    console.log(req.query)
    Material.find(regex, (err, materials) => {
        console.log(err)
        console.log(materials)
        if(materials.length != 0) {
            materials.forEach(material => material.names.filter(name=>name.startsWith(req.query.name)));
            res.send(materials)
        }
        else res.send([])
    })
})

router.post('/name/save', async (req, res) => {
    if(req.query.producer === '') res.sendStatus(400)
    const regex = { producer: { "$regex": req.query.producer, "$options": "i" } };
    Material.find({ producer: { $regex: req.body.producer, $options: "i" } }, (err, materials) => {
        console.log('error: ' + err)
        // console.log(materials)
        if(err == null && materials.length != 0) {
            let material = materials[0];
            if(material.names == undefined) material.names = [];
            material.names.push(req.body.name);
            material.save();
            res.sendStatus(200);
        }
        else {
            res.sendStatus(400)
        }
    })
})

module.exports = router;