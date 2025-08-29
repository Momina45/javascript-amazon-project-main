export let cart = JSON.parse(localStorage.getItem('cart'));

    if(!cart){
        cart = 
    [{
    productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity:2
},{
    productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity:1
}];
    }
    export function updateQuantity(productId,newQuantity){
        cart.forEach((item)=>{
            if(item.productId === productId){
                item.quantity = newQuantity;
                saveToStorage();
            }
        })
    }

    function saveToStorage(){
        localStorage.setItem('cart',JSON.stringify(cart));
    }

    export function calculateQuantity(){
    let quantity = 0;
    
            cart.forEach((item) => {
                quantity += item.quantity;
            });
    
              return quantity;
        }
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
        });
        }
        saveToStorage();
    }

    export function RemovefromCart(productId){
        let newCart = [];
        cart.forEach((cartItem)=>{
            if(cartItem.productId !== productId){
                newCart.push(cartItem);
            }
        })
        cart = newCart;

        saveToStorage();
    }