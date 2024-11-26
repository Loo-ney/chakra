import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectToDatabase from './db.js';
import cors from 'cors';

// Routes
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';

connectToDatabase();
const app = express();
// app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

app.get('/api/config/google', (req, res) => res.send(process.env.GOOGLE_CLIENT_ID));

const port = 5001;


app.get('/', (req, res) => {
    res.send('Api is running...');
});

app.listen(port, () => {
    console.log(`Server runs on port ${port}`);
});