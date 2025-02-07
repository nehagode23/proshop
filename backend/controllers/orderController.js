import asyncHandler from "../middleware/asyncHandler.js"
import Order from "../models/orderModel.js";


const addOrderItems =asyncHandler( async(req,res)=>{
    const {
        orderItems,
        shippingAddress,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } =req.body

    if(orderItems && orderItems.length===0){
        res.status(400);
        throw new Error('No order items');
    }else{
        const order= new Order({
            orderItems: orderItems.map((x)=>({
                ...x,
                product:x._id,
                _id:undefined,
            })),
            user:req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });
        const createOrder=await order.save();
        res.status(201).json(createOrder);
    }
});

const getMyOrders=asyncHandler( async(req,res)=>{
    const orders=await Order.find({user:req.user._id});
    res.status(200).json(orders);
});

const getOrderById =asyncHandler( async(req,res)=>{
    const order=await Order.findById(req.params.id).populate('user','name email');

    if(order){
        res.status(200).json(order);
    }else{
        res.status(400).json('order not found');
    }
    
});

const updateOrderToPaid =asyncHandler( async(req,res)=>{
    res.send('u[pdate] order items to paid');
});

//admins

const updateToDelivered =asyncHandler( async(req,res)=>{
    res.send('u[pdate] order items to delivered');
});

const getOrders =asyncHandler( async(req,res)=>{
    res.send('get all orders');
});

export {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateToDelivered,
    getOrders
};