export const addDecimals=(num)=>{
    return (Math.round(num*100)/100).toFixed(2);
}

export const updateCart=(state,item)=>{
    const existItem = state.cartItems.find((x) => x._id === item._id);
  if (existItem) {
    // If exists, update quantity
    state.cartItems = state.cartItems.map((x) =>
      x._id === existItem._id ? item : x
    );
  } else {
    // If not exists, add new item to cartItems
    state.cartItems = [...state.cartItems, item];
  }
  
    //calcuate item price
    state.itemsPrice=addDecimals( state.cartItems.reduce((acc,item)=>acc+item.price*item.qty, 0));
    //tax price(15%)
    state.taxPrice=addDecimals(Number((0.15*state.itemsPrice).toFixed(2)));
    //shipping price (if order> 100$ = free)
    state.shippingPrice= addDecimals(state.itemsPrice>100? 0:10); 
    //total price
    state.totalPrice=(Number(state.itemsPrice)+ Number(state.shippingPrice)+Number(state.taxPrice)).toFixed(2);

    localStorage.setItem('cart',JSON.stringify(state));
    return state;
}