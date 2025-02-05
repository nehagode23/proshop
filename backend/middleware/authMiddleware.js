import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';

//Protect routes
const protect=asyncHandler(async(req,resizeBy,next)=>{
    let token;

    //read token from cookie
    token=req.cookies.jwt;

    if(token){
        try {
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            req.user= await User.findById(decoded.userId).select('-password');
            next();
            
        } catch (error) {
            console.log(error)
            res.status(401);
            
        }

    }else{
        res.status(401);
    }
});

//Admin Middleware
const admin =(req,res,next)=>{
    if(req.user && req.user.isAdmin){
        next();
    }
    else{
        res.status(401)
        throw new Error('Not authorized as admin')
    }
}

export {admin, protect};