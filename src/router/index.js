import { createRouter, createWebHistory } from 'vue-router'
// --- CAMBIOS REALIZADOS ---
// 1. Importamos el componente Home.vue
import Home from '../views/HomeView.vue'
// -------------------------
import ZapatosHombres from '../views/ZapatosHombre.vue'
import ZapatosMujeres from '../views/ZapatosMujer.vue'

const routes = [
  // --- CAMBIOS REALIZADOS ---
  // 2. Añadimos la ruta raíz / que apunta a Home.vue
  { path: '/', name: 'home', component: Home },
  // -------------------------
  { path: '/hombres', name: 'hombres', component: ZapatosHombres },
  { path: '/mujeres', name: 'mujeres', component: ZapatosMujeres }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router