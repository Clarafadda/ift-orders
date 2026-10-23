<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import BaseButton from '../components/BaseButton.vue'
import ContactStaffLink from '../components/ContactStaffLink.vue'

const router = useRouter()
// Assurez-vous de bien récupérer 'user' depuis useAuth
const { user, sendLoginLink, error, message } = useAuth() 
const email = ref('')

// Observe les changements de l'utilisateur et redirige s'il est connecté
watch(user, (newUser) => {
  if (newUser) {
    // Remplacez '/history' par le chemin réel de votre page d'historique
    router.push('/history') 
  }
}, { immediate: true }) // immediate: true permet de vérifier dès le chargement de la page
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
/* Vos styles existants */
.login { max-width: 32rem; margin: var(--space-8) auto; display: grid; gap: var(--space-4); }
.auth-form { display: grid; gap: var(--space-3); }
.auth-form input { padding: 0.5rem; font-size: 1rem; }
.error { color: var(--color-danger); font-weight: 600; margin: 0; }
.success { color: green; font-weight: 600; margin: 0; }
.help { color: var(--color-text-muted); }
</style>