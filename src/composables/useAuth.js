import { ref } from 'vue'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import { CONFIG } from '../constants/orders'

const user = ref(null)
const ready = ref(false)
const error = ref('')
const isAllowedEmail = (email) => CONFIG.allowedEmailPattern.test(email || '')

onAuthStateChanged(auth, async (u) => {
  if (u && !isAllowedEmail(u.email)) { await signOut(auth); u = null }
  user.value = u
  ready.value = true
})

export function useAuth() {
  const login = async () => {
    error.value = ''
    try {
      const { user: u } = await signInWithPopup(auth, googleProvider)
      if (!isAllowedEmail(u.email)) {
        await signOut(auth)
        error.value = 'Only De Vinci accounts (@devinci.fr) can sign in.'
      }
    } catch { error.value = 'Sign-in failed. Please try again.' }
  }
  return { user, ready, error, login, logout: () => signOut(auth) }
}
export const waitForAuth = () => new Promise((res) => {
  if (ready.value) return res()
  const stop = onAuthStateChanged(auth, () => { stop(); res() })
})
