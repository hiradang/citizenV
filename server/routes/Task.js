const express = require('express');
const router = express.Router();
const {City} = require('../models');
const Task = require('../models/Task');

router.get("/", async (req, res) => {
    const listTask = await Task.findAll({
        attributes: ['id_Task', 'start_date', 'end_date', 'is_finished', 'owner_id', 'lower_grade_id']
    });
    res.json(listTask);
})

router.post("/", async (req, res) => {
    const task = req.body;
    await Task.create(task);
    res.json(listTask);
})

module.exports = router;