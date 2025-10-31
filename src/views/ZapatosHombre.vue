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
                <div class="image-wrapper">
                    <img :src="product.image" :alt="product.name" class="product-img-display" />
                </div>
                
                <div class="product-info">
                    <h3>{{ product.name }}</h3>
                    <p class="price">${{ product.price.toLocaleString('es-CO') }}</p>
                    
                    <button class="btn-detail" @click="openModal(product)">
                        <i class="fas fa-shoe-prints"></i> Seleccionar Talla
                    </button>
                    
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
                            <img :src="selectedProduct.image" :alt="selectedProduct.name" class="main-image-modal" />
                        </div>
                        
                        <div class="product-summary">
                            <h1>{{ selectedProduct.name }}</h1>
                            <p class="description">{{ selectedProduct.description }}</p>
                            
                            <div class="size-selector">
                                <label>Talla (33-43):</label>
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
                                ⚠️ Debes seleccionar una talla.
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

const searchTerm = ref('');
const selectedBrand = ref(null);
const sizes = ref(Array.from({length: 11}, (_, i) => 33 + i)); 
const selectedSize = ref(null);
const attemptToAdd = ref(false);

const products = ref([
    { id: 101, name: 'LOUIS VUITTON SKATE BLACK', price: 120000, brand: 'Louis Vuitton', image: 'https://cucutatenis.com/cdn/shop/files/81FDBF8B-E120-4C9D-AB79-066D4D26A63B.jpg?v=1741355708&width=720', description: 'Modelo Black elegante.' }, 
    { id: 102, name: 'LOUIS VUITTON SKATE WHITE', price: 120000, brand: 'Louis Vuitton', image: 'https://standshop.com.co/wp-content/uploads/2024/08/8dccb9f7-0f60-42a2-af6c-ba8d52286322.jpg', description: 'Modelo White limpio.' }, 
    { id: 103, name: 'LOUIS VUITTON SKATE NEGRO BLANCO', price: 120000, brand: 'Louis Vuitton', image: 'https://www.workshopcol.co/cdn/shop/products/image00011_8e1f472f-3b3d-4861-a2bb-bc802357440b.jpg?v=1679258792&width=1445', description: 'Modelo Negro y Blanco limpio.' }, 
    { id: 104, name: 'LOUIS VUITTON SKATE BEIGE', price: 120000, brand: 'Louis Vuitton', image: 'https://standshop.com.co/wp-content/uploads/2024/08/e5478c66-8c80-4044-b7ea-112e5a69391b.jpg', description: 'Diseño clásico y atemporal.' }, 
    
    { id: 105, name: 'DUNK SB NEGRO', price: 105000, brand: 'Nike', image: 'https://anval.com.co/wp-content/uploads/2024/12/0d42aa0e-7f37-467c-91ec-b3263c3cd10a.jpeg', description: 'Diseño clásico y atemporal en negro.' }, 
    { id: 106, name: 'DUNK DISRUTP PANDA', price: 105000, brand: 'Nike', image: 'https://dparadisestore.co/wp-content/uploads/2024/09/img_3917.jpeg', description: 'Estilo moderno con contraste Panda.' }, 
    
    { id: 107, name: 'RETRO 3 TRAVIS', price: 115000, brand: 'Jordan', image: 'https://veintedocetenis.com/cdn/shop/files/image00043_2e99ff92-3609-473d-a1e2-43d7e43aea1e.webp?v=1721846538&width=1445', description: 'Edición especial de colección.' }, 
    { id: 108, name: 'RETRO 1 TRAVIS', price: 110000, brand: 'Jordan', image: 'https://ae01.alicdn.com/kf/S3a65d9aa00ea499d9c170e5d1cee7110R.jpg', description: 'Un icono de la moda urbana.' }, 
    
    { id: 109, name: 'PUMA SUEDE BEIGE', price: 110000, brand: 'Puma', image: 'https://www.altagamapremium.com/cdn/shop/files/5F0AA8A5-585F-4D94-BD41-C7833F8FF891.jpg?v=1745854116&width=1445', description: 'Clásico suede en color beige.' }, 
    { id: 110, name: 'PUMA SUEDE BLANCO', price: 110000, brand: 'Puma', image: 'https://delcentropidelo.com/cdn/shop/files/C6FC2AA0-47CC-44DE-A748-815B2096BC80_1024x1024.jpg?v=1746560202', description: 'Clásico suede en color blanco.' }, 
    { id: 111, name: 'PUMA SUEDE CAFÉ', price: 110000, brand: 'Puma', image: 'https://i.pinimg.com/originals/4e/10/13/4e1013884dc435ace171d137b2950086.jpg', description: 'Clásico suede en tono café.' }, 
    
    { id: 112, name: 'ADIDAS SAMBA BLANCO', price: 100000, brand: 'Adidas', image: 'https://acdn-us.mitiendanube.com/stores/709/713/products/img_6739-7e5af73e1b50c8e95917455289194089-640-0.jpeg', description: 'Modelo Samba clásico en blanco.' }, 
    { id: 113, name: 'ADIDAS SAMBA NEGRO', price: 100000, brand: 'Adidas', image: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/4c70105150234ac4b948a8bf01187e0c_faec/Tenis_Samba_OG_Negro_B75807_db01_standard.tiff.jpg', description: 'Modelo Samba clásico en negro.' }, 
    { id: 114, name: 'ADIDAS SAMBA BEIGE', price: 100000, brand: 'Adidas', image: 'https://i.pinimg.com/736x/eb/8c/f3/eb8cf3ada9d4249d049bdc986dd60f66.jpg', description: 'Modelo Samba clásico en beige.' }, 
    { id: 115, name: 'ADIDAS SAMBA ESPECIAL', price: 100000, brand: 'Adidas', image: 'https://tiendavirtualcol.com/cdn/shop/files/1727916723WhatsAppImage2024-10-01at5.56.01PM.jpg?v=1740072198&width=1445', description: 'Edición especial del Samba.' }, 
    { id: 116, name: 'ADIDAS SAMBA PLATAFORMA BLANCO', price: 105000, brand: 'Adidas', image: 'https://jmsport.com.co/wp-content/uploads/2025/03/ADIDAS-SAMBA-PLATAFORMA-DAMA-Y-CABALLERO.jpg', description: 'Samba con plataforma en blanco.' }, 
    { id: 117, name: 'ADIDAS SAMBA PLATAFORMA NEGRO', price: 105000, brand: 'Adidas', image: 'https://zshopp.com/wp-content/uploads/2024/08/Tenis-Zapatillas-Adidas-Samba-plataforma-Para-Dama-1.webp', description: 'Samba con plataforma en negro.' }, 
    { id: 118, name: 'ADIDAS SAMBA PLATAFORMA VERDE', price: 105000, brand: 'Adidas', image: 'https://zshopp.com/wp-content/uploads/2020/11/Adidas-Samba-verde1.webp', description: 'Samba con plataforma en verde.' }, 
    
    { id: 119, name: 'DUNK OSITO', price: 107000, brand: 'Nike', image: 'https://tennispluscol.com/cdn/shop/files/6E254D15-7D9F-4159-9770-3B31ADB8B127.jpg?v=1724468919&width=1445', description: 'Diseño divertido y cómodo de Dunk.' }, 
    
    { id: 120, name: 'RETRO 1 LOW ALTO', price: 110000, brand: 'Jordan', image: 'https://cucutatenis.com/cdn/shop/files/65608D5D-0A46-4B0C-A608-03A1C61BDBD9.jpg?v=1709138469', description: 'Clásico de caña alta, imprescindible.' }, 
    
    { id: 121, name: 'AMIRI BLANCO', price: 110000, brand: 'Amiri', image: 'https://milanelo.com/cdn/shop/files/191846499117-7.png?v=1750862448&width=3000', description: 'Estilo lujoso y minimalista.' }, 
    { id: 122, name: 'AMIRI NEGRO BEIGE', price: 110000, brand: 'Amiri', image: 'https://trendyshoes12.com/cdn/shop/files/WhatsAppImage2024-01-21at12.25.05PM_1.jpg?v=1705926747', description: 'Contraste elegante para el día a día.' }, 
    
    { id: 123, name: 'ADIDAS CAMPUS 00S BEIGE', price: 110000, brand: 'Adidas', image: 'https://acdn-us.mitiendanube.com/stores/005/072/549/products/whatsapp-image-2024-07-08-at-1-50-28-pm-51a31fece03f27693617234001006648-1024-1024.jpeg', description: 'Retro de los 2000s, máxima tendencia.' }, 
    { id: 124, name: 'ADIDAS SUPERSTAR', price: 105000, brand: 'Adidas', image: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/ac2a3b3f2f1447a9804a216bcfc2c9e3_9366/Tenis_Superstar_Blanco_JP9678_01_00_standard.jpg', description: 'El icónico modelo con puntera de concha.' }, 
    { id: 125, name: 'ADIDAS GRAND COURT NEGRO', price: 100000, brand: 'Adidas', image: 'https://resources.claroshop.com/medios-plazavip/s2/10687/3941168/62f6de561d617-e829505b-169d-4265-a2fa-3615cda5bc18-1600x1600.jpg', description: 'Comodidad total para uso casual.' }, 
    
    { id: 126, name: 'AIR FORCE ONE BLACK W', price: 100000, brand: 'Nike', image: 'https://tenisi.co/cdn/shop/files/D30E061C-E119-472B-AE64-9DC9C6B1BA92.jpg?v=1733287154&width=1445', description: 'El clásico en color negro mate.' }, 
    { id: 127, name: 'AIR FORCE ONE BLANCO', price: 100000, brand: 'Nike', image: 'https://veintedocetenis.com/cdn/shop/files/SaveClip.App_450424133_18040368568906292_6164722752785247851_n.jpg?v=1737590513', description: 'El clásico blanco, esencial en tu armario.' }, 
    { id: 128, name: 'AIR FORCE ONE NEGRO', price: 100000, brand: 'Nike', image: 'https://brooklynshop.co/cdn/shop/files/Imagen_de_WhatsApp_2024-10-09_a_las_21.14.49_840f5256.jpg?v=1728527181&width=360', description: 'El clásico negro, esencial en tu armario.' }, 
    { id: 129, name: 'BOTA AIR FORCE ONE', price: 115000, brand: 'Nike', image: 'https://i.pinimg.com/236x/d2/b4/81/d2b481ff6b3ead52df0c1d589b215972.jpg', description: 'Versión bota para mayor soporte y estilo.' }, 
    
    { id: 130, name: 'VANS NEGRO', price: 100000, brand: 'Vans', image: 'https://m.media-amazon.com/images/I/81I8fSOAXkL._UY900_.jpg', description: 'Clásico skater en negro total.' }, 
    
    { id: 131, name: 'JORDAN 1 LOW TRAVIS SCOTT CAFÉ', price: 110000, brand: 'Jordan', image: 'https://cucutatenis.com/cdn/shop/files/7171E3AC-E44F-4485-A57F-C5AC55F6DCBC.jpg?v=1712158684', description: 'Colaboración exclusiva en tonos tierra.' }, 
    
    { id: 132, name: 'NIKE DUNK DISRUPT 2 BEIGE', price: 110000, brand: 'Nike', image: 'https://i.pinimg.com/736x/4d/0e/da/4d0edacccd45f557780b3a3104c29a44.jpg', description: 'Dunk Disrupt 2 en tono beige.' }, 
    { id: 133, name: 'NIKE DUNK DISRUPT 2 ROSA', price: 110000, brand: 'Nike', image: 'https://cucutatenis.com/cdn/shop/files/D7C53A01-43D3-40BF-B7CA-02941F7B5000.jpg?v=1701557925', description: 'Dunk Disrupt 2 en tono rosa.' }, 
    { id: 134, name: 'NIKE DUNK GRIS', price: 110000, brand: 'Nike', image: 'https://img01.ztat.net/article/spp-media-p1/8fbc000ed21b42faacdea6f10bf1c4d4/1113251e94ab4572b6d7299472f5de58.jpg?imwidth=1800', description: 'Modelo Dunk clásico en gris.' }, 
    { id: 135, name: 'NIKE DUNK BLANCO', price: 110000, brand: 'Nike', image: 'https://media.revistagq.com/photos/60b89505243624cb05dcb94a/master/w_1600%2Cc_limit/1_nike-dunk-low-triple-white-release-info-2.jpg', description: 'Modelo Dunk clásico en blanco.' }, 
    
    { id: 136, name: 'RETRO 4 BLACK', price: 110000, brand: 'Jordan', image: 'https://cdn.shopify.com/s/files/1/0018/4480/5689/files/aj4bc5_1024x1024.jpg?v=1582200289', description: 'Diseño agresivo y elegante en negro.' }, 
    { id: 137, name: 'RETRO 4 MILITARY BLACK', price: 110000, brand: 'Jordan', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDFMNVMHO_12P5KcP_1PA-Ije9vnu8-vx1Gn1hyikIhW8jUkrN', description: 'Diseño agresivo y elegante en negro.' },
    
    { id: 138, name: 'ADIDAS BENITO NEGRO', price: 115000, brand: 'Adidas', image: 'https://tiendaesmeralda.co/cdn/shop/files/IMG_0313_900x.jpg?v=1744466047', description: 'Contraste limpio para cualquier outfit.' }, 
    { id: 139, name: 'ADIDAS BENITO BLANCO', price: 115000, brand: 'Adidas', image: 'https://standshop.com.co/wp-content/uploads/2024/11/e66b8996-c9b3-4a75-ab62-f0a196569c1a.jpg', description: 'Contraste limpio para cualquier outfit.' }, 
    
    { id: 140, name: 'DOLCE & GABBANA', price: 115000, brand: 'Dolce & Gabbana', image: 'https://yeeshopctg.com/cdn/shop/files/WhatsAppImage2024-09-30at7.00.25PM.jpg?v=1727740931', description: 'Estilo de lujo italiano para tu look.' }, 
    
    { id: 141, name: 'VANS KNU SKOOL', price: 105000, brand: 'Vans', image: 'https://dcdn-us.mitiendanube.com/stores/004/826/370/products/whatsapp-image-2024-06-21-at-19-45-43-75a939e2ba97bc26e617190100261886-1024-1024.jpeg', description: 'Modelo retro con lengüeta ancha.' }, 
    
    { id: 142, name: 'VALENTINO BLANCO', price: 110000, brand: 'Valentino', image: 'https://www.accesoriosymodajm.com/wp-content/uploads/2023/12/Imagen-de-WhatsApp-2023-12-18-a-las-22.11.58_8ea2aea0.jpg', description: 'Zapatilla premium en blanco inmaculado.' }, 
    
    { id: 143, name: 'VEJA', price: 110000, brand: 'Veja', image: 'https://sumerlabs.com/prod/catalogue/4c488b549e62e2b5ac240a08b5c9d17d080fe4ec/11c9716a-27ec-4d14-87b3-8a31d4fcf58d.jpg', description: 'Modelo clásico, sostenible y moderno.' }, 
    { id: 144, name: 'VEJA NEGRO', price: 110000, brand: 'Veja', image: 'https://cucutatenis.com/cdn/shop/files/DC57E283-3687-4750-8565-9315D2A95CE6.jpg?v=1721310000&width=720', description: 'Modelo clásico en negro total.' }, 
    { id: 145, name: 'VEJA CAFÉ', price: 110000, brand: 'Veja', image: 'https://g2express.com.co/cdn/shop/files/DeportivoVeja_800x.png?v=1732762716', description: 'Modelo clásico en color café elegante.' }, 
    { id: 146, name: 'VEJA GRIS', price: 110000, brand: 'Veja', image: 'https://cucutatenis.com/cdn/shop/files/B139ADB2-438C-4241-9C95-0F3E806A8DC7.jpg?v=1723505885&width=600', description: 'Modelo clásico en tono gris neutro.' }, 
    { id: 147, name: 'VEJA CORREAS BLANCO NEGRO', price: 110000, brand: 'Veja', image: 'https://www.esplicito.com.co/cdn/shop/files/99BE8BED-FBA9-4B04-A906-74408A3130FD.jpg?v=1723681838', description: 'Diseño práctico y rápido con correas.' }, 
    { id: 148, name: 'VEJA CORREAS PLATEADO', price: 110000, brand: 'Veja', image: 'https://cucutatenis.com/cdn/shop/files/1DD557D3-ED5B-4BF1-885C-23B63F87B64C.jpg?v=1724764908&width=720', description: 'Toque brillante con correas plateadas.' }, 
    { id: 149, name: 'VEJA CORREAS NEGRO', price: 110000, brand: 'Veja', image: 'https://cucutatenis.com/cdn/shop/files/E4B32ADD-9FDA-4CB6-B598-894C4B697F61.jpg?v=1724764952&width=720', description: 'Versión con correas en color negro.' }, 
    { id: 150, name: 'VEJA CORREAS GRIS', price: 110000, brand: 'Veja', image: 'https://www.workshopcol.co/cdn/shop/files/image00059_25915982-f71e-4d62-8194-5b4561ea83ae.jpg?v=1699455886&width=1946', description: 'Versión con correas en tono gris.' }, 
    { id: 151, name: 'VEJA CORREAS DORADO', price: 110000, brand: 'Veja', image: 'https://topprizepicks.com/cdn/shop/files/add-3_optimized_ddcbd4ea-6111-4428-be57-5627b4c40cbe.jpg?v=1754967910', description: 'Toque elegante con correas doradas.' }, 
    
    { id: 152, name: 'ALEXANDER MCQUEEN', price: 105000, brand: 'Alexander McQueen', image: 'https://tennispluscol.com/cdn/shop/files/e61fa175-03a9-4607-b137-fcf65dae8e43.jpg?v=1724469710', description: 'Diseño de suela ancha, moda y altura.' }, 
    
    { id: 153, name: 'ADIDAS TB 2 BEIS', price: 110000, brand: 'Adidas', image: 'https://dparadisestore.co/wp-content/uploads/2024/10/1-600x600.png', description: 'Diseño cómodo y casual en beige.' },
    
    { id: 154, name: 'JORDAN RETRO 1 LOW MILAN', price: 105000, brand: 'Jordan', image: 'https://b1e16cbf94.cbaul-cdnwnd.com/9ef9fe37f3a61f0718051823af94ddd9/200000044-bd4c3bd4c6/Imagen%20de%20WhatsApp%202023-10-09%20a%20las%2020.35.21_337dbd09.jpeg?ph=b1e16cbf94', description: 'Diseño cómodo y casual en beige.' },
    { id: 155, name: 'JORDAN RETRO 1 LOW PARIS', price: 105000, brand: 'Jordan', image: 'https://herika.com.co/wp-content/uploads/2024/11/IMG_0761.jpeg', description: 'Diseño cómodo y casual en beige.' },
    { id: 156, name: 'JORDAN RETRO 1 LOW GRIS', price: 105000, brand: 'Jordan', image: 'https://cucutatenis.com/cdn/shop/files/RETROLOWGRIS.jpg?v=1698760345', description: 'Diseño cómodo y casual en beige.' }
]);

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
    
    if (searchLower) {
        filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower)
        );
    }

    if (selectedBrand.value) {
        filtered = filtered.filter(product => product.brand === selectedBrand.value);
    }

    return filtered;
});

