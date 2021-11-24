const express = require('express');
const router = express.Router();
const {City} = require('../models')

router.get("/", async (req, res) => {
    const listCity = await City.findAll();
    res.json(listCity);
})

module.exports = router;