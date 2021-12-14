const express = require('express');
const router = express.Router();
const {Citizen} = require('../models')
const {Hamlet} = require('../models')
const {Ward} = require('../models')
const {City} = require('../models')
const db = require("../models");
router.get("/", async (req, res) => {
    const [result, metadata] = await db.sequelize.query(
    `SELECT c.*, nameAll1.hamlet_name addHamlet_name, nameAll1.ward_name addWard_name, 
    nameAll1.district_name addDistrict_name, nameAll1.city_name addCity_name,
    nameAll2.hamlet_name tempHamlet_name, nameAll2.ward_name tempWard_name, 
    nameAll2.district_name tempDistrict_name, nameAll2.city_name tempCity_name,
    nameAll3.hamlet_name homeHamlet_name, nameAll3.ward_name homeWard_name, 
    nameAll3.district_name homeDistrict_name, nameAll3.city_name homeCity_name
    FROM citizens c inner join 
    (select h.id_hamlet, h.hamlet_name, w.ward_name, d.district_name, ci.city_name 
    from hamlets h inner join wards w on w.id_ward = h.id_ward
    inner join districts d on d.id_district = w.id_district
    inner join cities ci on ci.id_city = d.id_city) as nameAll1 on c.address = nameAll1.id_hamlet
    inner join 
    (select h.id_hamlet,h.hamlet_name, w.ward_name, d.district_name, ci.city_name 
    from hamlets h inner join wards w on w.id_ward = h.id_ward
    inner join districts d on d.id_district = w.id_district
    inner join cities ci on ci.id_city = d.id_city) as nameAll2 on c.tempAddress = nameAll2.id_hamlet
   inner join 
    (select h.id_hamlet,h.hamlet_name, w.ward_name, d.district_name, ci.city_name 
    from hamlets h inner join wards w on w.id_ward = h.id_ward
    inner join districts d on d.id_district = w.id_district
    inner join cities ci on ci.id_city = d.id_city) as nameAll3 on c.hometown = nameAll3.id_hamlet`)
    // const [result, metadata] = await 
    //   sequelize.query(`SELECT *
    //   questionContent = "${updateQuestion.questionContent}", 
    //   result = "${updateQuestion.result}", 
    //   choice1 = "${updateQuestion.choice1}", 
    //   choice2 = "${updateQuestion.choice2}", 
    //   choice3 = "${updateQuestion.choice3}" 
    //  WHERE id = ${questionId}`);
    res.json(result);
})

router.get("/:id", async (req, res) => {
    let id_citizen = req.params.id
    const [result, metadata] = await db.sequelize.query(
    `SELECT c.*, nameAll1.hamlet_name addHamlet_name, nameAll1.ward_name addWard_name, 
    nameAll1.district_name addDistrict_name, nameAll1.city_name addCity_name,
    nameAll2.hamlet_name tempHamlet_name, nameAll2.ward_name tempWard_name, 
    nameAll2.district_name tempDistrict_name, nameAll2.city_name tempCity_name,
    nameAll3.hamlet_name homeHamlet_name, nameAll3.ward_name homeWard_name, 
    nameAll3.district_name homeDistrict_name, nameAll3.city_name homeCity_name
    FROM citizens c inner join 
    (select h.id_hamlet, h.hamlet_name, w.ward_name, d.district_name, ci.city_name 
    from hamlets h inner join wards w on w.id_ward = h.id_ward
    inner join districts d on d.id_district = w.id_district
    inner join cities ci on ci.id_city = d.id_city) as nameAll1 on c.address = nameAll1.id_hamlet
    inner join 
    (select h.id_hamlet,h.hamlet_name, w.ward_name, d.district_name, ci.city_name 
    from hamlets h inner join wards w on w.id_ward = h.id_ward
    inner join districts d on d.id_district = w.id_district
    inner join cities ci on ci.id_city = d.id_city) as nameAll2 on c.tempAddress = nameAll2.id_hamlet
   inner join 
    (select h.id_hamlet,h.hamlet_name, w.ward_name, d.district_name, ci.city_name 
    from hamlets h inner join wards w on w.id_ward = h.id_ward
    inner join districts d on d.id_district = w.id_district
    inner join cities ci on ci.id_city = d.id_city) as nameAll3 on c.hometown = nameAll3.id_hamlet
    where c.id_citizen = '${id_citizen}'`)
    // const [result, metadata] = await 
    //   sequelize.query(`SELECT *
    //   questionContent = "${updateQuestion.questionContent}", 
    //   result = "${updateQuestion.result}", 
    //   choice1 = "${updateQuestion.choice1}", 
    //   choice2 = "${updateQuestion.choice2}", 
    //   choice3 = "${updateQuestion.choice3}" 
    //  WHERE id = ${questionId}`);
    res.json(result);
})

module.exports = router;