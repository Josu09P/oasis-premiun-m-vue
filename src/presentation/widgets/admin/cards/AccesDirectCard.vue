<template>
  <div class="col-md-6">
    <component
      :is="disabled || !href ? 'div' : 'a'"
      :href="!disabled ? href : undefined"
      :class="[baseClass, dynamicClass]"
      :style="dynamicStyle"
      v-bind="linkProps"
    >
      <i :class="[icon, 'fa-3x', 'mb-3']"></i>
      <h4>{{ title }}</h4>
      <slot />
    </component>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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
const bgColor = computed(() => props.bgColor ?? 'bg-primary')
const textColor = computed(() => props.textColor ?? 'text-white')
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
}
.card-access-direct {
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.196);
}
</style>
