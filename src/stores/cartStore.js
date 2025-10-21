import { reactive, computed } from 'vue';

// Define el número de WhatsApp
const WHATSAPP_NUMBER = '3134779061'; 

const state = reactive({
  cart: [],
  isCartOpen: false,
});

// Función para inicializar o usar el carrito (función Pinia simulada)
export function useCart() {
  
  // Computed: Cantidad total de artículos en el carrito (contando cantidades)
  const cartCount = computed(() => {
    return state.cart.reduce((total, item) => total + item.quantity, 0);
  });

  // Computed: Cálculo del subtotal
  const subtotal = computed(() => {
    return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  });

  // Computed: Generación del enlace de WhatsApp con el pedido
  const whatsappLink = computed(() => {
    if (state.cart.length === 0) {
      return `https://wa.me/${WHATSAPP_NUMBER}`;
    }

    let message = `¡Hola Ravenn! Me gustaría hacer el siguiente pedido:\n\n`;
    
    state.cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   - Talla: ${item.size}\n`;
      message += `   - Cantidad: ${item.quantity}\n`;
      message += `   - Precio Unitario: $${item.price.toLocaleString('es-CO')}\n`;
      message += `   - Subtotal Artículo: $${(item.price * item.quantity).toLocaleString('es-CO')}\n`;
      message += `------------------\n`;
    });
    
    message += `\n*TOTAL DEL PEDIDO: $${subtotal.value.toLocaleString('es-CO')}*`;
    
    // Codifica el mensaje para la URL
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  });

  // Función: Alternar la visibilidad del carrito
  function toggleCart() {
    state.isCartOpen = !state.isCartOpen;
  }

  /**
   * FUNCIÓN CRÍTICA CORREGIDA: Agrega un producto al carrito.
   * Ahora usa el ID + TALLA como identificador único.
   */
  function addToCart(product) {
    if (!product.size) {
        console.error('La talla es requerida para añadir al carrito.');
        return;
    }

    // Crea un identificador único que incluye el ID del producto y la talla
    const uniqueId = `${product.id}-${product.size}`;

    // Busca si el producto con *esa talla específica* ya existe en el carrito
    const existingItem = state.cart.find(item => item.uniqueId === uniqueId);

    if (existingItem) {
      // Si existe, solo incrementa la cantidad
      existingItem.quantity += 1;
    } else {
      // Si no existe, agrégalo como un nuevo elemento
      state.cart.push({
        ...product,
        uniqueId: uniqueId, // Agregamos el uniqueId al objeto del carrito para consistencia
        quantity: 1,
      });
    }
    
    // Abre el carrito automáticamente
    state.isCartOpen = true; 
    console.log(`Producto añadido: ${product.name} (Talla ${product.size})`);
  }

  // Función: Incrementar la cantidad de un artículo existente
  function incrementQuantity(itemToUpdate) {
    const existingItem = state.cart.find(item => item.uniqueId === itemToUpdate.uniqueId);
    if (existingItem) {
      existingItem.quantity += 1;
    }
  }

  // Función: Decrementar la cantidad de un artículo existente
  function decrementQuantity(itemToUpdate) {
    const existingItem = state.cart.find(item => item.uniqueId === itemToUpdate.uniqueId);
    if (existingItem && existingItem.quantity > 1) {
      existingItem.quantity -= 1;
    }
  }

  // Función: Eliminar un artículo completamente del carrito
  function removeItem(itemToRemove) {
    state.cart = state.cart.filter(item => item.uniqueId !== itemToRemove.uniqueId);
  }

  return {
    // Estado y Getters
    cart: computed(() => state.cart),
    isCartOpen: computed(() => state.isCartOpen),
    cartCount,
    subtotal,
    whatsappLink,
    WHATSAPP_NUMBER, // Exponer el número de contacto

    // Acciones
    toggleCart,
    addToCart,
    incrementQuantity,
    decrementQuantity,
    removeItem,
  };
}