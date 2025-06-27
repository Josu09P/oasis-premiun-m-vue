<template>
    <footer class="bg-white border-top border-bottom mt-5 pt-4 pb-3">
        <div class="container">
            <div class="row gy-4 justify-content-between">

                <!-- Logo bien alineado a la izquierda -->
                <div class="col-md-3 d-flex flex-column align-items-start">
                    <a href="#" class="text-decoration-none">
                        <LogoMain />
                    </a>
                    <p class="text-muted mt-2 small">Innovando contigo desde 2024.</p>
                </div>

                <!-- Enlaces rápidos -->
                <div class="col-md-2">
                    <h6 class="text-dark fw-semibold mb-3">Enlaces</h6>
                    <ul class="list-unstyled">
                        <li><a href="#inicio" class="text-muted text-decoration-none"><i class="fas fa-home me-2"></i>
                                Inicio</a></li>
                        <li><a href="#servicios" class="text-muted text-decoration-none"><i
                                    class="fas fa-concierge-bell me-2"></i> Servicios</a></li>
                        <li><a href="#proyectos" class="text-muted text-decoration-none"><i
                                    class="fas fa-project-diagram me-2"></i> Proyectos</a></li>
                        <li><a href="#contacto" class="text-muted text-decoration-none"><i
                                    class="fas fa-users me-2"></i> Nosotros</a></li>
                    </ul>
                </div>

                <!-- Noticias o artículos -->
                <div class="col-md-3">
                    <h6 class="text-dark fw-semibold mb-3">Recientes</h6>
                    <ul class="list-unstyled">
                        <li><a href="#" class="text-muted text-decoration">Top 5 tendencias en 2025</a></li>
                        <li><a href="#" class="text-muted text-decoration">Cómo escalar tu app con Firebase</a></li>
                        <li><a href="#" class="text-muted text-decoration ">Node.js vs NestJS: ¿Cuál usar?</a></li>
                    </ul>
                </div>

                <!-- Contacto y redes -->
                <div class="col-md-3">
                    <h6 class="text-dark fw-semibold mb-3">Contáctanos</h6>
                    <p class="text-muted mb-1"><i class="fas fa-envelope me-2"></i> oasispremiun@gmail.com</p>
                    <p class="text-muted mb-3"><i class="fas fa-phone me-2"></i> +51 999 888 777</p>
                    <div class="d-flex gap-3 mt-2">
                        <a href="#" class="text-muted fs-5"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="text-muted fs-5"><i class="fab fa-instagram"></i></a>
                        <a href="#" class="text-muted fs-5"><i class="fab fa-x-twitter"></i></a>
                        <a href="#" class="text-muted fs-5"><i class="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
            </div>

            <div class="text-center mt-4 pt-3 border-top">
                <small class="text-muted">&copy; 2025 MiMarca. Todos los derechos reservados.</small>
            </div>
        </div>

    </footer>
</template>

<script setup lang="ts">
import LogoMain from '@/presentation/widgets/LogoMain.vue'
</script>