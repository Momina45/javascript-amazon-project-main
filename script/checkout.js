import {calculateQuantity, cart, RemovefromCart} from '../data/cart.js';
import {products} from '../data/products.js';
import {formatCurrency} from './utilis/money.js';
let cartSummary ='';
cart.forEach((cartItem) =>{
    const productId = cartItem.productId;
    let matchingProduct;
    products.forEach((product)=>{
        if(product.id === productId){
            matchingProduct = product;
        }
    })
cartSummary +=`<div class="cart-item-container 
    js-cart-item-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: Tuesday, June 21
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label update-save-link">${cartItem.quantity}</span>
                  </span>
                  <input class="quantity-input link-invisible">
                  <span class="update-quantity-link link-primary js-update-quantity-link update-save-link" data-product-id = "${matchingProduct.id}">
                    Update
                  </span>
                  <span class = "save-quantity-link link-primary link-invisible"> Save </span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id = "${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                <div class="delivery-option">
                  <input type="radio" checked
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      Tuesday, June 21
                    </div>
                    <div class="delivery-option-price">
                      FREE Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      Wednesday, June 15
                    </div>
                    <div class="delivery-option-price">
                      $4.99 - Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      Monday, June 13
                    </div>
                    <div class="delivery-option-price">
                      $9.99 - Shipping
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
});
    document.querySelector('.js-order-summary').innerHTML = cartSummary;
    let cartQuantity = calculateQuantity(); 
    document.querySelector('.js-items-count').innerHTML = `${cartQuantity}items`;

    document.querySelectorAll('.js-delete-link')
        .forEach((link)=>{
            link.addEventListener('click',()=>{
          const productId = link.dataset.productId;
          RemovefromCart(productId);
          const container = document.querySelector(`.js-cart-item-${productId}`);
            container.remove();
            });
        });

        let update = document.querySelectorAll('.js-update-quantity-link');
          update.forEach((link)=>{
            link.addEventListener('click',()=>{
              const productId = link.dataset.productId;
              console.log(productId);
              let cartItem = document.querySelector(`.js-cart-item-${productId}`);
              console.log(cartItem);
              cartItem.classList.add("is-editting-quantity");
              document.querySelector('.quantity-label').classList.add("is-editting-quantity");
              document.querySelector('.update-quantity-link').classList.add("is-editting-quantity");

              let saveBtn = document.querySelector('.save-quantity-link');
              saveBtn.addEventListener('click',()=>{
                let input = document.querySelector('.quantity-input');
                let quantityValue = input.value;
                document.querySelector('.quantity-label').innerHTML = quantityValue;
                cartItem.classList.remove("is-editting-quantity");
              })

            })
          })
