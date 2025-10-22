<template>
    <div class="product-page">
        
<div class="filter-controls">
            <input 
                type="text" 
                v-model="searchTerm" 
                placeholder="Buscar por nombre o descripción..." 
                class="search-input"
            />
            
            <div class="brand-filters">
                <button 
                    @click="selectBrand(null)"
                    :class="{ 'active-brand': selectedBrand === null }"
                    class="btn-brand"
                >
                    Todos
                </button>
                <button 
                    v-for="brand in uniqueBrands" 
                    :key="brand"
                    @click="selectBrand(brand)"
                    :class="{ 'active-brand': selectedBrand === brand }"
                    class="btn-brand"
                >
                    {{ brand }}
                </button>
            </div>
        </div>
        
        <div class="product-grid">
            <div 
                v-for="product in filteredProducts" 
                :key="product.id" 
                class="product-card"
            >
                <img :src="product.image" :alt="product.name" class="product-img" />
                <div class="product-info">
                    <h3>{{ product.name }}</h3>
                    <p class="price">${{ product.price.toLocaleString('es-CO') }}</p>
                    <button class="btn-detail" @click="openModal(product)">Seleccionar Talla</button>
                </div>
            </div>

            <p v-if="filteredProducts.length === 0" class="no-results">
                No se encontraron modelos que coincidan con los filtros aplicados.
            </p>
        </div>

        <transition name="modal-fade">
            <div v-if="showModal && selectedProduct" class="modal-overlay" @click.self="closeModal">
                <div class="modal-content">
                    <button class="modal-close" @click="closeModal">×</button>
                    
                    <div class="detail-container">
                        <div class="image-gallery">
                            <img :src="selectedProduct.image" :alt="selectedProduct.name" class="main-image" />
                        </div>

                        <div class="product-summary">
                            <h1>{{ selectedProduct.name }}</h1>
                            <p class="description">
                                {{ selectedProduct.description || 'Máxima respuesta y confort para tu día a día.' }}
                            </p>
                            
                            <div class="size-selector">
                                <label>Talla (33-42):</label>
                                <div class="size-options">
                                    <button 
                                        v-for="size in sizes" 
                                        :key="size"
                                        @click="selectedSize = size"
                                        :class="{ 'active-size': selectedSize === size }"
                                    >
                                        {{ size }}
                                    </button>
                                </div>
                            </div>

                            <p v-if="!selectedSize && attemptToAdd" class="validation-message">
                                ⚠️ **Debes seleccionar una talla** para añadir al carrito.
                            </p>

                            <div class="price-section">
                                <span class="price-tag">${{ selectedProduct.price.toLocaleString('es-CO') }}</span>
                            </div>
                            
                            <div class="action-buttons">
                                <button class="btn-add" @click="addItemToCart(selectedProduct)">Añadir al Carrito</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'; 
import { useCart } from '../stores/cartStore'; 

const { addToCart } = useCart();

// --- ESTADO DE FILTROS ---
const searchTerm = ref('');
const selectedBrand = ref(null);

// --- ESTADO DEL MODAL / TALLAS ---
const sizes = ref(Array.from({length: 10}, (_, i) => 33 + i)); // RANGO DE TALLAS: 33 a 42
const selectedSize = ref(null);
const attemptToAdd = ref(false); 
const showModal = ref(false);
const selectedProduct = ref(null);

