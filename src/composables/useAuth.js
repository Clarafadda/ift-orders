import { ref } from 'vue'
import { 
  onAuthStateChanged, 
  sendSignInLinkToEmail, 
  isSignInWithEmailLink, 
  signInWithEmailLink, 
  signOut 
} from 'firebase/auth'
import { auth } from '../firebase'
import { CONFIG } from '../constants/orders'

const user = ref(null)
const ready = ref(false)
const error = ref('')
const message = ref('')

const isAllowedEmail = (email) => CONFIG.allowedEmailPattern.test(email || '')

// Intercepte le retour de l'utilisateur après le clic sur le lien reçu par mail
const handleEmailLink = async () => {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    let email = window.localStorage.getItem('emailForSignIn')
    if (!email) {
      email = window.prompt('Veuillez confirmer votre adresse e-mail pour finaliser la connexion :')
    }
    try {
      const result = await signInWithEmailLink(auth, email, window.location.href)
      window.localStorage.removeItem('emailForSignIn')
      
      if (!isAllowedEmail(result.user.email)) {
        await signOut(auth)
        error.value = 'Seuls les comptes @devinci.fr ou @edu.devinci.fr sont autorisés.'
        return
      }
      window.location.replace('/') 

    } catch {
      error.value = 'Lien de connexion invalide ou expiré.'
    }
  }
}
handleEmailLink()

onAuthStateChanged(auth, async (u) => {
  if (u && !isAllowedEmail(u.email)) { 
    await signOut(auth)
    u = null 
  }
  user.value = u
  ready.value = true
})

export function useAuth() {
  const sendLoginLink = async (email) => {
    error.value = ''
    message.value = ''
    if (!isAllowedEmail(email)) {
      error.value = 'Adresse non autorisée (@devinci.fr ou @edu.devinci.fr requis).'
      return
    }
    const actionCodeSettings = {
      url: window.location.href, // L'URL actuelle vers laquelle Firebase redirigera
      handleCodeInApp: true
    }
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings)
      window.localStorage.setItem('emailForSignIn', email)
      message.value = 'Un lien de connexion a été envoyé. Vérifiez votre boîte de réception.'
    } catch { 
      error.value = 'Échec de l\'envoi du lien. Veuillez réessayer.' 
    }
  }

  return { user, ready, error, message, sendLoginLink, logout: () => signOut(auth) }
}

export const waitForAuth = () => new Promise((res) => {
  if (ready.value) return res()
  const stop = onAuthStateChanged(auth, () => { stop(); res() })
})