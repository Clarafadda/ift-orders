import { ref } from 'vue'
import { addDoc, collection, doc, getDoc, onSnapshot, query, serverTimestamp, updateDoc, where } from 'firebase/firestore'
import { db } from '../firebase'
import { CONFIG } from '../constants/orders'

const col = () => collection(db, CONFIG.ordersCollection)

export function useMyOrders(uid) {
  const orders = ref([]); const loading = ref(true); const error = ref('')
  const stop = onSnapshot(query(col(), where('userId', '==', uid)),
    (snap) => {
      orders.value = snap.docs.map((d) => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate?.() ?? null }))
        .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
      loading.value = false
    },
    () => { error.value = 'Could not load your orders.'; loading.value = false })
  return { orders, loading, error, stop }
}
export const getOrder = async (id) => { const s = await getDoc(doc(db, CONFIG.ordersCollection, id)); return s.exists() ? { id: s.id, ...s.data() } : null }
export const createOrder = (data) => addDoc(col(), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
export const updateOrder = (id, data) => updateDoc(doc(db, CONFIG.ordersCollection, id), { ...data, updatedAt: serverTimestamp() })
