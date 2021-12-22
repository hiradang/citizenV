const express = require('express');
const router = express.Router();
const {Hamlet} = require('../models')
const { validateToken } = require("../middlewares/AuthMiddleware");

//Lấy thông tin các thôn, xóm của 1 xã, phường
router.get("/:idWard", validateToken, async (req, res) => {
    const id_ward = req.params.idWard
    if (req.user.role !== 'A1' && id_ward.indexOf(req.user.id) !== 0) {
        return res.json('Không có quyền truy cập')
    } 
    const listHamlet = await Hamlet.findAll({
        where: {id_ward : id_ward},
        attributes: ['id_hamlet', 'hamlet_name', 'quantity_hamlet', 'hasAccount']
    });
    res.json(listHamlet);
})

module.exports = router;