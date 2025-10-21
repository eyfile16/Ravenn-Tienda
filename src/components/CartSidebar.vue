<template>
  <transition name="slide-fade">
    <div v-if="isCartOpen" class="cart-sidebar">
      <div class="cart-header">
        <h2>🛍️ Mi Carrito ({{ cartCount }})</h2>
        <button @click="toggleCart" class="close-btn">×</button>
      </div>

      <div v-if="cart.length" class="cart-items">
        <div v-for="item in cart" :key="item.uniqueId" class="cart-item">
          <img :src="item.images[0]" :alt="item.name" class="item-img" />
          
          <div class="item-details">
            <div class="item-title-row">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-size">Talla: {{ item.size }}</span>
            </div>
            
            <div class="item-price-row">
                <span class="item-price">${{ item.price.toLocaleString('es-CO') }} c/u</span>
            </div>

            <div class="item-actions">
              <div class="quantity-controls">
                <button @click="decrementQuantity(item)" :disabled="item.quantity === 1">-</button>
                <span class="quantity">{{ item.quantity }}</span>
                <button @click="incrementQuantity(item)">+</button>
              </div>
              
              <span class="item-subtotal">
                Total: **${{ (item.price * item.quantity).toLocaleString('es-CO') }}**
              </span>
              
              <button @click="removeItem(item)" class="remove-btn">Eliminar</button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-cart">
        <p>Tu carrito está vacío. ¡Empieza a comprar!</p>
      </div>

      <div class="cart-footer">
        <div class="subtotal-row">
          <span>Subtotal:</span>
          <span class="subtotal-amount">${{ subtotal.toLocaleString('es-CO') }}</span>
        </div>
        
        <a 
          :href="whatsappLink" 
          target="_blank" 
          class="checkout-btn"
          :class="{ 'disabled': cart.length === 0 }"
          @click="cart.length > 0 ? null : $event.preventDefault()"
        >
          📲 Finalizar Pedido por WhatsApp
        </a>
        <p class="whatsapp-note">Te contactaremos al **{{ WHATSAPP_NUMBER }}**</p>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useCart } from '../stores/cartStore';
import { toRefs } from 'vue'; // 👈 1. IMPORTAR toRefs

const cartStore = useCart();

// 2. Usar toRefs para desestructurar las propiedades que son reactivas
// (las que cambian, como isCartOpen y cart)
const { 
  isCartOpen, // AHORA es reactiva
  WHATSAPP_NUMBER,
  cart,       // AHORA es reactiva
} = toRefs(cartStore);

// 3. Las funciones (acciones) y computed properties se pueden desestructurar
// del objeto store directamente, ya que son funciones o computed()
const {
  toggleCart, 
  cartCount, 
  subtotal, 
  whatsappLink, 
  incrementQuantity, 
  decrementQuantity, 
  removeItem 
} = cartStore; // O useCart() si quieres desestructurarlas en una línea
</script>

<style scoped>
/* [Tus estilos aquí] - No los incluyo por brevedad, pero mantenlos igual. */
/* ... */
.slide-fade-enter-active, .slide-fade-leave-active { transition: transform 0.3s ease-out; }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateX(100%); }
.cart-sidebar {
  position: fixed; top: 0; right: 0; width: 100%; max-width: 400px; height: 100%;
  background-color: var(--background-secondary); box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
  z-index: 2000; display: flex; flex-direction: column; color: var(--text-color);
}
.cart-header { padding: 15px 20px; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center; }
.cart-header h2 { font-size: 1.5rem; margin: 0; color: var(--primary-color); }
.close-btn { background: none; border: none; font-size: 2rem; cursor: pointer; color: var(--text-light); }
.cart-items { flex-grow: 1; overflow-y: auto; padding: 10px 20px; }
.empty-cart { padding: 20px; text-align: center; color: var(--text-light); }
.cart-item { display: flex; gap: 15px; padding: 15px 0; border-bottom: 1px dashed #f0f0f0; }
.item-img { width: 80px; height: 80px; object-fit: cover; border-radius: 5px; }
.item-details { flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; }
.item-title-row { display: flex; flex-direction: column; margin-bottom: 5px; }
.item-name { font-weight: bold; font-size: 1rem; color: var(--text-color); }
.item-size { font-size: 0.9rem; color: var(--highlight-color); font-weight: 600; }
.item-price-row { margin-bottom: 10px; }
.item-price { font-size: 0.9rem; color: var(--text-light); }
.item-actions { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.item-subtotal { font-size: 1rem; color: var(--primary-color); font-weight: 500; }
.quantity-controls { display: flex; align-items: center; border: 1px solid #ccc; border-radius: 5px; overflow: hidden; }
.quantity-controls button { background: var(--background-main); border: none; padding: 5px 10px; cursor: pointer; font-weight: bold; transition: background-color 0.2s; color: var(--text-color); }
.quantity-controls button:hover:not(:disabled) { background-color: #e0e0e0; }
.quantity-controls button:disabled { cursor: not-allowed; opacity: 0.5; }
.quantity { padding: 0 10px; font-size: 1rem; }
.remove-btn { background: none; border: none; color: #ff4d4d; font-size: 0.85rem; cursor: pointer; padding: 5px 0; transition: color 0.2s; }
.remove-btn:hover { color: #cc0000; }
.cart-footer { padding: 20px; border-top: 2px solid var(--accent-color); }
.subtotal-row { display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: bold; margin-bottom: 15px; color: var(--text-color); }
.subtotal-amount { color: var(--highlight-color); }
.checkout-btn { display: block; width: 100%; padding: 15px; text-align: center; background-color: #25d366; color: white; text-decoration: none; border-radius: 8px; font-size: 1.1rem; font-weight: bold; transition: background-color 0.3s; }
.checkout-btn:hover { background-color: #1da851; }
.checkout-btn.disabled { background-color: #a0a0a0; cursor: not-allowed; }
.whatsapp-note { font-size: 0.8rem; text-align: center; margin-top: 10px; color: var(--text-light); }
@media (max-width: 600px) {
  .cart-sidebar { width: 100%; max-width: none; }
  .item-actions { flex-wrap: wrap; justify-content: space-around; }
  .item-subtotal { flex-basis: 100%; text-align: center; margin-top: 5px; }
}
</style>