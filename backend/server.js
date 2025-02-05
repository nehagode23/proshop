import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import products from './data/products.js';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';

const port= 5000;

connectDB(); //connect to mongodb
const app=express();
//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',(req, res)=>{
    res.send('API is running...');
});

app.use('/api/products',productRoutes);
app.use('/api/user',userRoutes);


app.listen(port,()=>console.log(`Server running on port ${port}`));