// stores/cartStore.js
import { reactive, computed } from 'vue';

const WHATSAPP_NUMBER = '3134779061'; 

const state = reactive({
    cart: [],
    isCartOpen: false,
    validationError: null,
});

export function useCart() {
    
    // Computed: Obtiene el mensaje de error para mostrarlo
    const validationMessage = computed(() => state.validationError);

    // Función para resetear el error
    function clearValidationError() {
        state.validationError = null;
    }

    // Función: Alternar la visibilidad del carrito
    function toggleCart(stateValue) {
        state.isCartOpen = stateValue === undefined ? !state.isCartOpen : stateValue;
        clearValidationError(); 
    }

    /**
     * FUNCIÓN CRÍTICA CON VALIDACIONES: Agrega un producto al carrito.
     * @param {object} product - Debe contener { id, name, price, image, size, [quantity] }
     */
    function addToCart(product) {
        clearValidationError(); // Limpia el error anterior

        // 🛑 VALIDACIÓN 1: ¿Se seleccionó la talla?
        if (!product.size || product.size === '') {
            state.validationError = `❌ Por favor, selecciona la talla del producto "${product.name}".`;
            state.isCartOpen = false; // No abras el carrito si hay error
            return;
        }
        
        // 🛑 VALIDACIÓN 2: ¿La cantidad es válida?
        const requestedQuantity = product.quantity || 1;
        if (requestedQuantity < 1) {
            state.validationError = `❌ La cantidad mínima a comprar es 1.`;
            state.isCartOpen = false; 
            return;
        }

        // Lógica de adición si las validaciones pasan
        const uniqueId = `${product.id}-${product.size}`;
        const existingItem = state.cart.find(item => item.uniqueId === uniqueId);

        if (existingItem) {
            existingItem.quantity += requestedQuantity;
        } else {
            // 💡 SOLUCIÓN AL PROBLEMA DE LA IMAGEN:
            // Guardamos la propiedad 'image' como 'images' (array) para que 
            // CartSidebar.vue pueda acceder a 'item.images[0]'
            state.cart.push({
                ...product,
                uniqueId: uniqueId,
                quantity: requestedQuantity,
                images: [product.image], // Convertimos la URL de la imagen en un array
            });
        }
        
        state.isCartOpen = true; // Abre el carrito
        state.validationError = null; // Asegura que se limpie el error si se abre el carrito
        console.log(`✅ Producto añadido: ${product.name} (Talla ${product.size})`);
    }

    // Computed: Cantidad total de artículos en el carrito
    const cartCount = computed(() => {
        return state.cart.reduce((total, item) => total + item.quantity, 0);
    });

    // Computed: Cálculo del subtotal
    const subtotal = computed(() => {
        return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    });

    // Computed: Generación del enlace de WhatsApp
    const whatsappLink = computed(() => {
        if (state.cart.length === 0) return `https://wa.me/${WHATSAPP_NUMBER}`;
        let message = `¡Hola Ravenn! Me gustaría hacer el siguiente pedido:\n\n`;
        state.cart.forEach((item, index) => {
            message += `${index + 1}. ${item.name}\n`;
            message += `   - Talla: ${item.size}\n`;
            message += `   - Cantidad: ${item.quantity}\n`;
            message += `   - Precio Unitario: $${item.price.toLocaleString('es-CO')}\n`;
            message += `   - Subtotal Artículo: $${(item.price * item.quantity).toLocaleString('es-CO')}\n`;
            message += `------------------\n`;
        });
        message += `\n*TOTAL DEL PEDIDO: $${subtotal.value.toLocaleString('es-CO')}*`;
        return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    });


    function incrementQuantity(itemToUpdate) {
        const existingItem = state.cart.find(item => item.uniqueId === itemToUpdate.uniqueId);
        if (existingItem) { existingItem.quantity += 1; }
    }

    function decrementQuantity(itemToUpdate) {
        const itemIndex = state.cart.findIndex(item => item.uniqueId === itemToUpdate.uniqueId);
        if (itemIndex > -1) { 
            if (state.cart[itemIndex].quantity > 1) { 
                state.cart[itemIndex].quantity -= 1; 
            } else {
                // Eliminar si llega a 1 y se intenta decrementar
                state.cart.splice(itemIndex, 1);
            }
        }
    }

    function removeItem(itemToRemove) {
        state.cart = state.cart.filter(item => item.uniqueId !== itemToRemove.uniqueId);
    }

    return {
        // Estado y Getters
        cart: computed(() => state.cart),
        isCartOpen: computed(() => state.isCartOpen),
        validationMessage,
        cartCount,
        subtotal,
        whatsappLink,
        WHATSAPP_NUMBER, 

        // Acciones
        toggleCart,
        addToCart,
        clearValidationError,
        incrementQuantity,
        decrementQuantity,
        removeItem,
    };
}