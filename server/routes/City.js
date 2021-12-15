const express = require('express');
const router = express.Router();
const {City} = require('../models')

const db = require("../models");

router.get("/", async (req, res) => {
    const listCity = await City.findAll({
        attributes: ['id_city', 'city_name', 'quantity_city', 'hasAccount']
    });
    res.json(listCity);
})


// Them moi mot thanh pho
router.post("/", async (req, res) => {
    const { cityName, cityCode } = req.body;
    City.create({
        id_city: cityCode,
        city_name: cityName,
        hasAccount: false,
        quantity_city: 0
    });
    res.json("SUCCESS");
  });


// Khi thay đổi thì sẽ tạo newCode: "value"
// Hàm này có thể update cityCode, cityName, hasAccount khi có dữ gửi đến (1, 2, hoặc cả 3)
router.post("/:cityId", async (req, res) => {
    const cityId = req.params.cityId; 
    // Kiểm tra và sửa đổi id_city
    if (req.body.newName !== null) {
        const newName = req.body.newName;
        await City.update({
            city_name: newName
        },
        {where: {id_city: cityId}});
    };
    if (req.body.newCode !== null) {
      const newCode = req.body.newCode;
      await City.update({
          id_city: newCode
      },
      {where: {id_city: cityId}});
    };
    if (req.body.hasAccount !== null) {
        const newHasAccount = req.body.hasAccount;
        await City.update({
            hasAccount: newHasAccount
        },
        {where: {id_city: cityId}});
    }
    res.json("Update successfully");
  });


  router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id);
    City.destroy({
      where: {
        id_city: id
      } 
    })
    res.send("SUCCESS")
  });

module.exports = router;