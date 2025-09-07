import { calculateQuantity, cart, RemovefromCart, updateQuantity } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utilis/money.js';
import { deliveryOptions } from './deliveryOptions.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

let cartSummary = '';
cart.forEach((cartItem) => {
  const productId = cartItem.productId;
  let matchingProduct;
  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  })  
  cartSummary += `<div class="cart-item-container 
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
                    Quantity: <span class="quantity-label update-save-link js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
                  </span>
                  <input class="quantity-input link-invisible js-quantity-input-${matchingProduct.id}">
                  <span class="update-quantity-link link-primary js-update-quantity-link update-save-link" data-product-id = "${matchingProduct.id}">
                    Update
                  </span>
                  <span class = "save-quantity-link link-primary link-invisible js-save-quantity-link" data-product-id = "${matchingProduct.id}"> Save </span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id = "${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                <div>
                  ${deliveryOptionsHTML(matchingProduct,cartItem)}
                    </div>
                  </div>
                </div> 
              </div>
            </div>
          </div>`;
});

function deliveryOptionsHTML(matchingProduct,cartItem){
  let html  = '';
  deliveryOptions.forEach((deliveryOption)=>{
    const today = dayjs();
    const deliverydate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliverydate.format('dddd, MMMM D');

    const priceCents = deliveryOption.priceCents;
    const pricestring = priceCents === 0 ? 'Free' : `$${formatCurrency(deliveryOption.priceCents)}`;

     const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    html += 
    `<div class="delivery-option">
        <input type="radio"
        ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${pricestring} - Shipping
          </div>
        </div>
      </div>`
  });
  return html;
}
document.querySelector('.js-order-summary').innerHTML = cartSummary;

document.querySelectorAll('.js-delete-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      RemovefromCart(productId);
      const container = document.querySelector(`.js-cart-item-${productId}`);
      container.remove();
      updateCartQuantity();
    });
  });

function updateCartQuantity() {
  let cartQuantity = calculateQuantity();
  document.querySelector('.js-items-count').innerHTML = `${cartQuantity}items`;
}
updateCartQuantity();

document.querySelectorAll('.js-update-quantity-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      let cartItem = document.querySelector(`.js-cart-item-${productId}`);
      cartItem.classList.add("is-editting-quantity");
    });
  });

document.querySelectorAll('.js-save-quantity-link')
  .forEach((saveBtn) => {
    const productId = saveBtn.dataset.productId;
    let quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
    saveBtn.addEventListener('click', () => {
      handleupdate(productId, quantityInput);
    });
    quantityInput.addEventListener('keydown',(event) =>{
      if(event.key === 'Enter'){
        handleupdate(productId, quantityInput);
      }
    })
  });
function handleupdate(productId, quantityInput) {
  const newQuantity = Number(quantityInput.value);
  if (newQuantity <= 0 || newQuantity > 1000) {
    alert('Please enter a valid quantity between 1 and 1000.');
    return;
  }
  updateQuantity(productId, newQuantity);
  const quantitylabel = document.querySelector(`.js-quantity-label-${productId}`);
  quantitylabel.innerHTML = newQuantity;

  updateCartQuantity();

  let cartItem = document.querySelector(`.js-cart-item-${productId}`);
  cartItem.classList.remove('is-editting-quantity');
}

