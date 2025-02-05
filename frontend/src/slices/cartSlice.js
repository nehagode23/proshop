import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";
const initialState = localStorage.getItem("cart")? JSON.parse(localStorage.getItem("cart")): {cartItems:[]};


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

        }
    },
});

export const {addToCart, removeFromCart}= cartSlice.actions;

export default cartSlice.reducer;