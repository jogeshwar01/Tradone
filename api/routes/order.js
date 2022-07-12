const express = require('express');
const Order = require('../models/Order');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../routes/verifyToken");

const router = express.Router();

//create
router.post('/', verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);

    try {
        const savedOrder = await newOrder.save();

        res.status(200).json(savedOrder);
    } catch (error) {
        res.status(500).send(error);
    }
});

//update
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json(error);
    }
});

//delete
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json('Order deleted successfully');
    } catch (error) {
        res.status(500).json(error);
    }
});

//get user orders
router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
});

// get all
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Orders.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
});

//order stats-monthly income
router.get('/income', verifyTokenAndAdmin, async (req, res) => {
    const productId = req.query.productId;
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const prevMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
    //if current date is june,lastmonth is may and prevMonth is april

    try {
        const income = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: prevMonth },
                    ...(productId && {
                        products: { $elemMatch: { productId } },
                    }),
                },
            },
            { $project: { month: { $month: '$createdAt' }, sales: '$amount' } },
            {
                $group: {
                    _id: '$month',
                    total: { $sum: '$sales' },
                },
            },
        ]);

        res.status(200).json(income);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;