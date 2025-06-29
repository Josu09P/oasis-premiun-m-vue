<template>
  <div class="col-md-6 me-2">
    <RouterLink :to="href" class="card-custom d-block text-decoration-none">
      <component :is="disabled || !href ? 'div' : 'a'" :href="!disabled ? href : undefined"
        :class="[baseClass, dynamicClass]" :style="dynamicStyle" v-bind="linkProps">
        <i :class="[icon, 'fs-1', 'mb-3']"></i>
        <h6>{{ title }}</h6>
        <slot />
      </component>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

interface Props {
  href?: string
  icon: string
  title: string
  bgColor?: string
  textColor?: string
  disabled?: boolean
}

const props = defineProps<Props>()

const href = computed(() => props.href ?? '#')
const bgColor = computed(() => props.bgColor ?? 'transparent')
const textColor = computed(() => props.textColor ?? 'text-dark')
const disabled = computed(() => props.disabled ?? false)

const isCustomBg = computed(() => bgColor.value.startsWith('#'))
const isCustomText = computed(() => textColor.value.startsWith('#'))

const baseClass = 'd-block p-5 text-center card-access-direct rounded h-100'
const dynamicClass = computed(() => {
  return [
    disabled.value ? 'disabled' : '',
    !isCustomBg.value ? bgColor.value : '',
    !isCustomText.value ? textColor.value : '',
  ].join(' ')
})

const dynamicStyle = computed(() => ({
  ...(isCustomBg.value ? { backgroundColor: bgColor.value } : {}),
  ...(isCustomText.value ? { color: textColor.value } : {}),
  borderRadius: '1rem',
}))

const linkProps = computed(() => {
  return disabled.value ? { style: 'pointer-events: none;' } : {}
})
</script>

<style scoped>
a {
  text-decoration: none;
  color: black;
}

.card-access-direct {
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.196);
}
</style>
