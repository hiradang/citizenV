const express = require('express');
const router = express.Router();
const {District} = require('../models')

router.get("/", async (req, res) => {
    const listDistrict = await District.findAll({
        attributes: ['id_district', 'district_name', 'quantity_district', 'hasAccount']
    });
    res.json(listDistrict);
})

router.get("/:idCity", async (req, res) => {
    const id_city = req.params.idCity
    const listDistrict = await District.findAll({
        where: {id_city : id_city},
        attributes: ['id_district', 'district_name', 'quantity_district', 'hasAccount']
    });
    res.json(listDistrict);
})

module.exports = router;