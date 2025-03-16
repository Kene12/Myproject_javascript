const jwt = require("jsonwebtoken");
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) =>{
    try{
        const { username, email, password } =req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({username, email, password: hashedPassword});
        await newUser.save();

        res.json({ message: "User registered successfully!"});
    } catch(err){
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
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