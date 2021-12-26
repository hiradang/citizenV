const express = require('express');
const router = express.Router();
const { District } = require('../models');
const { validateToken } = require('../middlewares/AuthMiddleware');
const { isNumber, isVietnamese } = require('../utils/Utils');

//Lấy thông tin các quận, huyện của 1 tỉnh, thành phố
router.get('/:idCity', validateToken, async (req, res) => {
  if (!req.query.id) {
    const id_city = req.params.idCity;
    if (
      req.user.role !== 'A1' &&
      req.user.id.indexOf(id_city) !== 0 &&
      req.user.role.indexOf('B') !== 0
    ) {
      return res.json('Không có quyền truy cập');
    }

    if (isNumber(id_city) && id_city.length === 2) {
      const listDistrict = await District.findAll({
        where: { id_city: id_city },
        attributes: ['id_district', 'district_name', 'quantity_district', 'hasAccount'],
      });
      res.json(listDistrict);
    } else {
      res.send('Dữ liệu không hợp lệ');
    }
  } else {
    const listDistrict = await District.findByPk(req.query.id);
    res.json(listDistrict);
  }
});

// Thêm một quận/huyện mới
router.post('/', validateToken, async (req, res) => {
  if (req.user.role !== 'A2') {
    return res.json('Không có quyền truy cập');
  }

  const { districtName, districtCode, idCity } = req.body;
  if (isVietnamese(districtName)) {
    if (isNumber(districtCode) && districtCode.length === 4) {
      try {
        District.create({
          id_district: districtCode,
          district_name: districtName,
          hasAccount: false,
          quantity_district: 0,
          id_city: idCity,
        });
        res.json('SUCCESS');
      } catch (err) {}
    } else {
      res.json('Mã quận/huyện không hợp lệ!');
    }
  } else {
    res.json('Tên quận/huyện không hợp lệ!');
  }
});

// Khi thay đổi thì sẽ tạo newCode: "value"
// Hàm này có thể update districtCode, districtName, hasAccount, quantity khi có dữ gửi đến (1, 2, hoặc cả 3)
router.post('/:districtId', async (req, res) => {
  const districtId = req.params.districtId;
  // Kiểm tra và sửa đổi tên quận/huyện
  if (req.body.newName !== null) {
    const newName = req.body.newName;

    if (isVietnamese(newName)) {
      try {
        await District.update(
          {
            district_name: newName,
          },
          { where: { id_district: districtId } }
        );
        res.json('Successfully!');
      } catch (e) {
        res.json(e);
      }
    } else {
      res.json('Dữ liệu không hợp lệ!');
    }
  }

  // Kiểm tra và sửa đổi mã quận/huyện
  if (req.body.newCode !== null) {
    const newCode = req.body.newCode;
    if (isNumber(newCode) && newCode.length == 4) {
      try {
        await District.update(
          {
            id_district: newCode,
          },
          { where: { id_district: districtId } }
        );
        res.json('Successfully!');
      } catch (e) {
        // res.json(e);
      }
    } else {
      res.json('Dữ liệu không hợp lệ!');
    }
  }

  // Kiểm tra và sửa đổi hasAccount
  if (req.body.hasAccount !== null) {
    const newHasAccount = req.body.hasAccount;
    if (newHasAccount === true || newHasAccount === false) {
      try {
        await District.update(
          {
            hasAccount: newHasAccount,
          },
          { where: { id_district: districtId } }
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
        await District.update(
          {
            quantity_district: quantity,
          },
          { where: { id_district: districtId } }
        );
        res.json('Successfully!');
      } catch (e) {}
    } else {
      res.json('Dữ liệu không hợp lệ!');
    }
  }
});

//Xóa một quận/huyện
router.delete('/:id', validateToken, async (req, res) => {
  if (req.user.role !== 'A2') {
    return res.json('Không có quyền truy cập');
  }

  const id = req.params.id;
  if (isNumber(id) && id.length === 4) {
    District.destroy({
      where: {
        id_district: id,
      },
    });
    res.send('SUCCESS');
  } else {
    res.json('Dữ liệu không hợp lệ!');
  }
});

module.exports = router;
