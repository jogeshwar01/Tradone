const express = require("express");
const app = express();

const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require("dotenv");
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const productRouter = require('./routes/product');
const cartRouter = require('./routes/cart');
const orderRouter = require('./routes/order');
const stripeRouter = require('./routes/stripe');

dotenv.config();

app.use(express.json());
app.use(cors());

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log('Db connection established'))
    .catch((err) => console.error(err));

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/orders', orderRouter);
app.use('/api/checkout', stripeRouter);

app.listen(process.env.PORT || 5000, () => {
    console.log('server is running');
});