const showModal = ref(false);
const selectedProduct = ref(null);

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
    
    // Si la store añade el producto (no hay error de talla), cierra el modal
    closeModal(); 
};
</script>

---

<style scoped>
/* GENERAL STYLES */
.product-page { 
    padding: 20px; 
    text-align: center; 
    background-color: #f8f8f8;
}

/* FILTER CONTROLS */
.filter-controls {
    max-width: 1200px;
    margin: 0 auto 30px auto; 
    padding: 0 20px;
    text-align: left;
    display: flex; 
    flex-direction: column; 
    gap: 15px; 
}
.search-input {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}
.brand-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
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
    transition: background-color 0.2s, color 0.2s, border-color 0.2s;
}
.btn-brand:hover {
    background-color: #e0e0e0;
}
.btn-brand.active-brand {
    background-color: #7b4397;
    color: white;
}

/* PRODUCT GRID */
.product-grid { 
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
    gap: 30px; 
    justify-items: center; 
    max-width: 1200px; 
    margin: 0 auto; 
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

/* PRODUCT CARD STYLES */
.product-card { 
    background: #ffffff; 
    border: 1px solid #eeeeee;
    border-radius: 10px; 
    overflow: hidden; 
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); 
    transition: transform 0.3s, box-shadow 0.3s; 
    width: 100%; 
    max-width: 350px; 
    min-height: 500px; 
    display: flex; 
    flex-direction: column;
}
.product-card:hover { 
    transform: translateY(-5px); 
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15); 
}

