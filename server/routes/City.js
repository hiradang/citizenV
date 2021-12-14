const express = require('express');
const router = express.Router();
const {City} = require('../models')

const db = require("../models");

router.get("/", async (req, res) => {
    const listCity = await City.findAll({
        attributes: ['id_city', 'city_name', 'quantity_city', 'city_code']
    });
    res.json(listCity);
})


// Update các thứ về code dùng vào đây
// Khi delete code thì set newCode: null
// Khi thay đổi thì sẽ tạo newCode: "value"
router.post("/:cityId", async (req, res) => {
    const cityId = req.params.cityId;
    const newCode = req.body.newCode;
    await City.update({
        city_code: newCode
    },
    {where: {id_city: cityId}})
    res.json("Update successfully");
  });

module.exports = router;