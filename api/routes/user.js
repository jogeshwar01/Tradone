const express = require('express');
const router = express.Router();
const User = require("../models/User");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../routes/verifyToken");

//use verifyToken middleware
//update
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password, process.env.PASS_SEC).toString()
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true } //to return updated user
        );
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json(error);
    }
})

//delete
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('User deleted successfully');
    } catch (error) {
        res.status(500).json(error);
    }
});

//get
router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (error) {
        res.status(500).json(error);
    }
});

//get all users
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new; //to be able to use any query on url
    // --> /api/users?new=true --sorts by id and gives top 5
    try {
        const users = query
            ? await User.find().sort({ _id: -1 }).limit(5)
            : await User.find();

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
});

//user stats -no. of users registered per month this year
router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            { $project: { month: { $month: '$createdAt' } } },
            //take month out of createdAt field and assign it to month field
            {
                $group: {
                    _id: '$month',
                    total: { $sum: 1 },//sum every user
                },
            },
        ]);

        res.status(200).json(data);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;