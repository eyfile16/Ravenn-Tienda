<template>
  <div id="app-container">
    <header>
      <!-- Nuevo contenedor para agrupar el Toggle y el Logo/Título a la izquierda -->
      <div class="left-header-group">
        
        <!-- 1. Toggle de menú: Movido a la primera posición para estar a la extrema izquierda -->
        <div class="menu-toggle" @click="toggleMenu">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </div>

        <!-- 2. Logo y Título: Ahora a la derecha del Toggle -->
        <RouterLink to="/" class="logo-link">
          <div class="logo-container">
            <div class="logo-circle-wrapper">
              <!-- La imagen está dentro de un wrapper para el efecto circular -->
              <img src="/src/assets/logo.png" alt="Logo Ravenn" class="logo" />
            </div>
            <span class="title">RAVENN N.C</span>
          </div>
        </RouterLink>
      </div>

      <!-- Navegación principal (Visible en escritorio, oculto en móvil) -->
      <nav class="desktop-nav">
        <div class="nav-links">
          <RouterLink to="/">INICIO</RouterLink>
          <RouterLink to="/hombres">URBANO</RouterLink>
          <RouterLink to="/mujeres">DEPORTIVOS</RouterLink>
        </div>
      </nav>
      
      <!-- Icono del Carrito (Siempre a la derecha) -->
      <div class="cart-icon" @click="toggleCart">
        🛒<span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
      </div>
    </header>

    <!-- Barra lateral de menú para móviles -->
    <transition name="slide-left">
        <div v-if="isMenuOpen" class="sidebar-menu"> 
          <button class="close-menu" @click="toggleMenu">×</button>
          <RouterLink to="/" @click="toggleMenu">INICIO</RouterLink>
          <RouterLink to="/hombres" @click="toggleMenu">Zapato Urbano</RouterLink>
          <RouterLink to="/mujeres" @click="toggleMenu">Deportivos</RouterLink>
        </div>
    </transition>

    <main class="main-content">
      <router-view></router-view>
    </main>
    
    <!-- Pie de página (Footer) -->
    <footer>
        <div class="footer-content">
          <p class="copyright">
              © {{ new Date().getFullYear() }} Ravenn Tienda | Calidad y Estilo.
          </p>
          <div class="social-links">
              <a href="https://www.instagram.com/RavennShop1" target="_blank" class="social-link instagram">
                  <span class="icon">📸</span> Instagram: RavennShop1
              </a>
              <a href="https://www.facebook.com/profile.php?id=61581937151685" target="_blank" class="social-link facebook">
                  <span class="icon">👍</span> Facebook: Ravenn
              </a>
          </div>
        </div>
    </footer>

    <CartSidebar />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
// Asegúrate de que estos componentes y store existan en las rutas especificadas
import CartSidebar from './components/CartSidebar.vue';
import { useCart } from './stores/cartStore';

// Simulación de variables y funciones
const { cartCount, toggleCart, WHATSAPP_NUMBER } = useCart();

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<style>
/* Estilos Globales y Variables */
:root {
  --background-main: #F8F8FF;
  --background-secondary: #FFFFFF;
  --primary-color: #4A235A; /* Morado Profundo */
  --accent-color: #A569BD;
  --highlight-color: #FF8C00; /* Naranja Oscuro */
  --text-color: #333333;
  --text-light: #666666;
}

body {
    margin: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: var(--background-main);
    color: var(--text-color);
}

#app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

/* ---------------------------------------------------------------- */
/* ESTILOS DEL ENCABEZADO (HEADER)                 */
/* ---------------------------------------------------------------- */
header {
  background-color: var(--primary-color);
  color: white;
  padding: 10px 20px;
  display: flex;
  /* El header distribuye Left-Group, Nav y Cart-Icon */
  justify-content: space-between; 
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 900;
}

/* GRUPO IZQUIERDO: Contiene Toggle y Logo/Título */
.left-header-group {
    display: flex;
    align-items: center;
    flex-shrink: 0; 
    /* Añade un pequeño margen a la derecha para separarlo de la navegación de escritorio */
    margin-right: 20px;
}

/* --- LOGO: Circular y Título Estilizado --- */
.logo-link {
  text-decoration: none;
  color: inherit;
  flex-shrink: 0; 
  display: flex; 
  /* Añade margen a la izquierda del logo para separarlo del toggle */
  margin-left: 15px;
}
.logo-container { 
    display: flex; 
    align-items: center; 
}
.logo-circle-wrapper {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background-color: white; 
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}
.logo { 
    height: 100%;
    width: 100%;
    border-radius: 50%; 
    object-fit: cover;
    padding: 2px;
}
.title { 
    font-size: 1.6rem; 
    font-weight: 800;
    color: white;
    letter-spacing: 1.5px;
}

