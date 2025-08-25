export let cart = [];

export function addToCart(productId){
        let selecterQuantity = document.querySelector(`.js-quantity-${productId}`)|| 1;
        let quantity = Number(selecterQuantity.value) || 1;

        let machingItem;
        cart.forEach((item)=>{
            if(productId === item.productId){
                machingItem = item;
            }
        });
        if(machingItem){
            machingItem.quantity += quantity;
        }
        else{
            cart.push({
                productId,
                quantity
        });}
    }