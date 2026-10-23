<script setup>
import { CONFIG } from '../constants/orders'
const props = defineProps({ subject: { type: String, default: 'Help with an order' }, label: { type: String, default: 'Contact the IFT staff' } })
const href = `mailto:${CONFIG.staffContactEmail}?subject=${encodeURIComponent(props.subject)}`
</script>
<template><a :href="href">{{ label }}</a></template>