/* IMAGEN DE LA CARD */
.image-wrapper {
    width: 100%;
    padding-top: 100%; 
    position: relative;
    overflow: hidden;
    background-color: #ffffff; /* ¡Cambiado a blanco! */
    border-bottom: 1px solid #eee;
}
.product-img-display { 
    position: absolute;
    top: 0;
    left: 0;
    width: 100%; 
    height: 100%;
    object-fit: contain; 
    transition: transform 0.3s;
    /* Eliminamos el padding aquí si queremos que la imagen ocupe todo el espacio.
       Si necesitas un pequeño margen interno, puedes volver a añadirlo. */
    /* padding: 10px; */ 
    box-sizing: border-box;
}
.product-card:hover .product-img-display {
    transform: scale(1.05); 
}

.product-info { 
    padding: 15px; 
    text-align: left; 
    flex-grow: 1; 
    display: flex; 
    flex-direction: column;
    justify-content: space-between; 
}
.product-info h3 { 
    font-size: 1.3rem; 
    margin-top: 0; 
    margin-bottom: 5px; 
    color: #333;
    display: -webkit-box;
    -webkit-line-clamp: 3; 
    -webkit-box-orient: vertical;
    overflow: hidden; 
    text-overflow: ellipsis; 
    min-height: 4.8rem; 
    line-height: 1.6rem; 
}
.price { 
    font-size: 1.4rem; 
    font-weight: bold; 
    color: #f07b14;
    margin-bottom: 10px;
}
.btn-detail { 
    width: 100%; 
    padding: 12px;
    background-color: #f07b14;
    color: white; 
    border: 2px solid transparent; 
    border-radius: 8px; 
    cursor: pointer; 
    font-size: 1rem; 
    font-weight: bold; 
    transition: background-color 0.3s, transform 0.1s, box-shadow 0.3s, border-color 0.3s; 
    margin-top: auto; 
    box-shadow: 0 4px 8px rgba(240, 123, 20, 0.4); 
}
.btn-detail:hover { 
    background-color: #ff6a00; 
    transform: translateY(-2px); 
    box-shadow: 0 6px 12px rgba(255, 106, 0, 0.5); 
    border-color: white; 
}

