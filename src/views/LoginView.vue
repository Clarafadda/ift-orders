<script setup>
import { useAuth } from '../composables/useAuth'
import BaseButton from '../components/BaseButton.vue'
import ContactStaffLink from '../components/ContactStaffLink.vue'
const { login, error } = useAuth()
</script>
<template>
  <section class="login">
    <h1>Order electronic components</h1>
    <p>Access is reserved for De Vinci students and IFT staff. Sign in with your <strong>@devinci.fr</strong> account.</p>
    <BaseButton @click="login">Sign in with Google</BaseButton>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <p class="help">Trouble signing in? <ContactStaffLink subject="Sign-in problem" /></p>
  </section>
</template>
<style scoped>
.login { max-width: 32rem; margin: var(--space-8) auto; display: grid; gap: var(--space-4); }
.error { color: var(--color-danger); font-weight: 600; margin: 0; }
.help { color: var(--color-text-muted); }
</style>
