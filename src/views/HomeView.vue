<template>
    <div class="home-page">
        <section class="welcome-banner">
            <h1>¡Descubre tu próximo par!</h1>
            <p>Explora nuestra colección de calzado para todas las ocasiones.</p>
        </section>
        
        <section class="featured-categories">
            <h2 class="section-title">Encuentra tu Estilo Perfecto</h2>
            <p class="section-subtitle">Explora nuestras colecciones principales: Urbano y Deportivo.</p>
            
            <div class="category-grid-2-col">
                
                <RouterLink to="/hombres" class="category-card urban-card">
                    <div class="card-content">
                        <h3>Estilo Urbano🚶‍♂️</h3>
                        <p>Los modelos de moda para la calle, incluyendo siluetas Retro y LV Skate.</p>
                        <span class="view-all-btn">Ver Colección</span>
                    </div>
                </RouterLink>

                <RouterLink to="/mujeres" class="category-card sports-card">
                    <div class="card-content">
                        <h3>Deportivos🏃‍♀️</h3>
                        <p>Zapatillas con amortiguación y diseño ideal para running y el día a día.</p>
                        <span class="view-all-btn">Ver Modelos</span>
                    </div>
                </RouterLink>
            </div>
            
        </section>

        <section class="info-section">
            <h2>Estilo y Comodidad en Cada Paso</h2>
            <p class="slogan">Moda y calidad garantizada por Ravenn Tienda.</p>
            
            <div class="feature-cards">
                <div class="feature-card">
                    <span>📦 Envíos Rápidos</span>
                    <p>Entregas en 2 a 4 días hábiles a todo el país.</p>
                </div>
                <div class="feature-card">
                    <span>🔒 Compra Segura</span>
                    <p>Tu información y pagos están siempre protegidos.</p>
                </div>
                <div class="feature-card">
                    <span>✨ Últimas Tendencias</span>
                    <p>Siempre a la moda con nuestras colecciones de calzado.</p>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

// Lista de productos para mantener el contador (39 modelos)
const products = ref([
    { id: 1, name: 'NIKE P-6000', price: 120000, image: 'placeholder_image.jpg' }, 
    // ... (Asegúrate de que tus 39 productos estén aquí)
    { id: 39, name: 'ADIDAS 9060 GRIS', price: 120000, image: 'placeholder_image.jpg' }, 
]);
</script>

<style scoped>
/* Variables de color */
:root {
  --primary-color: #7b4397; 
  --highlight-color: #f07b14; 
  --text-color: #333;
  --text-light: #666;
  --background-main: #f8f8f8;
  --background-secondary: #ffffff;
}

/* --- Estilos Generales --- */
.home-page { 
    background-color: var(--background-secondary);
    min-height: calc(100vh - 120px); 
}
.welcome-banner { 
    background-color: var(--primary-color); 
    padding: 80px 20px; 
    color: white; 
    text-align: center; 
}
.welcome-banner h1 { font-size: 3rem; margin-bottom: 10px; }
.welcome-banner p { font-size: 1.2rem; }

/* --- SECCIÓN DE CATEGORÍAS (Ajuste para 2 columnas) --- */
.featured-categories {
    padding: 60px 20px;
    text-align: center;
    background-color: var(--background-main);
}
.section-title { font-size: 2.2rem; color: var(--text-color); margin-bottom: 10px; }
.section-subtitle { color: var(--text-light); margin-bottom: 40px; }

.category-grid-2-col {
    display: grid;
    /* En móvil, una columna; en escritorio, dos columnas iguales */
    grid-template-columns: 1fr;
    gap: 20px;
    max-width: 1000px; /* Reducido para que se vea bien con 2 tarjetas */
    margin: 0 auto;
}

@media (min-width: 768px) {
    .category-grid-2-col {
        grid-template-columns: 1fr 1fr; /* Dos columnas iguales */
    }
}

.category-card {
    display: block;
    height: 400px; /* Altura fija para uniformidad */
    border-radius: 12px;
    overflow: hidden;
    text-decoration: none;
    color: white;
    background-size: cover;
    background-position: center;
    position: relative;
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s, box-shadow 0.3s;
}

.category-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.4); /* Sombra más fuerte al pasar el ratón */
}

.card-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 30px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end; /* Alinear el contenido a la parte inferior */
    /* Degradado oscuro que cubre la tarjeta para legibilidad del texto blanco */
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.2) 60%);
}

.card-content h3 {
    margin: 0 0 10px 0;
    font-size: 2.5rem; /* Título más grande y dominante */
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.card-content p {
    margin: 0;
    font-size: 1.1rem;
    opacity: 0.9;
}

.view-all-btn {
    display: inline-block;
    align-self: flex-start; /* Alinear el botón a la izquierda */
    margin-top: 20px;
    padding: 10px 25px;
    background-color: var(--highlight-color);
    color: white;
    border-radius: 5px;
    font-weight: bold;
    font-size: 1rem;
    transition: background-color 0.3s;
}

.view-all-btn:hover {
    background-color: #cc6511;
}

/* FONDOS TEMÁTICOS CON IMÁGENES DE EJEMPLO */
.urban-card {
    /* Fondo para la colección Urbana (Hombre) */
    background-image: url('https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3JqZmxkc2MzcWZiMHBvaW5objdzN294eXdvdzJ2MnpxM3VvaDdkNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mDYOWLsm3MnhPjKDDy/giphy.gif'); /* Zapatos más street/skate */
    background-color: #1565c0; 
}

.sports-card {
    /* Fondo para la colección Deportiva (Mujeres) */
    background-image: url('https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3N2cWIzcGo2djNsdTB3eDd5azV0NzgyZGxjdHk0emxsaHFqMWx5ZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L3REFNpuwb0ARx8iAF/giphy.gif'); /* Zapatos más de running/fitness */
    background-color: #2e7d32; 
}

/* --- Estilos de las Features (Sin cambios) --- */
.info-section { padding: 40px 20px; background-color: var(--background-secondary); text-align: center; }
.feature-cards { display: flex; justify-content: center; gap: 20px; margin-bottom: 50px; flex-wrap: wrap; }
.feature-card { background-color: var(--background-main); border: 1px solid #eee; padding: 25px; border-radius: 8px; width: 300px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); }
.feature-card span { font-weight: bold; color: var(--primary-color); display: block; margin-bottom: 10px; font-size: 1.1rem; }
.feature-card p { font-size: 0.9rem; color: var(--text-light); }
</style>

### Pasos Finales:

1.  **Reemplazar Imágenes:** Las URLs `https://picsum.photos/...` son solo ejemplos. **Debes reemplazarlas** en el CSS con las URLs de imágenes de alta calidad de tus zapatos.
    * Para `.urban-card`, usa una imagen de un zapato urbano (como Dunk, LV Skate, etc.).
    * Para `.sports-card`, usa una imagen de un zapato deportivo (como Vomero, P-6000, etc.).
2.  **Verificar Rutas:** Asegúrate de que tus rutas `/hombre` y `/mujeres` en Vue Router estén configuradas correctamente y muestren las colecciones respectivas.