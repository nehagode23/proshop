import asyncHandler from "../middleware/asyncHandler.js"
import User from "../models/userModel.js";


const authUser=asyncHandler( async(req,res)=>{
    res.send('auth user');
});

const registerUser=asyncHandler( async(req,res)=>{
    res.send('register user');
});

const logoutUser=asyncHandler( async(req,res)=>{
    res.send('logout user');
});

const getUserProfile=asyncHandler( async(req,res)=>{
    res.send('get user profile');
});

const updateUserProfile=asyncHandler( async(req,res)=>{
    res.send('update user profile');
});

//admin route
const getUsers=asyncHandler( async(req,res)=>{
    res.send('all user');
});

const getUserById=asyncHandler( async(req,res)=>{
    res.send('get user by id');
});

const deleteUsers=asyncHandler( async(req,res)=>{
    res.send('delete all user');
});

const deleteUser=asyncHandler( async(req,res)=>{
    res.send('delete user');
});

const updateUser=asyncHandler( async(req,res)=>{
    res.send('update user');
});

export {
    authUser,
    registerUser,
    logoutUser,
    getUserById,
    getUserProfile,
    deleteUser,
    deleteUsers,
    updateUser,
    updateUserProfile,
    getUsers
} ;