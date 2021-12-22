const express = require('express');
const router = express.Router();
const { Ward } = require('../models');
const { validateToken } = require('../middlewares/AuthMiddleware');

//Lấy thông tin các xã, phường của 1 quận, huyện
router.get('/:idDistrict', validateToken, async (req, res) => {
  if (!req.query.id) {
    const id_district = req.params.idDistrict;
    if (req.user.role !== 'A1' && id_district.indexOf(req.user.id) !== 0) {
      return res.json('Không có quyền truy cập');
    }
    const listWard = await Ward.findAll({
      where: { id_district: id_district },
      attributes: ['id_ward', 'ward_name', 'quantity_ward', 'hasAccount'],
    });
    res.json(listWard);
  } else {
    const listWard = await Ward.findByPk(req.query.id);
    res.json(listWard);
  }
});

module.exports = router;
