import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import products from './data/products.js';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const port= 5000;

connectDB(); //connect to mongodb
const app=express();
//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//cookie parser middleware
app.use(cookieParser());

app.use('/api/products',productRoutes);
app.use('/api/user',userRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/upload',uploadRoutes);

app.get('/api/config/paypal',(req,res)=>res.send({clientId: process.env.PAYPAL_CLIENT_ID}));

const __dirname=path.resolve();
app.use('/uploads',express.static(path.join(__dirname,'/uploads')));

if(process.env.NODE_ENV==='production'){
    app.use(express.static(path.join(__dirname,'/frontend/build')));

    app.get('*',(req,res)=>res.sendFile(path.resolve(__dirname,'frontend','build','index.html')));
}else{
    app.get('/',(req,res)=>{
        res.send('API is running...');
    });
}
app.listen(port,()=>console.log(`Server running on port ${port}`));