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


// Khi thay đổi thì sẽ tạo newCode: "value"
// Hàm này có thể update wardCode, wardName, hasAccount, quantity khi có dữ gửi đến (1, 2, hoặc cả 3)
router.post("/:wardId", async (req, res) => {
    const wardId = req.params.wardId; 
    // Kiểm tra và sửa đổi id_ward
    if (req.body.newName !== null) {
        const newName = req.body.newName;
        await Ward.update({
            ward_name: newName
        },
        {where: {id_ward: wardId}});
    };
    if (req.body.newCode !== null) {
      const newCode = req.body.newCode;
      await Ward.update({
          id_ward: newCode
      },
      {where: {id_ward: wardId}});
    };
    if (req.body.hasAccount !== null) {
        const newHasAccount = req.body.hasAccount;
        await Ward.update({
            hasAccount: newHasAccount
        },
        {where: {id_ward: wardId}});
    }
    if (req.body.quantity !== null) {
      const quantity = req.body.quantity;
      await Ward.update({
          quantity_ward: quantity
      },
      {where: {id_ward: wardId}});
    }
    res.json("Update successfully");
  });

module.exports = router;