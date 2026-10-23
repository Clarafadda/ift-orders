<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import BaseButton from '../components/BaseButton.vue'
import ContactStaffLink from '../components/ContactStaffLink.vue'

const { sendLoginLink, error, message } = useAuth()
const email = ref('')
</script>

<template>
  <section class="login">
    <h1>Order electronic components</h1>
    <p>Access is reserved for De Vinci students and IFT staff. Sign in with your <strong>@devinci.fr</strong> or <strong>@edu.devinci.fr</strong> account.</p>
    
    <form @submit.prevent="sendLoginLink(email)" class="auth-form">
      <input v-model="email" type="email" placeholder="Email (@devinci.fr ou @edu.devinci.fr)" required />
      <BaseButton type="submit">Recevoir le lien de connexion</BaseButton>
    </form>

    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <p v-if="message" class="success" role="status">{{ message }}</p>
    <p class="help">Trouble signing in? <ContactStaffLink subject="Sign-in problem" /></p>
  </section>
</template>

<style scoped>
.login { max-width: 32rem; margin: var(--space-8) auto; display: grid; gap: var(--space-4); }
.auth-form { display: grid; gap: var(--space-3); }
.auth-form input { padding: 0.5rem; font-size: 1rem; }
.error { color: var(--color-danger); font-weight: 600; margin: 0; }
.success { color: green; font-weight: 600; margin: 0; }
.help { color: var(--color-text-muted); }
</style>