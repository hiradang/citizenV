const express = require('express');
const router = express.Router();
const {City} = require('../models')

router.get("/", async (req, res) => {
    const listCity = await City.findAll({
        attributes: ['id_city', 'city_name', 'quantity_city']
    });
    res.json(listCity);
})

module.exports = router;