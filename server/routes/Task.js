const express = require('express');
const router = express.Router();
const {City} = require('../models');
const {Task} = require('../models');
const db = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");
// router.get("/", async (req, res) => {
//     const listTask = await Task.findAll({
//         attributes: ['id_Task', 'start_date', 'end_date', 'is_finished', 'owner_id', 'lower_grade_id']
//     });
//     res.json(listTask);
// })

// router.get("/", async (req, res) => {
//     const listCity = await City.findAll()
//     for (let i = 0; i< listCity.length; i++) {
//         await Task.create({
//             id_task: listCity[i].id_city,
//             is_finished: 0,
//             owner_id: '00',
//             lower_grade_id: 0
//         });
//     }
//     const listTask = await Task.findAll()
//     res.json(listTask);
// })

router.get("/city", async (req, res) => {
    const [result, metadata] = await db.sequelize.query(`select cities.city_name as cityName, cities.id_city as id, 
    tasks.start_date as startDate, tasks.end_date as endDate,  ifnull(tasks.is_finished,0) as status, ifnull(tasks.lower_grade_id,0) as progress
    from cities left JOIN tasks on cities.id_city = tasks.id_task`)
    res.json(result);
})

router.put("/city/:id", async (req, res) => {
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