/* MODAL STYLES */
.modal-fade-enter-active, .modal-fade-leave-active { 
    transition: opacity 0.3s ease; 
}
.modal-fade-enter-from, .modal-fade-leave-to { 
    opacity: 0; 
}
.modal-overlay { 
    position: fixed; 
    top: 0; 
    left: 0; 
    width: 100%; 
    height: 100%; 
    background-color: rgba(0, 0, 0, 0.6); 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    z-index: 1000; 
}
.modal-content { 
    background: #ffffff;
    border-radius: 10px; 
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); 
    width: 90%; 
    max-width: 1000px; 
    max-height: 90vh; 
    overflow-y: auto; 
    padding: 20px; 
    position: relative; 
    color: #333;
}
.modal-close { 
    position: absolute; 
    top: 10px; 
    right: 15px; 
    background: none; 
    border: none; 
    color: #666;
    font-size: 2rem; 
    cursor: pointer; 
    line-height: 1; 
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
.main-image-modal { 
    width: 100%; 
    height: 400px; 
    object-fit: contain; 
    background-color: #f0f0f0; 
    border-radius: 8px; 
    margin-bottom: 10px; 
    padding: 10px; 
    box-sizing: border-box;
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
    border: 1px solid #4CAF50;
    border-radius: 4px; 
    cursor: pointer; 
    font-weight: bold; 
    transition: background-color 0.2s, border-color 0.2s; 
}
.size-options button:hover { 
    background-color: #e0e0e0; 
}
.size-options button.active-size { 
    background-color: #4CAF50;
    color: white; 
    border-color: #4CAF50;
}
.price-section { 
    margin-bottom: 40px; 
}
.price-tag { 
    font-size: 2.2rem; 
    font-weight: bold; 
    color: #f07b14;
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

/* RESPONSIVE */
@media (max-width: 768px) {
    .product-grid {
        gap: 20px; 
    }
    .product-card {
        min-height: 520px; 
    }
    .product-info h3 { 
        font-size: 1.2rem; 
        min-height: 4.5rem; 
        line-height: 1.5rem;
    }
    .price {
        font-size: 1.3rem; 
        margin-bottom: 8px;
    }

    .modal-content { 
        padding: 10px; 
    }
    .detail-container { 
        flex-direction: column; 
        gap: 20px; 
    }
    .image-gallery { 
        min-width: 100%; 
    }
    .main-image-modal { 
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
    .brand-filters {
        justify-content: center;
    }
}
</style>