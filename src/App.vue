<script setup>
import AppHeader from './components/AppHeader.vue'
</script>
<template>
  <a class="skip-link" href="#main">Skip to main content</a>
  <AppHeader />
  <main id="main" class="container" tabindex="-1"><RouterView /></main>
</template>
