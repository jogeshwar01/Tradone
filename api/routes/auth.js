const express = require('express');
const router = express.Router();
const User = require("../models/User");
const CryptoJS = require('crypto-js');
const jwt = require("jsonwebtoken");

//register
router.post('/register', async (req, res) => {
    try {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
        });

        const savedUser = await newUser.save(); //to save to database
        res.status(201).json(savedUser);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

//login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(400).json('wrong credentials');

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        OriginalPassword !== req.body.password && res.status(401).json('wrong credentials');

        const accessToken = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SEC,
            { expiresIn: '3d' }
        );

        const { password, ...others } = user._doc;  //_doc --got to know when we printed object as to where the info is

        res.status(200).json({ ...others, accessToken });
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;