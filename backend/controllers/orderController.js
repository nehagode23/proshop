import asyncHandler from "../middleware/asyncHandler.js"
import Order from "../models/orderModel.js";


const addOrderItems =asyncHandler( async(req,res)=>{
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
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
    const order=await Order.findById(req.params.id);

    if(order){
      order.isPaid=true;
      order.paidAt=Date.now();
      order.paymentResult={
        id: req.body.id || "test-id",
        status: req.body.status || "COMPLETED",
        update_time: req.body.update_time || new Date().toISOString(),
        email_address: req.body.payer?.email_address || "unknown@example.com"
      };

      const updatedOrder=await order.save();
      res.status(200).json(updatedOrder);
    }
    else{
        res.status(404);
        throw new Error('Order not found');
    }
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