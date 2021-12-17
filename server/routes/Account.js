const express = require('express');
const router = express.Router();
const {Account} = require('../models')
const bcrypt = require("bcrypt");

router.get("/update/:id", async (req, res) => {
  const id = req.params.id;
  bcrypt.hash(id, 10).then((hash) => {
    Account.update({
      password: hash
    },
    {where: {username: id}});
  });
})

router.post("/", async (req, res) => {
    const { username, password, role } = req.body;
    bcrypt.hash(password, 10).then((hash) => {
      Account.create({
        username: username,
        password: hash,
        role: role
      });
      res.json("SUCCESS");
    });
  });

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await Account.findOne({where: {username: username}});
  if (!user) res.json({ error: "User Doesn't Exist" });
  bcrypt.compare(password, user.password).then((match) => {
    if (!match) res.json({ error: "Wrong Username And Password Combination" });
  });
  res.json(user);
});

router.delete("/:username", async (req, res) => {
  const username = req.params.username;
  Account.destroy({
    where: {
      username: username
    } 
  })
  res.send("SUCCESS")
});

module.exports = router;