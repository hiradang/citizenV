const express = require('express');
const router = express.Router();
const { City } = require('../models');
const { validateToken } = require('../middlewares/AuthMiddleware');
const db = require('../models');
const { isNumber, isVietnamese } = require('../utils/Utils');

// Lấy thông tin tất cả thành phố
router.get('/', validateToken, async (req, res) => {
  if (req.user.role !== 'A1' && req.user.role.indexOf('B') !== 0) {
    return res.json('Không có quyền truy cập');
  }
  const listCity = await City.findAll();
  res.json(listCity);
});

//Lấy thông tin một thành phố
router.get('/:id', validateToken, async (req, res) => {
  const cityId = req.params.id;
  if (req.user.role !== 'A1' && req.user.id.indexOf(cityId) !== 0) {
    return res.json('Không có quyền truy cập');
  }

  if (isNumber(cityId) && cityId.length === 2) {
    const listCity = await City.findByPk(cityId);
    res.json(listCity);
  } else {
    res.json('Id không hợp lệ');
  }
});

// Them moi mot thanh pho
router.post('/', validateToken, async (req, res) => {
  if (req.user.role !== 'A1') {
    res.json('Không có quyền truy cập');
  } else {
    const { cityName, cityCode } = req.body;
    if (isVietnamese(cityName)) {
      if (isNumber(cityCode) && cityCode.length === 2) {
        try {
          await City.create({
            id_city: cityCode,
            city_name: cityName,
            hasAccount: false,
            quantity_city: 0,
          });
          res.json('SUCCESS');
        } catch (e) {
          console.log(e);
        }
      } else {
        res.json('Id không hợp lệ!');
      }
    } else {
      res.json('Tên tỉnh/thành không hợp lệ!');
    }
  }
});

// Khi thay đổi thì sẽ tạo newCode: "value"
// Hàm này có thể update cityCode, cityName, hasAccount khi có dữ gửi đến (1, 2, hoặc cả 3)
router.post('/:cityId', validateToken, async (req, res) => {
  if (req.user.role !== 'A1') {
    return res.json('Không có quyền truy cập');
  }
  const cityId = req.params.cityId;
  // Kiểm tra và sửa đổi tên thành phố
  if (req.body.newName !== null) {
    const newName = req.body.newName;
    if (isVietnamese(newName)) {
      try {
        await City.update(
          {
            city_name: newName,
          },
          { where: { id_city: cityId } }
        );
        res.json('Succesfully');
      } catch (e) {
        res.json(e);
      }
    } else {
      res.json('Tên thành phố không hợp lệ');
    }
  }

  // Kiểm tra và sửa đổi mã thành phố
  if (req.body.newCode !== null) {
    const newCode = req.body.newCode;
    if (isNumber(newCode) && newCode.length === 2) {
      try {
        await City.update(
          {
            id_city: newCode,
          },
          { where: { id_city: cityId } }
        );
        res.json('Successfully');
      } catch (e) {}
    } else {
      // res.json("Mã không hợp lệ");
    }
  }

  // Kiểm tra và sửa đổi hasAccount
  if (req.body.hasAccount !== null) {
    const newHasAccount = req.body.hasAccount;
    if (newHasAccount === true || newHasAccount === false) {
      try {
        await City.update(
          {
            hasAccount: newHasAccount,
          },
          { where: { id_city: cityId } }
        );
        res.json('Succesfully');
      } catch (e) {}
    } else {
      res.json('Dữ liệu không hợp lệ');
    }
  }

  // Kiểm tra và sửa đối số lượng
  if (req.body.quantity !== null) {
    const quantity = req.body.quantity;
    if (isNumber(quantity)) {
      try {
        await City.update(
          {
            quantity_city: quantity,
          },
          { where: { id_city: cityId } }
        );
      } catch (e) {}
    } else {
      res.json('Dữ liệu không hợp lệ!');
    }
  }
});

//Xóa một thành phố
router.delete('/:id', validateToken, async (req, res) => {
  if (req.user.role !== 'A1') {
    return res.json('Không có quyền truy cập');
  }
  const id = req.params.id;
  if (isNumber(id) && id.length === 2) {
    City.destroy({
      where: {
        id_city: id,
      },
    });
    res.send('SUCCESS');
  } else {
    res.send('Dữ liệu không hợp lệ!');
  }
});

module.exports = router;
