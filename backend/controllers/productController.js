import asyncHandler from "../middleware/asyncHandler.js"
import Product from "../models/productModel.js";


const getProducts=asyncHandler( async(req,res)=>{
    const products=await Product.find({})
    res.json(products);
});

const getProductById=asyncHandler( async(req,res)=>{
    const product=await Product.findById(req.params.id);
    if(product){
        return res.json(product);
    }
    else{
        return res.status(404).json({message:'Product not found'});
    }
});

const createProduct=asyncHandler( async(req,res)=>{
    const product=new Product({
        name:'Sample name',
        price:0,
        user:req.user._id,
        image:'/images/sample.jpg',
        brand:'Sample brand',
        category:'Sample category',
        countInStock:0,
        numReviews:0,
        description:'Sample description'
    });

    const createdProduct=await product.save();
    res.status(201).json(createdProduct);
});

export {getProducts,getProductById, createProduct};