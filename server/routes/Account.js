const express = require('express');
const router = express.Router();
const { Account } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
let refreshTokens = []

router.get('/update/:id', async (req, res) => {
  const id = req.params.id;
  bcrypt.hash(id, 10).then((hash) => {
    Account.update(
      {
        password: hash,
      },
      { where: { id_account: id } }
    );
  });
});

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
    res.json('SUCCESS');
  });

router.post('/refresh', (req, res) => {
  const refreshToken = req.body.token
  if (!refreshToken) return res.json("You are not authenticated!")
  if (!refreshTokens.includes(refreshToken)) {
    return res.json("Refresh token is not valid!")
  }
  jwt.verify(refreshToken, 'refreshSecret')
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await Account.findOne({where: {username: username}});
  if (!user) res.json({ error: "User Doesn't Exist" });
  bcrypt.compare(password, user.password).then((match) => {
    if (!match) res.json({ error: 'Wrong Username And Password Combination' });
  });
  var token = jwt.sign({ id: user.id_account, role: user.role }, 'importantsecret', {
    expiresIn: '15m', // 24 hours
  });
  var refreshToken = jwt.sign({ id: user.id_account, role: user.role }, 'refreshSecret', {
    expiresIn: '15m', // 24 hours
  });
  refreshTokens.push(refreshToken)
  res.cookie('accessToken', token, {httpOnly: true})
  res.json({ username: user.id_account, role: user.role, accessToken: token });
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
