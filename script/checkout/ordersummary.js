import { cart, removeFromCart, updateDeliveryOption, updateQuantity } from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';

export function renderOrderSummary() {
  let cartSummaryHTML = '';

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingProduct = getProduct(productId);
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">${matchingProduct.name}</div>
            <div class="product-price">$${formatCurrency(matchingProduct.priceCents)}</div>

            <div class="product-quantity js-quantity-control-${matchingProduct.id}">
              <span>
                Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
              </span>

              <input 
                type="number"
                min="1" max="1000"
                class="quantity-input link-invisible js-quantity-input-${matchingProduct.id}"
                value="${cartItem.quantity}"
              >

              <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                Update
              </span>

              <span class="save-quantity-link link-primary link-invisible js-save-link" data-product-id="${matchingProduct.id}">
                Save
              </span>

              <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">Choose a delivery option:</div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';

    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
      const dateString = deliveryDate.format('dddd, MMMM D');

      const priceString = deliveryOption.priceCents === 0
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
        <div class="delivery-option js-delivery-option"
          data-product-id="${matchingProduct.id}"
          data-delivery-option-id="${deliveryOption.id}">
          <input type="radio"
            ${isChecked ? 'checked' : ''}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">${dateString}</div>
            <div class="delivery-option-price">${priceString} Shipping</div>
          </div>
        </div>
      `;
    });

    return html;
  }

  // Render to DOM
  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  // Delete product
  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  // Change delivery option
  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  // Handle Update click
  document.querySelectorAll('.js-update-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(`.js-quantity-control-${productId}`);
      container.querySelector('.quantity-label').classList.add('link-invisible');
      container.querySelector('.js-update-link').classList.add('link-invisible');
      container.querySelector('.js-save-link').classList.remove('link-invisible');
      container.querySelector(`.js-quantity-input-${productId}`).classList.remove('link-invisible');
      container.querySelector(`.js-quantity-input-${productId}`).focus();
    });
  });

  // Handle Save click
  document.querySelectorAll('.js-save-link').forEach((saveBtn) => {
    saveBtn.addEventListener('click', () => {
      const productId = saveBtn.dataset.productId;
      const input = document.querySelector(`.js-quantity-input-${productId}`);
      handleQuantityUpdate(productId, input);
    });
  });

  function handleQuantityUpdate(productId, input) {
    const newQuantity = Number(input.value);

    if (newQuantity <= 0 || newQuantity > 1000) {
      alert('Enter a valid quantity (1-1000).');
      return;
    }

    updateQuantity(productId, newQuantity);
    renderOrderSummary();
    renderPaymentSummary();
  }
}