/* --- NAVEGACIÓN (Escritorio) --- */
.desktop-nav { 
    flex-grow: 1; 
    display: flex; 
    justify-content: center; 
}
.nav-links { display: flex; gap: 20px; }
.desktop-nav a { 
    color: white; 
    text-decoration: none; 
    font-weight: 600; 
    padding: 8px 10px; 
    transition: color 0.3s, background-color 0.3s; 
    border-radius: 6px; 
}
.desktop-nav a:hover, .desktop-nav a.router-link-active { 
    color: var(--highlight-color); 
    background-color: #6a347e; 
}

/* Mobile Menu Toggle (Oculto en escritorio) */
.menu-toggle { 
    display: none; /* Oculto por defecto */
    cursor: pointer; 
    padding: 5px; 
} 
.menu-toggle .bar { display: block; width: 25px; height: 3px; margin: 5px auto; background-color: white; transition: all 0.3s ease-in-out; }

/* Icono del Carrito */
.cart-icon { 
    font-size: 1.5rem; 
    cursor: pointer; 
    position: relative; 
    color: white; 
    flex-shrink: 0; 
}
.cart-badge { position: absolute; top: -8px; right: -8px; background-color: var(--highlight-color); color: white; border-radius: 50%; padding: 2px 6px; font-size: 0.7rem; font-weight: bold; }


/* ---------------------------------------------------------------- */
/* BARRA LATERAL (SIDEBAR)                      */
/* ---------------------------------------------------------------- */
.sidebar-menu {
  position: fixed; top: 0; left: 0; width: 250px; height: 100%; background-color: var(--primary-color);
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3); display: flex; flex-direction: column; padding-top: 10px; z-index: 1000;
}
.sidebar-menu a { padding: 15px 20px; color: white; text-decoration: none; border-bottom: 1px solid #6a347e; }
.sidebar-menu a:hover { background-color: #6a347e; }
.close-menu { position: absolute; top: 10px; right: 15px; background: none; border: none; color: white; font-size: 2rem; cursor: pointer; }
.slide-left-enter-active, .slide-left-leave-active { transition: transform 0.3s ease-out; }
.slide-left-enter-from, .slide-left-leave-to { transform: translateX(-100%); }


/* ---------------------------------------------------------------- */
/* FOOTER                               */
/* ---------------------------------------------------------------- */
footer {
    background-color: var(--primary-color);
    padding: 20px 20px;
    color: white;
    margin-top: auto;
    box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
}

.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    flex-wrap: wrap; 
}

.copyright {
    font-size: 0.9rem;
    color: #cccccc;
    margin: 5px 0;
}

.social-links {
    display: flex;
    gap: 15px;
    margin: 5px 0;
}

.social-link {
    text-decoration: none;
    color: var(--accent-color); 
    font-weight: bold;
    font-size: 1rem;
    display: flex;
    align-items: center;
    transition: color 0.3s;
}

.social-link:hover {
    color: white;
}

.social-link .icon {
    margin-right: 5px;
    font-size: 1.2rem;
}


/* ---------------------------------------------------------------- */
/* MEDIA QUERY (Móvil)                      */
/* ---------------------------------------------------------------- */
@media (max-width: 768px) {
    /* Oculta la navegación de escritorio */
    .desktop-nav { display: none; } 
    
    /* Muestra el menu-toggle, que ahora está primero dentro de .left-header-group */
    .menu-toggle { display: block; }
    
    /* Elimina el margen a la izquierda del logo para que quede pegado al toggle */
    .logo-link {
      margin-left: 0;
    }
    
    /* Ajusta el margen del toggle para pegarlo al borde izquierdo del header */
    .left-header-group {
      /* Quita el margen derecho que tenía en escritorio, ajustando al nuevo flujo */
      margin-right: 0; 
    }
    
    /* Ajusta el espaciado entre el toggle y el logo para que no estén demasiado juntos */
    /* Lo manejamos con un poco de padding en el toggle si es necesario, pero el left-header-group
       con display: flex maneja la separación por defecto. Vamos a darle un poco más de
       espacio al logo en móvil si fuera necesario, pero la estructura actual es:
       [Toggle][Logo]
       El .logo-link ya tiene un margin-left de 15px en desktop, que es lo que vamos a quitar arriba.
       El margen de 10px en .logo-circle-wrapper debería ser suficiente para separarlo.
    */
    
    /* Footer en formato columna para móvil */
    .footer-content {
      flex-direction: column;
      text-align: center;
    }
    
    .social-links {
      flex-direction: column; 
      gap: 5px; 
      margin-top: 15px;
    }
    .social-link {
      justify-content: center;
    }
}
</style>
