const express = require('express');
const router = express.Router();
const { Citizen } = require('../models');
const db = require('../models');
const { validateToken } = require('../middlewares/AuthMiddleware');

const utils = require('../utils/Utils')

// Tìm kiếm thông tin 1 người dân
router.get('/:id', validateToken, async (req, res) => {
  let id_citizen = req.params.id;
  if (!utils.CheckCitizenId(id_citizen)) return res.json({error: 'Dữ liệu không hợp lệ'})
  if (!utils.CheckCitizenId(id_citizen)) return res.json([])
  await db.sequelize
    .query('call getCitizenByIdCitizen(:id_citizen)', {
      replacements: { id_citizen: id_citizen },
    })
    .then((result) => {
      res.json(result);
    });
});

//Lấy thông tin người dân 
router.get('/', validateToken, async (req, res) => { 
  if (req.user.role === 'A1') {
    await db.sequelize.query(`call getCitizen()`).then((result) => {
      res.json(result);
    });
  } else {
    await db.sequelize
      .query('call getCitizenByIdName(:id_city, :num)', {
        replacements: { id_city: req.user.id, num: req.user.id.length },
      })
      .then((result) => {
        res.json(result);
      });
  }
});

//Thêm 1 người dân
router.post('/', validateToken, async (req, res) => {
  if (req.user.role !== 'B1' && req.user.role !== 'B2') {
    return res.json('Không có quyền truy cập');
  }
  const citizen = req.body;

  if (!utils.CheckCitizenId(citizen.id_citizen) || !utils.CheckDate(citizen.date_of_birth) || 
  !utils.isVietnamese(citizen.citizen_name) || !utils.isVietnamese(citizen.job) ||
  !utils.isVietnamese(citizen.level) || !utils.CheckGender(citizen.gender) ||
  !utils.CheckIdAddress(citizen.hometown) || !utils.CheckIdAddress(citizen.tempAddress) || 
  !utils.CheckIdAddress(citizen.address)) 
  return res.json({error: 'Dữ liệu không hợp lệ'})
  
  const findCitizen = await Citizen.findByPk(citizen.id_citizen)
  if (!findCitizen) {
    await Citizen.create(citizen);
    res.json(citizen);
  } else res.json({error: 'Người dân đã được nhập'})
});

// Xóa 1 người dân
router.delete('/:id', validateToken, async (req, res) => {
  if (req.user.role !== 'B1' && req.user.role !== 'B2') {
    return res.json('Không có quyền truy cập');
  }
  let id_citizen = req.params.id;
  if (!utils.CheckCitizenId(id_citizen)) return res.json({error: 'Dữ liệu không hợp lệ'})
  await Citizen.destroy({
    where : {id_citizen: id_citizen}
  })
  res.json(id_citizen)
});

router.put('/:id', validateToken, async (req, res) => {
  if (req.user.role !== 'B1' && req.user.role !== 'B2') {
    return res.json('Không có quyền truy cập');
  }
  const citizen = req.body;
  const id = req.params.id
  if (!utils.CheckCitizenId(citizen.id_citizen) || !utils.CheckCitizenId(id) || 
  !utils.CheckDate(citizen.date_of_birth) || !utils.CheckIdAddress(citizen.address) ||
  !utils.isVietnamese(citizen.citizen_name) || !utils.isVietnamese(citizen.job) ||
  !utils.isVietnamese(citizen.level) || !utils.CheckGender(citizen.gender) ||
  !utils.CheckIdAddress(citizen.hometown) || !utils.CheckIdAddress(citizen.tempAddress) ) 
  return res.json({error: 'Dữ liệu không hợp lệ'})
  
  const findCitizen = await Citizen.findByPk(id)
  const findId = await Citizen.findByPk(citizen.id_citizen)
  if (findCitizen && !findId) {
    await Citizen.update(
      {
      id_citizen: citizen.id_citizen,
      citizen_name: citizen.citizen_name,
      date_of_birth: citizen.date_of_birth,
      gender: citizen.gender,
      hometown: citizen.hometown,
      tempAddress: citizen.tempAddress,
      address: citizen.address,
      ethnic: citizen.ethnic,
      religion: citizen.religion,
      level: citizen.level,
      job: citizen.job,
      },{
      where : {id_citizen: id}
    });
    res.json(citizen);
  } else res.json({error: 'Người dân đã được nhập'})
});
module.exports = router;
