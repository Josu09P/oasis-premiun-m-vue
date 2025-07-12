<template>
    <header class="header-client">
        <div class="container py-2">
            <div class="row py-4 pb-0 pb-sm-4 align-items-center">
                <div class="col-sm-4 col-lg-3 text-center text-sm-start">
                    <LogoMain />
                </div>
                <div class="col-sm-6 offset-sm-2 offset-md-0 col-lg-5 d-none d-lg-block">
                    <div class="search-bar border rounded-2 px-3 border-dark-subtle">
                        <form id="search-form" class="text-center d-flex align-items-center" action="" method="">
                            <input type="text" class="form-control border-0 bg-transparent search-input" style="font-size: 14px;"
                                placeholder="Busca entre más de 1000 productos" />

                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path fill="currentColor"
                                    d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.39ZM11 18a7 7 0 1 1 7-7a7 7 0 0 1-7 7Z">
                                </path>
                            </svg>
                        </form>
                    </div>
                </div>

                <div
                    class="col-sm-8 col-lg-4 d-flex justify-content-end gap-5 align-items-center mt-4 mt-sm-0 justify-content-center justify-content-sm-end">
                    <div class="support-box text-end d-none d-xl-block">
                        <span class="fs-6 secondary-font text-muted">Phone</span>
                        <h6 class="mb-0" style="font-size: 15px;">
                            <strong>+51-965634940</strong>
                        </h6>
                    </div>
                    <div class="support-box text-end d-none d-xl-block">
                        <span class="fs-6 secondary-font text-muted">Email</span>
                        <h6 class="mb-0" style="font-size: 15px;">
                            <strong>easypantry@gmail.com</strong>
                        </h6>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-all border-top border-bottom" style="background-color: #ffffff;">
            <div class="container" style="background-color: #ffffff;">
                <nav class="main-menu d-flex navbar navbar-expand-lg justify-content-center navbar-client">
                    <div class="d-flex d-lg-none align-items-end mt-3">
                        <ul class="d-flex justify-content-center list-unstyled m-0">
                            <li>
                                <a href="wishlist.html" class="mx-3">
                                    <i class="fas fa-heart"></i>
                                </a>
                            </li>
                            <li>
                                <a href="#" class="mx-3" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCart"
                                    aria-controls="offcanvasCart">
                                    <i class="fas fa-shopping-cart"></i>
                                    <span
                                        class="position-absolute translate-middle badge rounded-circle bg-primary pt-2">03</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" class="mx-3" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSearch"
                                    aria-controls="offcanvasSearch">
                                    <iconify-icon icon="tabler:search" class="fs-4"></iconify-icon>
                                </a>
                            </li>
                        </ul>
                    </div>

                    <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar"
                        aria-labelledby="offcanvasNavbarLabel">
                        <div class="offcanvas-header justify-content-center">
                            <button type="button" class="btn-close" data-bs-dismiss="offcanvas"
                                aria-label="Close"></button>
                        </div>
                        <div class="offcanvas-body justify-content-between">
                            <li style="font-size: 1rem; list-style: none; text-align: center;">
                                <a href="#" class="mx-3" id="message" style="text-decoration: none;">
                                </a>
                            </li>

                            <div class="filter-categories d-flex align-items-center gap-2 mt-2"
                                style="margin-top: 1px !important;">
                                <i class="bi bi-funnel-fill fs-5 " style="color: gray; margin-right: -10px;"></i>
                                <select class="form-select border-0 nav-link" style="width: auto; margin-left: 5px;">
                                    <option value="list" selected style="color: gray;">Filtrar por categorías</option>
                                    <option value="cat1">Categoría 1</option>
                                    <option value="cat2">Categoría 2</option>
                                    <!-- Agrega más categorías según necesites -->
                                </select>
                            </div>

                            <ul class="navbar-nav menu-list list-unstyled d-flex gap-md-3 mb-0">
                                <li class="nav-item">
                                    <RouterLink to="/client/home" class="nav-link">
                                        <i class="bi bi-house-door-fill me-1"></i>Inicio
                                    </RouterLink>
                                </li>
                                <li class="nav-item">
                                    <RouterLink to="/client/products" class="nav-link">
                                        <i class="bi bi-box-seam me-1"></i>Productos
                                    </RouterLink>
                                </li>
                                <li class="nav-item">
                                    <RouterLink to="/client/discount" class="nav-link">
                                        <i class="bi bi-tags-fill me-1"></i>Descuentos
                                    </RouterLink>
                                </li>
                                <li class="nav-item">
                                    <RouterLink to="/client/clima" class="nav-link">
                                        <i class="bi bi-cloud-sun-fill me-1"></i>Clima
                                    </RouterLink>
                                </li>
                                <li class="nav-item">
                                    <RouterLink to="/client/contact" class="nav-link">
                                        <i class="bi bi-envelope-fill me-1"></i>Contáctanos
                                    </RouterLink>
                                </li>
                            </ul>
                            <div class="d-none d-lg-flex align-items-end">
                                <ul class="d-flex justify-content-center list-unstyled m-0">
                                    <li style="margin-top: 4px; display: flex; justify-content: space-between;">
                                        <span class="nav-link me-2" id="user-name"
                                            style="font-size: 14px; margin-top: 3px;"></span><i
                                            class="bi bi-person-circle"></i>
                                    </li>
                                    <li>
                                        <a href="#" class="mx-3 position-relative" data-bs-toggle="offcanvas"
                                            data-bs-target="#offcanvasCart" aria-controls="offcanvasCart">
                                            <i class="bi bi-cart-fill fs-5" style="color: gray;"></i>
                                            <span
                                                class="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-primary">
                                                03
                                            </span>
                                        </a>

                                    </li>
                                    <li style="margin-bottom: 5px;">
                                        <i class="bi bi-door-closed-fill fs-5" id="cerrar-sesion-op"
                                            style="margin-left: 20px; color: gray;"></i>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    </header>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import Swal from 'sweetalert2'
