<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // primary | secondary | danger
  type: { type: String, default: 'button' },
  disabled: Boolean,
})
</script>
<template>
  <button :type="type" :disabled="disabled" :class="['btn', variant]"><slot /></button>
</template>
<style scoped>
.btn { min-height: var(--target-size); padding: 0 var(--space-4); border-radius: var(--radius);
  font: inherit; font-weight: 600; cursor: pointer; border: 2px solid var(--color-primary); }
.primary { background: var(--color-primary); color: #fff; }
.primary:hover:not(:disabled) { background: var(--color-primary-dark); border-color: var(--color-primary-dark); }
.secondary { background: var(--color-bg); color: var(--color-primary-dark); }
.secondary:hover:not(:disabled) { background: var(--color-primary-soft); }
.danger { background: var(--color-bg); color: var(--color-danger); border-color: var(--color-danger); }
.danger:hover:not(:disabled) { background: var(--color-danger-soft); }
.btn:disabled { opacity: 0.55; cursor: not-allowed; }
</style>
