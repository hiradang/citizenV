const express = require('express');
const router = express.Router();
const {Ward} = require('../models')

router.get("/", async (req, res) => {
    const listWard = await Ward.findAll({
        attributes: ['id_ward', 'ward_name', 'quantity_ward', 'hasAccount']
    });
    res.json(listWard);
})

router.get("/:idDistrict", async (req, res) => {
    const id_district = req.params.idDistrict
    const listWard = await Ward.findAll({
        where: {id_district : id_district},
        attributes: ['id_ward', 'ward_name', 'quantity_ward', 'hasAccount']
    });
    res.json(listWard);
})

module.exports = router;