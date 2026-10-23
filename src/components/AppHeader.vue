<script setup>
import { useAuth } from '../composables/useAuth'
import BaseButton from './BaseButton.vue'
const { user, logout } = useAuth()
</script>
<template>
  <header class="header">
    <div class="container bar">
      <RouterLink to="/" class="brand" aria-label="IFT Orders — home">
        <!-- Put the official IFT logo in /public/ift-logo.svg -->
        <img src="/ift-logo.svg" alt="Institute For Future Technologies" height="40" />
        <span class="brand-title">Orders</span>
      </RouterLink>
      <div v-if="user" class="user">
        <span class="email">{{ user.email }}</span>
        <BaseButton variant="secondary" @click="logout">Sign out</BaseButton>
      </div>
    </div>
  </header>
</template>
<style scoped>
.header { border-bottom: 3px solid var(--color-primary); background: var(--color-bg); }
.bar { display: flex; justify-content: space-between; align-items: center; gap: var(--space-4); flex-wrap: wrap; }
.brand { display: flex; align-items: center; gap: var(--space-3); text-decoration: none; color: var(--color-text); }
.brand-title { font-family: var(--font-heading); font-size: var(--font-size-lg); font-weight: 700; }
.user { display: flex; align-items: center; gap: var(--space-3); }
.email { font-size: var(--font-size-sm); color: var(--color-text-muted); }
@media (max-width: 40rem) { .email { display: none; } }
</style>
