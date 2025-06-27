<template>
  <div class="container-fluid body-container">
    <div id="sidebar" class="sidebar-container">
      <HeaderLeft />
    </div>
    <div id="main-content" class="main-content">
      <HeaderTop />
      <main class="container-all-admin-dashboard">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderLeft from '@/presentation/widgets/admin/HeaderLeft.vue';
import HeaderTop from '@/presentation/widgets/admin/HeaderTop.vue';
</script>

<style scoped>
.body-container {
  display: flex;
  height: 100vh;
  padding: 0;
  padding-left: 20px !important;
  margin: 0;
  background-color: #fff4ea !important;
}

.container-all-admin-dashboard {
  background-color: #f5f5f585;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  border-radius: 1.3em;
  flex: 1;
  padding: 20px;
}
</style>