// --- PRODUCTOS DEPORTIVOS (LISTA COMPLETA) ---
const products = ref([
    { id: 1, name: 'NIKE P-6000', price: 120000, brand: 'Nike', image: 'https://standshop.com.co/wp-content/uploads/2025/09/a741251e-fb5d-4b41-92be-5e3793fc204f.jpeg', description: 'Deportivas clásicas con diseño futurista.' }, 
    { id: 2, name: 'NIKE P-6000 BLACK', price: 120000, brand: 'Nike', image: 'https://tenisshoponline.com/images/articulos/0790947c1de3dbf28d05db2ffe026500.jpeg', description: 'Deportivas clásicas con diseño futurista.' }, 
    { id: 3, name: 'NIKE P-6000 ROJA', price: 120000, brand: 'Nike', image: 'https://do9uy4stciz2v.cloudfront.net/-MvRl43bvl8SiUeaP_Nz/products_600/-OM_O1CeaftTiCsnyG6V.jpg', description: 'Deportivas clásicas con diseño futurista.' },
    { id: 4, name: 'NEW BALANCE 9060 GRIS', price: 120000, brand: 'New Balance', image: 'https://tenisi.co/cdn/shop/files/13BE27D9-3008-42E8-8615-753B8297727C.jpg?v=1709252882', description: 'Comodidad superior en tono gris moderno.' }, 
    { id: 5, name: 'NEW BALANCE 9060 BEIGE', price: 120000, brand: 'New Balance', image: 'https://http2.mlstatic.com/D_NQ_NP_600721-MLV85257186039_052025-O.webp', description: 'Comodidad superior en tono gris moderno.' },
    { id: 6, name: 'NEW BALANCE 9060 NEGRO', price: 120000, brand: 'New Balance', image: 'https://cucutatenis.com/cdn/shop/files/06B0C94C-1FF5-4951-8DCE-8DFD1B52A96C.jpg?v=1753045333&width=720', description: 'Versión totalmente negra del modelo 9060.' }, 
    { id: 7, name: 'NEW BALANCE 530', price: 120000, brand: 'New Balance', image: 'https://http2.mlstatic.com/D_NQ_NP_922699-MCO92054399359_092025-O.webp', description: 'Versión clásica y cómoda del modelo 530.' },
    { id: 8, name: 'NEW BALANCE 530 BEIGE', price: 120000, brand: 'New Balance', image: 'https://lasociedadelsneaker.com/wp-content/uploads/2024/10/NEW-BALANCE-530-BEIGE-1-300x300.jpg', description: 'Versión clásica y cómoda del modelo 530.' }, 
    { id: 9, name: 'NIKE RUN V2K MARRON', price: 115000, brand: 'Nike', image: 'https://offclub.com.co/cdn/shop/files/4e0e4f2a-5c2b-4dff-a1ae-b30916dc5021.jpg?v=1757547616', description: 'Estilo runner retro en tonos marrones.' }, 
    { id: 10, name: 'NIKE VOMERO 5 NEGRO', price: 120000, brand: 'Nike', image: 'https://oficialamici.com/wp-content/uploads/2025/06/NIKE-VOMERO-BLANCA-PLATEADA-600x600.jpg', description: 'Amortiguación avanzada para running.' }, 
    { id: 11, name: 'NIKE VOMERO 5 LILA', price: 120000, brand: 'Nike', image: 'https://yeeshopctg.com/cdn/shop/files/WhatsApp_Image_2025-10-07_at_3.39.56_AM.jpg?v=1759826426', description: 'Amortiguación avanzada para running.' },
    { id: 12, name: 'NIKE VOMERO 5 BEIGE', price: 120000, brand: 'Nike', image: 'https://tenisi.co/cdn/shop/files/0B62A03C-638B-4518-A24A-567E12149B64_grande.jpg?v=1747795958', description: 'Amortiguación avanzada para running.' }, 
    { id: 13, name: 'PUMA RACER BEIGE', price: 115000, brand: 'Puma', image: 'https://tiendaesmeralda.co/cdn/shop/files/WhatsApp_Image_2025-02-13_at_17.37.46_800x.jpg?v=1739532558', description: 'Modelo deportivo casual con suela prominente.' }, 
    { id: 14, name: 'PUMA RACER NEGROS', price: 115000, brand: 'Puma', image: 'https://estilotropical.com.co/cdn/shop/files/zapatillas_street_rise_negro_rojo_2.webp?v=1754937942&width=1080', description: 'Modelo deportivo casual con suela prominente.' }, 
    { id: 15, name: 'PUMA RACER BLANCO', price: 115000, brand: 'Puma', image: 'https://cucutatenis.com/cdn/shop/files/12073EB2-0E17-4D6D-8019-48BACD409B18.jpg?v=1729288983&width=720', description: 'Modelo deportivo casual con suela prominente.' },
    { id: 16, name: 'PUMA RACER DAMA', price: 115000, brand: 'Puma', image: 'https://cucutatenis.com/cdn/shop/files/C328647A-FEA7-4993-9F7A-2574E17962C3.jpg?v=1728997606&width=600', description: 'Modelo deportivo casual con suela prominente para dama.' }, 
    { id: 17, name: 'CONVERSE BLANCO', price: 110000, brand: 'Converse', image: 'https://granpromocion.com/cdn/shop/files/1747262357Mesa_20de_20trabajo_201_800x.png?v=1759926540', description: 'Modelo clásico de lona, versátil y atemporal.' },
    { id: 18, name: 'CONVERSE ROJO', price: 110000, brand: 'Converse', image: 'https://granpromocion.com/cdn/shop/files/1747262357Mesa_de_trabajo_3_800x.png?v=1759928333', description: 'Modelo clásico de lona, versátil y atemporal.' },
    { id: 19, name: 'CONVERSE NEGRO', price: 110000, brand: 'Converse', image: 'https://tiendaesmeralda.co/cdn/shop/files/IMG_9230_1_1200x.jpg?v=1749311439', description: 'Modelo clásico de lona, versátil y atemporal.' },
    { id: 20, name: 'NIKE CORTEZ NEGRO', price: 110000, brand: 'Nike', image: 'https://http2.mlstatic.com/D_NQ_NP_2X_714351-MLV88697940862_072025-N.webp', description: 'Clásico de los 70s, ligero y con estilo retro.' },
    { id: 21, name: 'NIKE CORTEZ BLANCO', price: 110000, brand: 'Nike', image: 'https://sumerlabs.com/default/image-tool-lambda?new-width=0&new-height=0&new-quality=25&url-image=https://sumerlabs.com/prod/catalogue/b618174bea20d0fddb3384e38f1956eeeb0fd9fd/cb241e22-2784-4242-aeb5-9de6d64424d1.jpg', description: 'Clásico de los 70s, ligero y con estilo retro.' },
    { id: 22, name: 'NIKE CORTEZ ROJO', price: 110000, brand: 'Nike', image: 'https://cucutatenis.com/cdn/shop/files/E4E60371-12FE-4EC7-BEB1-E363EE6B691A.jpg?v=1738855943&width=600', description: 'Clásico de los 70s, ligero y con estilo retro.' },
    { id: 23, name: 'NIKE BAILLELI BLANCO', price: 110000, brand: 'Nike', image: 'https://zshopp.com/wp-content/uploads/2024/08/Tenis-Zapatillas-Nike-Bailleli-Unisex-9.webp', description: 'Diseño ligero y transpirable ideal para el día a día.' }, 
    { id: 24, name: 'NIKE BAILLELI GRIS', price: 110000, brand: 'Nike', image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQuM_3O8GLi-Ha6jzy-Sfceu0VZqW2BwVheQ8qPv2NGlONmi7R9', description: 'Diseño ligero y transpirable ideal para el día a día.' }, 
    { id: 25, name: 'NIKE BAILLELI NEGRO', price: 110000, brand: 'Nike', image: 'https://sjinfinity.store/cdn/shop/files/1739918507IMG-20250215-WA0010.jpg?v=1746908873&width=1445', description: 'Diseño ligero y transpirable ideal para el día a día.' },
    { id: 26, name: 'NIKE BAILLELI CEBRA', price: 110000, brand: 'Nike', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1jVMXxlu-szwmeMwCuJUJ09HgRorCAUQKbhBPPUEbxdXl9h1j', description: 'Diseño ligero y transpirable con patrón cebra.' },
    { id: 27, name: 'NIKE RUN V2K METALICOS', price: 120000, brand: 'Nike', image: 'https://olimpoxxi.com/wp-content/uploads/2025/05/Imagen-de-WhatsApp-2025-05-27-a-las-18.16.12_1663ea77.jpg', description: 'Runner moderno y versátil en tonos metálicos.' }, 
    { id: 28, name: 'NIKE RUN V2K CAFÉ', price: 120000, brand: 'Nike', image: 'https://i.pinimg.com/236x/37/28/8f/37288fab3b4b7f8a31215460e0e874ea.jpg', description: 'Runner moderno y versátil en tonos café.' },
    { id: 29, name: 'NIKE RUN V2K NEGROS', price: 120000, brand: 'Nike', image: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSVCO3J8XMxiW-PTH01C0OSfaJUb0pmMLpE3agY5Li7-riRjS-m', description: 'Runner moderno y versátil en tonos negros.' },
    { id: 30, name: 'ADIDAS ULTRA RUNNING', price: 120000, brand: 'Adidas', image: 'https://cucutatenis.com/cdn/shop/files/IMG-5307.jpg?v=1756319651&width=600', description: 'Máxima respuesta y confort en color negro.' },
    { id: 31, name: 'ADIDAS ULTRA RUN AZUL', price: 120000, brand: 'Adidas', image: 'https://cucutatenis.com/cdn/shop/files/8FD8D324-6F83-4813-9EB1-039B50D607F0.jpg?v=1731020979', description: 'Máxima respuesta y confort en color azul.' },
    { id: 32, name: 'ADIDAS ULTRA BOOST NEGRO', price: 120000, brand: 'Adidas', image: 'https://http2.mlstatic.com/D_NQ_NP_944226-MCO80165099026_112024-O.webp', description: 'Máxima respuesta y confort en color negro.' }, 
    { id: 33, name: 'ADIDAS ULTRA BOOST AZUL', price: 120000, brand: 'Adidas', image: 'https://riccistore.com/cdn/shop/files/17399760611004284549.jpg?v=1744313459&width=1920', description: 'Máxima respuesta y confort en color azul.' }, 
    { id: 34, name: 'ADIDAS ULTRA BOOST GRIS', price: 120000, brand: 'Adidas', image: 'https://kajustore.com.co/cdn/shop/files/151d35b5744d672da2c9e44ccfbc5439.jpg?v=1732582069&width=533', description: 'Máxima respuesta y confort en color gris.' }, 
    { id: 35, name: 'ADIDAS ULTRA BOOST BLANCO', price: 120000, brand: 'Adidas', image: 'https://riccistore.com/cdn/shop/files/17399760601004489965.jpg?v=1744313459&width=1920', description: 'Máxima respuesta y confort en color blanco.' }, 
    { id: 36, name: 'ADIDAS ULTRA BOOST 2 ORO ROSA', price: 115000, brand: 'Adidas', image: 'https://cucutatenis.com/cdn/shop/files/46F4415F-67B5-42C5-9AB2-6D68A6096108.jpg?v=1728596899&width=600', description: 'Segunda generación con detalles en oro rosa.' }, 
    { id: 37, name: 'ADIDAS ULTRA BOOST 2 BLACK', price:115000, brand: 'Adidas', image: 'https://cucutatenis.com/cdn/shop/files/6ACF426A-9A68-464B-9CD5-3DA4F30417AF.jpg?v=1728596995&width=720', description: 'Segunda generación en color negro clásico.' },
    { id: 38, name: 'ADIDAS ULTRA BOOST 2 LILA', price: 115000, brand: 'Adidas', image: 'https://cucutatenis.com/cdn/shop/files/F2BA5AD7-B352-4508-915A-AA63818535E5.jpg?v=1728596959&width=600', description: 'Segunda generación en un llamativo tono lila.' },
    { id: 39, name: 'ADIDAS ULTRA BOOST 2 NEGRA', price: 115000, brand: 'Adidas', image: 'https://bysterlin.store/cdn/shop/files/WhatsAppImage2025-02-28at16.38.45_1.jpg?v=1750344611&width=1946', description: 'Diseño actualizado y elegante en negro.' },
    { id: 40, name: 'ADIDAS ULTRA BOOST 2 GRIS', price: 115000, brand: 'Adidas', image: 'https://viari.com.co/cdn/shop/files/GISSALMONM_1.jpg?v=1738702537&width=1445', description: 'Modelo deportivo con detalles modernos en gris.' },
    { id: 41, name: 'ADIDAS ULTRA BOOST 2 BLANCO', price: 115000, brand: 'Adidas', image: 'https://cucutatenis.com/cdn/shop/files/8C20A342-3175-4E6B-9259-FBB909947E31.jpg?v=1731012575&width=720', description: 'Versión limpia y versátil en color blanco.' },
    { id: 42, name: 'NIKE SKATE BLANCO', price: 110000, brand: 'Nike', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTmIYvLHUvj6kTLdelRxA_rQvPn-l1tmn7yVmAglKHc7uRrmJW', description: 'Estilo de skate casual y resistente.' }, 
    { id: 43, name: 'NIKE SKATE BEIGE', price: 110000, brand: 'Nike', image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSaTJFnJuLi1WPOlhagGLGQo3Ff6Rl0zXTLLVu5JjcTzMRE_0pt', description: 'Estilo de skate casual y resistente.' },
    { id: 44, name: 'NIKE SKATE GRIS', price: 110000, brand: 'Nike', image: 'https://tiendacreta.com/cdn/shop/files/TenisSkate_Imagen_1.webp?v=1758075920', description: 'Estilo de skate casual y resistente.' },
    { id: 45, name: 'NIKE SKATE ROSA', price: 110000, brand: 'Nike', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLZdCh-YQp5q3y1DuCGXdgGCerC7KJfTqcs-I_NkPIc99vwql9', description: 'Estilo de skate casual y resistente.' },
    { id: 46, name: 'HUGO BOSS BLANCO', price: 115000, brand: 'Hugo Boss', image: 'https://cucutatenis.com/cdn/shop/files/6EE2D0F3-1D2E-4E95-8B5F-E50268901081.jpg?v=1758637372&width=600', description: 'Diseño elegante y minimalista de la marca Hugo Boss.' },
    { id: 47, name: 'HUGO BOSS MIEL', price: 115000, brand: 'Hugo Boss', image: 'https://cucutatenis.com/cdn/shop/files/8468EFDB-04C8-4789-8371-E12F9ABC30EA.jpg?v=1758637327&width=600', description: 'Diseño elegante y minimalista de la marca Hugo Boss.' },
    { id: 48, name: 'HUGO BOSS AZUL', price: 115000, brand: 'Hugo Boss', image: 'https://cucutatenis.com/cdn/shop/files/D652F631-E719-45A5-88DB-999BC448C164.jpg?v=1758637186&width=600', description: 'Diseño elegante y minimalista de la marca Hugo Boss.' },
    { id: 49, name: 'HUGO BOSS NEGRO', price: 115000, brand: 'Hugo Boss', image: 'https://cucutatenis.com/cdn/shop/files/11015A9A-4AD6-499C-957C-945444E97109.jpg?v=1758637079', description: 'Diseño elegante y minimalista de la marca Hugo Boss.' },
    { id: 50, name: 'CLAUDTEC ULTRALIVIANO BLANCO', price: 120000, brand: 'Claudtec', image: 'https://ianeotech.com/cdn/shop/files/51232f37-3834-401d-a59f-78f9b2eb623c.jpg?v=1756926335', description: 'Máxima ligereza para correr o caminar.' },
    { id: 51, name: 'CLAUDTEC ULTRALIVIANO NEGRO', price: 120000, brand: 'Claudtec', image: 'https://estilotropical.com.co/cdn/shop/files/zapatillas_cloud_running_negro_blanco.webp?v=1754939040&width=1080', description: 'Máxima ligereza para correr o caminar.' },
    { id: 52, name: 'CLAUDTEC ULTRALIVIANO GRIS', price: 120000, brand: 'Claudtec', image: 'https://estilotropical.com.co/cdn/shop/files/zapatillas_cloud_running_gris.webp?v=1754939041&width=1080', description: 'Máxima ligereza para correr o caminar.' },
    { id: 53, name: 'TN AZUL', price: 115000, brand: 'Nike', image: 'https://http2.mlstatic.com/D_NQ_NP_878525-MCO90969041828_082025-O.webp', description: 'Modelo TN con detalles en azul vibrante.' },
    { id: 54, name: 'TN AMARILLO', price: 115000, brand: 'Nike', image: 'https://cymstore.com.uy/cdn/shop/files/WhatsAppImage2024-10-17at21.24.57.jpg?v=1745205800&width=533', description: 'Modelo TN con detalles en amarillo llamativo.' },
    { id: 55, name: 'TN MORADO', price: 115000, brand: 'Nike', image: 'https://moraazul-col.com/cdn/shop/files/1744640518IMG_0256.jpg?v=1749422718&width=1445', description: 'Modelo TN con detalles en morado.' }, 
]);

// --- LÓGICA DE FILTRADO Y BÚSQUEDA ---
const uniqueBrands = computed(() => {
    const brands = new Set(products.value.map(p => p.brand));
    return Array.from(brands).sort();
});

const selectBrand = (brand) => {
    selectedBrand.value = brand;
};

const filteredProducts = computed(() => {
    let filtered = products.value;
    const searchLower = searchTerm.value.toLowerCase();

    // Filtro por término de búsqueda (nombre o descripción)
    if (searchLower) {
        filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(searchLower) ||
            (product.description && product.description.toLowerCase().includes(searchLower))
        );
    }

    // Filtro por marca seleccionada
    if (selectedBrand.value) {
        filtered = filtered.filter(product => product.brand === selectedBrand.value);
    }

    return filtered;
});

// --- LÓGICA DEL MODAL Y CARRITO ---
const openModal = (product) => {
    selectedProduct.value = product;
    selectedSize.value = null; 
    attemptToAdd.value = false;
    showModal.value = true;
    document.body.style.overflow = 'hidden'; 
};

const closeModal = () => {
    showModal.value = false;
    selectedProduct.value = null;
    selectedSize.value = null; 
    attemptToAdd.value = false;
    document.body.style.overflow = ''; 
};

const addItemToCart = (product) => {
    attemptToAdd.value = true;

    // VALIDACIÓN: Talla requerida
    if (!selectedSize.value) {
        return;
    }
    
    addToCart({ 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        image: product.image, 
        size: selectedSize.value 
    }); 
    
    closeModal();
};
</script>

<style scoped>
/* ========================================================================= */
/* ESTILOS GENERALES Y TÍTULOS */
/* ========================================================================= */
.product-page { 
    padding: 20px; 
    text-align: center; 
    background-color: #f8f8f8; 
}

/* ========================================================================= */
/* ESTILOS DE FILTROS Y BÚSQUEDA */
/* ========================================================================= */
.filter-controls {
    max-width: 1200px;
    margin: 0 auto 30px auto; 
    padding: 0 20px;
    text-align: left;
}
.search-input {
    width: 100%;
    padding: 12px 15px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}
.brand-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
}
.btn-brand {
    padding: 8px 15px;
    border: 1px solid #7b4397; 
    border-radius: 20px;
    background-color: #f8f8f8;
    color: #7b4397;
    cursor: pointer;
    font-size: 0.9rem;
    white-space: nowrap;
    transition: background-color 0.3s, color 0.3s;
}
.btn-brand:hover {
    background-color: #e0e0e0;
}
.btn-brand.active-brand {
    background-color: #7b4397;
    color: white;
}
.no-results {
    grid-column: 1 / -1;
    text-align: center;
    color: #cc0000;
    font-size: 1.2rem;
    padding: 40px;
    background-color: #ffe5e5;
    border-radius: 8px;
}

/* ========================================================================= */
/* ESTILOS DEL PRODUCT GRID Y TARJETA */
/* ========================================================================= */
.product-grid { 
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
    gap: 30px; 
    justify-items: center; 
    max-width: 1200px; 
    margin: 0 auto; 
}
.product-card { 
    background: #ffffff; 
    border: 1px solid #eeeeee;
    border-radius: 10px; 
    overflow: hidden; 
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); 
    transition: transform 0.3s, box-shadow 0.3s; 
    width: 100%; 
    max-width: 350px; 
    height: 460px; 
    display: flex; 
    flex-direction: column; 
}
.product-card:hover { 
    transform: translateY(-5px); 
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15); 
}
.product-img { 
    width: 100%; 
    height: 250px; 
    object-fit: cover; 
    display: block;
}
.product-info { 
    padding: 15px; 
    text-align: left; 
    flex-grow: 1; 
    display: flex; 
    flex-direction: column;
}
.product-info h3 { 
    font-size: 1.4rem; 
    margin-top: 0; 
    margin-bottom: 5px; 
    color: #333; 
    display: -webkit-box;
    -webkit-line-clamp: 3; 
    -webkit-box-orient: vertical;
    overflow: hidden; 
    text-overflow: ellipsis; 
    height: 4.8rem; 
}
.price { 
    font-size: 1.5rem; 
    font-weight: bold; 
    color: #f07b14; 
    margin-bottom: 5px; 
}
/* BOTÓN DE SELECCIONAR TALLA - AJUSTADO AL DISEÑO SOLICITADO */
.btn-detail { 
    width: 100%; 
    padding: 12px 10px; /* Más relleno vertical */
    background-color: #ff6a00; /* Fondo morado */
    color: white; 
    border: none; 
    border-radius: 8px; /* Más redondeado */
    cursor: pointer; 
    font-size: 1rem; 
    font-weight: bold; /* Texto en negrita */
    transition: background-color 0.3s, box-shadow 0.3s; 
    margin-top: auto; 
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombra inicial (efecto de elevación) */
}
.btn-detail:hover { 
    background-color: #ff6a00; /* Morado más oscuro al pasar el ratón */
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15); /* Sombra más fuerte al pasar el ratón */
}

/* ========================================================================= */
/* ESTILOS DEL MODAL (Detalle de Producto) */
/* ========================================================================= */
/* Transición del modal */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-overlay { 
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
    background-color: rgba(0, 0, 0, 0.6); 
    display: flex; justify-content: center; align-items: center; 
    z-index: 1000; 
}
.modal-content { 
    background: #ffffff; 
    border-radius: 10px; 
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); 
    width: 90%; max-width: 1000px; max-height: 90vh; overflow-y: auto; 
    padding: 20px; position: relative; color: #333; 
}
.modal-close { 
    position: absolute; top: 10px; right: 15px; 
    background: none; border: none; 
    color: #666; font-size: 2rem; cursor: pointer; line-height: 1; 
}
.detail-container { 
    display: flex; 
    gap: 40px; 
    padding: 20px 0; 
}
.image-gallery { 
    flex: 1; 
    min-width: 350px; 
}
.main-image { 
    width: 100%; 
    height: 400px; 
    object-fit: cover; 
    border-radius: 8px; 
    margin-bottom: 10px; 
}
.product-summary { 
    flex: 1; 
    padding-top: 20px; 
}
.product-summary h1 { 
    font-size: 2.5rem; 
    margin-top: 0; 
    color: #7b4397; 
}
.description { 
    line-height: 1.6; 
    margin-bottom: 30px; 
    color: #666; 
}
.size-selector { 
    margin-bottom: 25px; 
}
.size-selector label { 
    display: block; 
    font-size: 1.1rem; 
    font-weight: bold; 
    color: #333; 
    margin-bottom: 10px; 
}
.size-options { 
    display: flex; 
    flex-wrap: wrap; 
    gap: 8px; 
}
.size-options button { 
    padding: 8px 12px; 
    background-color: #f8f8f8; 
    color: #333; 
    border: 1px solid #7b4397; 
    border-radius: 4px; 
    cursor: pointer; 
    font-weight: bold; 
    transition: background-color 0.2s, border-color 0.2s; 
}
.size-options button:hover { 
    background-color: #e0e0e0; 
}
.size-options button.active-size { 
    background-color: #7b4397; 
    color: white; 
    border-color: #7b4397; 
}
.validation-message {
    color: #cc0000; 
    font-weight: bold;
    margin-top: 15px;
    border: 1px solid #ffcccc;
    padding: 10px;
    background-color: #ffe5e5;
    border-radius: 4px;
    text-align: center;
}
.price-section { 
    margin-bottom: 40px; 
}
.price-tag { 
    font-size: 2.2rem; 
    font-weight: bold; 
    color: #f07b14; 
}
.action-buttons button { 
    padding: 15px 30px; 
    border: none; 
    border-radius: 5px; 
    font-size: 1.1rem; 
    cursor: pointer; 
    width: 100%; 
    transition: background-color 0.3s; 
}
.btn-add { 
    background-color: #f07b14; 
    color: white; 
    font-weight: bold; 
}
.btn-add:hover { 
    background-color: #ff6a00; 
}

/* Media Queries */
@media (max-width: 768px) {
    .modal-content { 
        padding: 10px; 
    }
    .filter-controls {
        padding: 0 10px;
    }
    .detail-container { 
        flex-direction: column; 
        gap: 20px; 
    }
    .image-gallery { 
        min-width: 100%; 
    }
    .main-image { 
        height: 300px; 
    }
    .product-summary h1 { 
        font-size: 2rem; 
    }
    .price-tag { 
        font-size: 2rem; 
    }
    .action-buttons { 
        display: flex; 
        flex-direction: column; 
        gap: 10px; 
    }
    .action-buttons button { 
        margin-right: 0; 
        width: 100%; 
    }
}
</style>