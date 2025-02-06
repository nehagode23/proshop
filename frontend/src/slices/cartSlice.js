import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";
const initialState = localStorage.getItem("cart")? JSON.parse(localStorage.getItem("cart")): {cartItems:[], shippingAddress:{},paymentMethod:'PayPal'};


const cartSlice=createSlice({
    name:"cart",
    initialState,
    reducers:{
        addToCart:(state,action)=>{
            const item=action.payload;

            return updateCart(state,item);
        },
        removeFromCart:(state,action)=>{
            state.cartItems=state.cartItems.filter((x)=>x._id!==action.payload);
            return updateCart(state);

        },
        saveShippingAddress:(state,action)=>{
            state.shippingAddress=action.payload;
            return updateCart(state);
        }
    },
});

export const {addToCart, removeFromCart, saveShippingAddress}= cartSlice.actions;

export default cartSlice.reducer;