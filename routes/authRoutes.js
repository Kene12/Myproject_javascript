const jwt = require("jsonwebtoken");
const express = require('express');
const bcrypt = require('bcryptjs');
const acc = require('../models/Account');

const router = express.Router();

router.post('/registerUser', async (req, res) =>{
    try{
        const { username, email, password } =req.body;
        const typeUser = "User";
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new acc({username, email, password: hashedPassword, type: typeUser});
        await newUser.save();

        res.json({ message: "User registered successfully!"});
    } catch(err){
        res.status(500).json({ error: err.message });
    }
});

router.post('/registerAdmin', async (req, res) =>{
  try{
      const { username, email, password } =req.body;
      const typeUser = "Admin";
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new acc({username, email, password: hashedPassword, type: typeUser});
      await newUser.save();

      res.json({ message: "Admin registered successfully!"});
  } catch(err){
      res.status(500).json({ error: err.message });
  }
});

router.get('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await acc.findOne({ email });
  
      if (!user) return res.status(400).json({ error: "User not found" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
  
      const token = jwt.sign({ id: user._id }, "SECRET_KEY", { expiresIn: "1h" });
      res.json({ token, user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;