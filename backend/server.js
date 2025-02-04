import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import products from './data/products.js';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';

const port= 5000;

connectDB(); //connect to mongodb
const app=express();

app.get('/',(req, res)=>{
    res.send('API is running...');
});

app.use('/api/products',productRoutes);


app.listen(port,()=>console.log(`Server running on port ${port}`));