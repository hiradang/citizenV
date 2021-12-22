const express = require('express');
const router = express.Router();
const {District} = require('../models')
const { validateToken } = require("../middlewares/AuthMiddleware");

//Lấy thông tin các quận, huyện của 1 tỉnh, thành phố
router.get("/:idCity",validateToken, async (req, res) => {
    if (!req.query.id) {
        const id_city = req.params.idCity
        if (req.user.role !== 'A1' && req.user.id.indexOf(id_city) !== 0) {
            return res.json('Không có quyền truy cập')
        }
        const listDistrict = await District.findAll({
            where: {id_city : id_city},
            attributes: ['id_district', 'district_name', 'quantity_district', 'hasAccount']
        });
        res.json(listDistrict);
    } else {
        const listDistrict = await District.findByPk(req.query.id);
        res.json(listDistrict);
    }
})

//Lấy thông tin 1 quận, huyện
router.get("/id/:id",validateToken, async (req, res) => {
    const id_city = req.query.idDistrict
    console.log(1)
    // if (req.user.role !== 'A1' && req.user.id !== id_city) {
    //     return res.json('Không có quyền truy cập')
    // }
    // const listDistrict = await District.findAll({
    //     where: {id_district : id_district},
    //     attributes: ['id_district', 'district_name', 'quantity_district', 'hasAccount']
    // });
    // res.json(listDistrict);
})

module.exports = router;