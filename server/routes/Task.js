const express = require('express');
const router = express.Router();
const {City} = require('../models');
const {Task} = require('../models');
const db = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");


//Lấy thông tin tình hình nhập liệu của các tỉnh, thành phố
router.get("/city", validateToken,async (req, res) => {
    
    if (req.user.role !== 'A1') {
        return res.json('Không có quyền truy cập')
    }
    const [result, metadata] = await db.sequelize.query(`select cities.city_name as cityName, cities.id_city as id, 
    tasks.start_date as startDate, tasks.end_date as endDate,  ifnull(tasks.is_finished,0) as status, ifnull(tasks.lower_grade_id,0) as progress
    from cities left JOIN tasks on cities.id_city = tasks.id_task`)
    res.json(result);
})

router.get("/district", validateToken,async (req, res) => {
    
    if (req.user.role !== 'A2') {
        return res.json('Không có quyền truy cập')
    }
    const [result, metadata] = await db.sequelize.query(`select districts.district_name as cityName, districts.id_district as id, 
    tasks.start_date as startDate, tasks.end_date as endDate,  ifnull(tasks.is_finished,0) as status, ifnull(tasks.lower_grade_id,0) as progress
    from districts left JOIN tasks on districts.id_district = tasks.id_task
    where districts.id_city = ${req.user.id}`)
    res.json(result);
})

router.get("/ward", validateToken,async (req, res) => {
    
    if (req.user.role !== 'A3') {
        return res.json('Không có quyền truy cập')
    }
    const [result, metadata] = await db.sequelize.query(`select wards.ward_name as cityName, wards.id_ward as id, 
    tasks.start_date as startDate, tasks.end_date as endDate,  ifnull(tasks.is_finished,0) as status, ifnull(tasks.lower_grade_id,0) as progress
    from wards left JOIN tasks on wards.id_ward = tasks.id_task
    where wards.id_district = ${req.user.id}`)
    res.json(result);
})

//Cấp và mở quyền khai báo (thời điểm bắt đầu và kết thúc) cho 1 tỉnh thành phố
router.put("/:id", validateToken,async (req, res) => {
    // if (req.user.role !== 'A1') {
    //     return res.json('Không có quyền truy cập')
    // }
    const time = req.body
    const id = req.params.id
    const task = await Task.findByPk(id)
    if (task) {
        await Task.update({
            start_date: time.startDate,
            end_date: time.endDate
        },
        {where: {id_task: id}});
    } else {
        await Task.create({
            id_task: id,
            start_date: time.startDate,
            end_date: time.endDate,
            is_finished: 0,
            owner_id: '00',
            lower_grade_id: 0,
        });
    }
    res.json(time);
})

module.exports = router;