import LogoMain from '@/presentation/widgets/LogoMain.vue'
import { useUserStore } from '@/stores/user' // ajusta según tu ruta real

const userStore = useUserStore()
onMounted(() => {
    userStore.loadUserFromLocalStorage()

    const userNameElement = document.getElementById('user-name')
    if (userNameElement) {
        const name = userStore.name
        userNameElement.textContent = name ? `${name}` : 'Invitado'
    }

    const cerrarSesionBtn = document.getElementById('cerrar-sesion-op')
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', async (event) => {
            event.preventDefault()

            if (!userStore.token) {
                const result = await Swal.fire({
                    title: 'No hay usuario en sesión',
                    text: '¿Quieres ir a la página de inicio de sesión?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Ir al login',
                    cancelButtonText: 'Cancelar',
                })

                if (result.isConfirmed) {
                    window.location.href = '/auth/login'
                }
            } else {
                const result = await Swal.fire({
                    title: '¿Qué deseas hacer?',
                    text: 'Estás actualmente en sesión',
                    icon: 'question',
                    showDenyButton: true,
                    showCancelButton: true,
                    showConfirmButton: false,
                    denyButtonText: 'Cerrar sesión',
                    cancelButtonText: 'Cancelar',
                })

                if (result.isDenied) {
                    userStore.logout()
                    await Swal.fire('Sesión cerrada', 'Has cerrado sesión exitosamente', 'success')
                    window.location.reload()
                }
            }
        })
    }
})

</script>
<style scoped>
select.form-select {
    font-size: 14px !important;
    height: 38px !important;
}

a.nav-link {
    font-size: 13.6px !important;
    border-radius: 1rem;
    /* <-- Agrega esto */
    padding: 6px 12px;
    /* Opcional: mejora el área clickeable */
    transition: background-color 0.3s ease;
    /* suave animación */
    margin-top: 4px;
}

a.nav-link:hover {
    background-color: #466c9581 !important;
}
</style>