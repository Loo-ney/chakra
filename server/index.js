import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectToDatabase from './db.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import Razorpay from 'razorpay';
import crypto from 'crypto';


// Routes
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';

connectToDatabase();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());
app.use(cors());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);


app.get('/api/config/google', (req, res) => res.send(process.env.GOOGLE_CLIENT_ID));

const port = process.env.PORT || 5001;


app.get('/', (req, res) => {
    res.send('Api is running...');
});

// order api for razorpay
app.post('/order', async(req, res) => {

    try {
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = req.body;
    const order = await razorpay.orders.create(options);

    if(!order) {
        return res.status(500).send('Error');
    }
    res.json(order);

} catch(err) {
    console.log(err)
    res.status(500).send('Error')
}
});


app.post('/validate', async (req, res) => {
    const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body

    const sha = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
    // order_id + "|" + razorpay_payment_id

    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);

    const digest = sha.digest("hex");

    if(digest!== razorpay_signature) {
        return res.status(400).json({msg: "Transaction is not legit!"});
    }

    res.json({msg: "Transaction is legit!", orderId: razorpay_order_id, paymentId: razorpay_payment_id});

})


app.listen(port, () => {
    console.log(`Server runs on port ${port}`);
});