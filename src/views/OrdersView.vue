<script setup>
import { computed, onUnmounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useMyOrders } from '../composables/useOrders'
import { STATUSES, PRIORITIES, labelOf } from '../constants/orders'
import { formatDate, formatEuro } from '../utils/format'
import BaseButton from '../components/BaseButton.vue'
import BaseField from '../components/BaseField.vue'
import StatusBadge from '../components/StatusBadge.vue'
import ContactStaffLink from '../components/ContactStaffLink.vue'

const router = useRouter()
const { user } = useAuth()
const { orders, loading, error, stop } = useMyOrders(user.value.uid)
onUnmounted(stop)

const filters = reactive({ search: '', status: '', from: '', to: '' })
const resetFilters = () => Object.assign(filters, { search: '', status: '', from: '', to: '' })

const filtered = computed(() => orders.value.filter((o) => {
  if (filters.status && o.status !== filters.status) return false
  if (filters.search && !o.title?.toLowerCase().includes(filters.search.toLowerCase())) return false
  if (filters.from && o.createdAt && o.createdAt < new Date(filters.from)) return false
  if (filters.to && o.createdAt && o.createdAt > new Date(`${filters.to}T23:59:59`)) return false
  return true
}))
const total = (o) => (o.items ?? []).reduce((s, i) => s + i.quantity * i.unitPriceCents, 0)
</script>
<template>
  <section>
    <div class="head">
      <h1>My orders</h1>
      <BaseButton @click="router.push({ name: 'order-new' })">New order</BaseButton>
    </div>

    <form class="filters" role="search" aria-label="Filter orders" @submit.prevent>
      <BaseField id="f-search" label="Name"><template #default="{ attrs }"><input v-bind="attrs" v-model="filters.search" type="search" /></template></BaseField>
      <BaseField id="f-status" label="Status"><template #default="{ attrs }">
        <select v-bind="attrs" v-model="filters.status"><option value="">All</option>
          <option v-for="s in STATUSES" :key="s.value" :value="s.value">{{ s.label }}</option></select></template></BaseField>
      <BaseField id="f-from" label="From"><template #default="{ attrs }"><input v-bind="attrs" v-model="filters.from" type="date" /></template></BaseField>
      <BaseField id="f-to" label="To"><template #default="{ attrs }"><input v-bind="attrs" v-model="filters.to" type="date" /></template></BaseField>
      <BaseButton variant="secondary" @click="resetFilters">Reset</BaseButton>
    </form>

    <p class="visually-hidden" aria-live="polite">{{ filtered.length }} order(s) shown</p>
    <p v-if="loading">Loading…</p>
    <p v-else-if="error" role="alert" class="err">{{ error }}</p>
    <p v-else-if="!filtered.length">No orders found.</p>
    <div v-else class="table-wrap">
      <table>
        <caption class="visually-hidden">Your orders</caption>
        <thead><tr><th scope="col">Title</th><th scope="col">Date</th><th scope="col">Priority</th><th scope="col">Status</th><th scope="col">Total</th><th scope="col"><span class="visually-hidden">Actions</span></th></tr></thead>
        <tbody>
          <tr v-for="o in filtered" :key="o.id">
            <th scope="row">{{ o.title }}</th>
            <td>{{ formatDate(o.createdAt) }}</td>
            <td>{{ labelOf(PRIORITIES, o.priority) }}</td>
            <td><StatusBadge :status="o.status" /></td>
            <td>{{ formatEuro(total(o)) }}</td>
            <td><BaseButton v-if="o.status === 'draft'" variant="secondary" @click="router.push({ name: 'order-edit', params: { id: o.id } })">Edit draft</BaseButton></td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="help">Need help with an order? <ContactStaffLink /></p>
  </section>
</template>
<style scoped>
.head { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-4); }
.head h1 { margin: 0; }
.filters { display: grid; grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr)); gap: var(--space-4); align-items: end;
  background: var(--color-surface); padding: var(--space-4); border-radius: var(--radius); margin: var(--space-6) 0; }
table { width: 100%; border-collapse: collapse; }
th, td { text-align: left; padding: var(--space-3); border-bottom: 1px solid var(--color-border); vertical-align: middle; }
thead th { background: var(--color-primary-soft); color: var(--color-primary-dark); }
tbody th { font-weight: 600; }
.err { color: var(--color-danger); font-weight: 600; }
.help { margin-top: var(--space-6); color: var(--color-text-muted); }
</style>
