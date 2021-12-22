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

// Khi thay đổi thì sẽ tạo newCode: "value"
// Hàm này có thể update districtCode, districtName, hasAccount, quantity khi có dữ gửi đến (1, 2, hoặc cả 3)
router.post("/:districtId", async (req, res) => {
    const districtId = req.params.districtId; 
    // Kiểm tra và sửa đổi id_district
    if (req.body.newName !== null) {
        const newName = req.body.newName;
        await District.update({
            district_name: newName
        },
        {where: {id_district: districtId}});
    };
    if (req.body.newCode !== null) {
      const newCode = req.body.newCode;
      await District.update({
          id_district: newCode
      },
      {where: {id_district: districtId}});
    };
    if (req.body.hasAccount !== null) {
        const newHasAccount = req.body.hasAccount;
        await District.update({
            hasAccount: newHasAccount
        },
        {where: {id_district: districtId}});
    }
    if (req.body.quantity !== null) {
      const quantity = req.body.quantity;
      await District.update({
          quantity_district: quantity
      },
      {where: {id_district: districtId}});
    }
    res.json("Update successfully");
  });

module.exports = router;