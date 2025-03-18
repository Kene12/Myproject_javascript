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

router.get('/showUser', async (req, res) =>{
  try {
    const users = await acc.find({ role: {$ne: "Admin"} });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/editUser', async (req, res) =>{
  try{
    const { _id, username, email, password, role} = req.body;

    if (role != "Admin") return res.status(400).json({ error: "The role has no permission" });
    if (!_id) return res.status(400).json({ error: "Id not found" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    let updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) updateData.password = hashedPassword

    const updateUser = await acc.findByIdAndUpdate(_id, updateData, { new: true});

    if(!updateUser) return res.status(404).json({ error: "Can't UpdateUser" });

    res.json({ massage: "User updated successfully", user: updateUser });
  }catch(err){
    res.status(500).json({ error: err.message });
  }
});

router.delete('/deleteUser', async( req, res) =>{
  try{
    const {_id, role} = req.body;
    if (role != "Admin") return res.status(400).json({ error: "The role has no permission" });
    if (!_id) return res.status(400).json({ error: "Id not found" });

    const userToDelete = await acc.findOne({ _id });
    if (!userToDelete) return res.status(404).json({ error: "User not found" });

    if (userToDelete.role === "Admin") return res.status(403).json({ error: "Cannot delete Admin users" });

    const deleteUser = await acc.deleteOne({ _id });
    if(!deleteUser) return res.status(404).json({ error: "Can not delete" });

    res.json({ massage: "User delete successfully", user: deleteUser });
  }catch(err){
    res.status(500).json({ error:err.massage });
  }
})

module.exports = router;