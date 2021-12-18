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
      { where: { username: id } }
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

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "importantsecret", {
    expiresIn: "5s",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "refreshSecret");
};

router.post("/refresh", (req, res) => {
  //take the refresh token from the user
  const refreshToken = req.body.token;
  //send error if there is no token or it's invalid
  if (!refreshToken) return res.json("You are not authenticated!");
  if (!refreshTokens.includes(refreshToken)) {
    return res.json("Refresh token is not valid!");
  }
  jwt.verify(refreshToken, "refreshSecret", (err, user) => {
    err && console.log(err);
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    refreshTokens.push(newRefreshToken);

    res.json({
      accessToken: newAccessToken,
      refreshToken: jwt.sign({ id: user.id_account, role: user.role }, 'refreshSecret', {
      })
    });
  });

});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await Account.findOne({where: {username: username}});
  if (!user) res.json({ error: "User Doesn't Exist" });
  bcrypt.compare(password, user.password).then((match) => {
    if (!match) res.json({ error: 'Wrong Username And Password Combination' });
    else {
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      refreshTokens.push(refreshToken);
      res.cookie('token', accessToken)
      res.json({ username: user.username, role: user.role, accessToken, refreshToken });
    }
  });
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
