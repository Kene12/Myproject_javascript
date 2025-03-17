const jwt = require("jsonwebtoken");
const express = require('express');
const bcrypt = require('bcryptjs');
const acc = require('../models/Account');

const router = express.Router();

router.get('/Search', async (req, res) => {
  try {
    const { _id, username, email } = req.body;
    let query = {};
    if (_id) query._id = _id;
    if (username) query.username = username;
    if (email) query.email = email;

    const user = await acc.findOne(query);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;