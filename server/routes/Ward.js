const express = require('express');
const router = express.Router();
const { Ward } = require('../models');
const { validateToken } = require('../middlewares/AuthMiddleware');
const { isNumber, isVietnamese } = require('../utils/Utils');
const { response } = require('express');

//Lấy thông tin các xã, phường của 1 quận, huyện
router.get('/:idDistrict', validateToken, async (req, res) => {
  if (!req.query.id) {
    const id_district = req.params.idDistrict;
    if (
      req.user.role !== 'A1' &&
      id_district.indexOf(req.user.id) !== 0 &&
      req.user.role.indexOf('B') !== 0
    ) {
      return res.json('Không có quyền truy cập');
    }

    if (isNumber(id_district) && id_district.length === 4) {
      const listWard = await Ward.findAll({
        where: { id_district: id_district },
        attributes: ['id_ward', 'ward_name', 'quantity_ward', 'hasAccount'],
      });
      res.json(listWard);
    } else {
      res.json('Dữ liệu không hợp lệ');
    }
  } else {
    const listWard = await Ward.findByPk(req.query.id);
    res.json(listWard);
  }
});

// Thêm một xã/phường mới
router.post('/', validateToken, async (req, res) => {
  if (req.user.role !== 'A3') {
    return res.json('Không có quyền truy cập');
  }

  const { wardName, wardCode, idDistrict } = req.body;
  if (isVietnamese(wardName)) {
    if (isNumber(wardCode) && wardCode.length === 6) {
      try {
        Ward.create({
          id_ward: wardCode,
          ward_name: wardName,
          hasAccount: false,
          quantity_ward: 0,
          id_district: idDistrict,
        });
        res.json('SUCCESS');
      } catch (err) {}
    } else {
      res.json('Id không hợp lệ');
    }
  } else {
    res.json('Tên xã/phường không hợp lệ!');
  }
});

// Khi thay đổi thì sẽ tạo newCode: "value"
// Hàm này có thể update wardCode, wardName, hasAccount, quantity khi có dữ gửi đến (1, 2, hoặc cả 3)
router.post('/:wardId', async (req, res) => {
  const wardId = req.params.wardId;

  // Kiểm tra và sửa đổi tên xã/phường
  if (req.body.newName !== null) {
    const newName = req.body.newName;
    if (isVietnamese(newName)) {
      try {
        await Ward.update(
          {
            ward_name: newName,
          },
          { where: { id_ward: wardId } }
        );
        res.json('Successfully!');
      } catch (e) {}
    } else {
      res.json('Dữ liệu không hợp lệ!');
    }
  }

  // Kiểm tra và sửa đổi mã xã/phường
  if (req.body.newCode !== null) {
    const newCode = req.body.newCode;
    if (isNumber(newCode) && newCode.length === 6) {
      try {
        await Ward.update(
          {
            id_ward: newCode,
          },
          { where: { id_ward: wardId } }
        );
        res.json('Successfully!');
      } catch (e) {}
    } else {
      // res.json("Dữ liệu không hợp lệ!")
    }
  }

  // Kiểm tra và sửa đổi hasAccount
  if (req.body.hasAccount !== null) {
    const newHasAccount = req.body.hasAccount;
    if (newHasAccount === true || newHasAccount === false) {
      try {
        await Ward.update(
          {
            hasAccount: newHasAccount,
          },
          { where: { id_ward: wardId } }
        );
        res.json('Successfully!');
      } catch (e) {}
    } else {
      res.json('Dữ liệu không hợp lệ!');
    }
  }

  // Kiểm tra và sửa đổi quantity
  if (req.body.quantity !== null) {
    const quantity = req.body.quantity;
    if (isNumber(quantity)) {
      try {
        await Ward.update(
          {
            quantity_ward: quantity,
          },
          { where: { id_ward: wardId } }
        );
        res.json('Successfully!');
      } catch (e) {}
    } else {
      res.json('Dữ liệu không hợp lệ!');
    }
  }
});

//Xóa một xa/phuong
router.delete('/:id', validateToken, async (req, res) => {
  if (req.user.role !== 'A3') {
    return res.json('Không có quyền truy cập');
  }
  const id = req.params.id;

  if (isNumber(id) && id.length === 6) {
    try {
      Ward.destroy({
        where: {
          id_ward: id,
        },
      });
      res.send('SUCCESS');
    } catch (e) {}
  } else {
    res.json('Dữ liệu không hợp lệ!');
  }
});

module.exports = router;
