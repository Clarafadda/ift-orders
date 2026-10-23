<script setup>
import { computed } from 'vue'
import { statusOf } from '../constants/orders'
const props = defineProps({ status: String })
const s = computed(() => statusOf(props.status) ?? { label: props.status, tone: 'neutral' })
</script>
<template><span :class="['badge', s.tone]">{{ s.label }}</span></template>
<style scoped>
.badge { display: inline-block; padding: var(--space-1) var(--space-3); border-radius: 999px; font-size: var(--font-size-sm); font-weight: 700; white-space: nowrap; }
.neutral { background: var(--color-neutral-soft); color: var(--color-neutral); }
.warning { background: var(--color-warning-soft); color: var(--color-warning); }
.info { background: var(--color-info-soft); color: var(--color-info); }
.success { background: var(--color-success-soft); color: var(--color-success); }
.danger { background: var(--color-danger-soft); color: var(--color-danger); }
</style>
