import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import products from './data/products.js';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js'

const port= 5000;

connectDB(); //connect to mongodb
const app=express();
//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//cookie parser middleware
app.use(cookieParser());

app.get('/',(req, res)=>{
    res.send('API is running...');
});

app.use('/api/products',productRoutes);
app.use('/api/user',userRoutes);
app.use('/api/orders',orderRoutes);


app.listen(port,()=>console.log(`Server running on port ${port}`));