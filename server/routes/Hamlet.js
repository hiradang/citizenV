const express = require('express');
const router = express.Router();
const {Hamlet} = require('../models')

router.get("/", async (req, res) => {
    const listHamlet = await Hamlet.findAll({
        attributes: ['id_hamlet', 'hamlet_name', 'quantity_hamlet']
    });
    res.json(listHamlet);
})

router.get("/:idWard", async (req, res) => {
    const id_ward = req.params.idWard
    const listHamlet = await Hamlet.findAll({
        where: {id_ward : id_ward},
        attributes: ['id_hamlet', 'hamlet_name', 'quantity_hamlet']
    });
    res.json(listHamlet);
})

module.exports = router;