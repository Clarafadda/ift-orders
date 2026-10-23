<script setup>
// Wraps any control: label + hint + error, wired with aria. Use slot prop `attrs` on the control.
import { computed } from 'vue'
const props = defineProps({ id: { type: String, required: true }, label: String, hint: String, error: String, required: Boolean })
const attrs = computed(() => ({
  id: props.id,
  'aria-required': props.required || undefined,
  'aria-invalid': props.error ? 'true' : undefined,
  'aria-describedby': [props.hint && `${props.id}-hint`, props.error && `${props.id}-err`].filter(Boolean).join(' ') || undefined,
}))
</script>
<template>
  <div class="field">
    <label :for="id">{{ label }}<span v-if="required" aria-hidden="true"> *</span></label>
    <slot :attrs="attrs" />
    <p v-if="hint" :id="`${id}-hint`" class="hint">{{ hint }}</p>
    <p v-if="error" :id="`${id}-err`" class="error" role="alert">{{ error }}</p>
  </div>
</template>
<style scoped>
.field { display: flex; flex-direction: column; gap: var(--space-1); }
label { font-weight: 600; }
.hint { margin: 0; font-size: var(--font-size-sm); color: var(--color-text-muted); }
.error { margin: 0; font-size: var(--font-size-sm); color: var(--color-danger); font-weight: 600; }
:slotted(input), :slotted(select), :slotted(textarea) {
  min-height: var(--target-size); padding: var(--space-2) var(--space-3); font: inherit; color: var(--color-text);
  border: 2px solid var(--color-border); border-radius: var(--radius); background: var(--color-bg); width: 100%; }
:slotted([aria-invalid='true']) { border-color: var(--color-danger); }
</style>
