<template>
  <nav aria-label="breadcrumb" class="my-4 directory-navbar">
    <h5 class="directory-route">Directorio</h5>
    <ol class="breadcrumb custom-breadcrumb">
      <li
        v-for="(route, index) in customRoutes"
        :key="index"
        class="breadcrumb-item"
        :class="{ active: index === customRoutes.length - 1 }"
        :aria-current="index === customRoutes.length - 1 ? 'page' : undefined"
      >
        <template v-if="route.path && index !== customRoutes.length - 1">
          <RouterLink :to="route.path">
            <i v-if="route.icon" :class="`${route.icon} me-1`" />
            {{ route.name }}
          </RouterLink>
        </template>
        <template v-else>
          <i v-if="route.icon" :class="`${route.icon} me-1`" />
          {{ route.name }}
        </template>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface RouteSegment {
  name: string
  path?: string
  icon?: string
}

defineProps<{
  customRoutes: RouteSegment[]
}>()
</script>

<style scoped>
.directory-navbar {
  margin-top: -30px !important;
  width: 100%;
}

.directory-route {
  font-size: 9px;
  color: #6c757d;
  margin-bottom: 4px;
}

.breadcrumb.custom-breadcrumb {
  display: flex;
  flex-wrap: nowrap;
  white-space: nowrap;
  overflow-x: auto;
  list-style: none;
  padding: 0;
  margin: 0;
}

.breadcrumb-item::before {
  content: none !important;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  position: relative;
}

.breadcrumb-item:not(:last-child)::after {
  content: "/";
  margin: 0 0.7rem;
  margin-left: 20px;
  color: #6c757d;
}

.breadcrumb-item:last-child::after {
  content: "";
}

.breadcrumb-item a {
  font-size: 14px;
  text-decoration: none;
  color: #2e4a38;
}

.breadcrumb-item.active {
  color: #6c757d;
}

.breadcrumb-item a:hover {
  color: rgb(184, 0, 0);
  border-radius: 4px;
}
</style>
