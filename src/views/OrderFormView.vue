<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { createOrder, getOrder, updateOrder } from '../composables/useOrders'
import { PRIORITIES, SUPPLIERS, TAGS } from '../constants/orders'
import { formatEuro, isValidUrl, parsePriceToCents } from '../utils/format'
import BaseButton from '../components/BaseButton.vue'
import BaseField from '../components/BaseField.vue'
import ContactStaffLink from '../components/ContactStaffLink.vue'

const props = defineProps({ id: String })
const router = useRouter()
const { user } = useAuth()

const newItem = () => ({ key: crypto.randomUUID(), name: '', supplier: '', url: '', quantity: 1, unitPrice: '' })
const form = reactive({ title: '', priority: 'normal', tags: [], comment: '', items: [newItem()] })
const errors = reactive({ title: '', items: {} })
const saving = ref(false)
const formError = ref('')

onMounted(async () => {
  if (!props.id) return
  const o = await getOrder(props.id)
  if (!o || o.userId !== user.value.uid || o.status !== 'draft') return router.replace({ name: 'orders' })
  Object.assign(form, { title: o.title, priority: o.priority, tags: o.tags ?? [], comment: o.comment ?? '',
    items: o.items.map((i) => ({ ...i, key: crypto.randomUUID(), unitPrice: (i.unitPriceCents / 100).toFixed(2).replace('.', ',') })) })
})

const addItem = () => form.items.push(newItem())
const removeItem = (key) => { if (form.items.length > 1) form.items = form.items.filter((i) => i.key !== key) }

// Sub-orders: one per supplier, derived live from the items
const subOrders = computed(() => {
  const map = {}
  for (const i of form.items) {
    if (!i.supplier) continue
    ;(map[i.supplier] ??= { supplier: i.supplier, items: [], totalCents: 0 })
    map[i.supplier].items.push(i)
    map[i.supplier].totalCents += (Number(i.quantity) || 0) * (parsePriceToCents(i.unitPrice) || 0)
  }
  return Object.values(map)
})
const grandTotal = computed(() => subOrders.value.reduce((s, o) => s + o.totalCents, 0))

const validate = (strict) => {
  errors.title = form.title.trim() ? '' : 'A title is required.'
  errors.items = {}
  if (strict) form.items.forEach((i) => {
    const e = {}
    if (!i.name.trim()) e.name = 'Item name is required.'
    if (!i.supplier) e.supplier = 'Choose a supplier.'
    if (!isValidUrl(i.url)) e.url = 'Enter a valid link (https://…).'
    if (!Number.isInteger(Number(i.quantity)) || Number(i.quantity) < 1) e.quantity = 'Minimum 1.'
    if (parsePriceToCents(i.unitPrice) === null) e.unitPrice = 'Format: 12,50'
    if (Object.keys(e).length) errors.items[i.key] = e
  })
  return !errors.title && !Object.keys(errors.items).length
}

const save = async (status) => {
  formError.value = ''
  if (!validate(status !== 'draft')) { formError.value = 'Please fix the highlighted fields.'; return }
  saving.value = true
  const data = {
    userId: user.value.uid, userEmail: user.value.email, status,
    title: form.title.trim(), priority: form.priority, tags: form.tags, comment: form.comment.trim(),
    items: form.items.map(({ key, unitPrice, ...i }) => ({ ...i, quantity: Number(i.quantity), unitPriceCents: parsePriceToCents(unitPrice) ?? 0 })),
    subOrders: subOrders.value.map((s) => ({ supplier: s.supplier, status, totalCents: s.totalCents })),
  }
  try { props.id ? await updateOrder(props.id, data) : await createOrder(data); router.push({ name: 'orders' }) }
  catch { formError.value = 'Could not save the order. Please try again.' }
  finally { saving.value = false }
}
</script>
<template>
  <form novalidate @submit.prevent="save('pending_review')">
    <h1>{{ id ? 'Edit draft' : 'New order' }}</h1>
    <p v-if="formError" class="alert" role="alert">{{ formError }}</p>

    <div class="grid">
      <BaseField id="title" label="Order title" required :error="errors.title"><template #default="{ attrs }"><input v-bind="attrs" v-model="form.title" type="text" /></template></BaseField>
      <BaseField id="priority" label="Priority"><template #default="{ attrs }">
        <select v-bind="attrs" v-model="form.priority"><option v-for="p in PRIORITIES" :key="p.value" :value="p.value">{{ p.label }}</option></select></template></BaseField>
    </div>

    <fieldset class="tags"><legend>Student project (optional)</legend>
      <label v-for="t in TAGS" :key="t.value" class="check"><input v-model="form.tags" type="checkbox" :value="t.value" /> {{ t.label }}</label>
    </fieldset>

    <h2>Items</h2>
    <ul class="items">
      <li v-for="(item, n) in form.items" :key="item.key" class="item">
        <h3>Item {{ n + 1 }}</h3>
        <div class="grid item-grid">
          <BaseField :id="`name-${item.key}`" label="Item name" required :error="errors.items[item.key]?.name"><template #default="{ attrs }"><input v-bind="attrs" v-model="item.name" type="text" /></template></BaseField>
          <BaseField :id="`sup-${item.key}`" label="Supplier" required :error="errors.items[item.key]?.supplier"><template #default="{ attrs }">
            <select v-bind="attrs" v-model="item.supplier"><option value="" disabled>Select…</option><option v-for="s in SUPPLIERS" :key="s">{{ s }}</option></select></template></BaseField>
          <BaseField :id="`url-${item.key}`" label="Product link" required hint="Must be a working link." :error="errors.items[item.key]?.url"><template #default="{ attrs }"><input v-bind="attrs" v-model="item.url" type="url" inputmode="url" /></template></BaseField>
          <BaseField :id="`qty-${item.key}`" label="Quantity" required :error="errors.items[item.key]?.quantity"><template #default="{ attrs }"><input v-bind="attrs" v-model.number="item.quantity" type="number" min="1" step="1" /></template></BaseField>
          <BaseField :id="`price-${item.key}`" label="Unit price (€)" required hint="Format: 12,50" :error="errors.items[item.key]?.unitPrice"><template #default="{ attrs }"><input v-bind="attrs" v-model="item.unitPrice" type="text" inputmode="decimal" /></template></BaseField>
        </div>
        <BaseButton variant="danger" :disabled="form.items.length === 1" @click="removeItem(item.key)">Remove item {{ n + 1 }}</BaseButton>
      </li>
    </ul>
    <BaseButton variant="secondary" @click="addItem">Add an item</BaseButton>
    <p class="help">Supplier not in the list, or a problem? <ContactStaffLink subject="Supplier request" label="Email the IFT staff" /></p>

    <BaseField id="comment" label="Comment (optional)" class="block"><template #default="{ attrs }"><textarea v-bind="attrs" v-model="form.comment" rows="4" /></template></BaseField>

    <section v-if="subOrders.length" aria-labelledby="sub-h" class="subs">
      <h2 id="sub-h">Sub-orders by supplier</h2>
      <ul><li v-for="s in subOrders" :key="s.supplier"><strong>{{ s.supplier }}</strong> — {{ s.items.length }} item(s), {{ formatEuro(s.totalCents) }}</li></ul>
      <p><strong>Total: {{ formatEuro(grandTotal) }}</strong></p>
    </section>

    <div class="actions">
      <BaseButton type="submit" :disabled="saving">Submit order</BaseButton>
      <BaseButton variant="secondary" :disabled="saving" @click="save('draft')">Save as draft</BaseButton>
      <BaseButton variant="secondary" @click="router.push({ name: 'orders' })">Cancel</BaseButton>
    </div>
  </form>
</template>
<style scoped>
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); gap: var(--space-4); }
.item-grid { margin-bottom: var(--space-4); }
.items { list-style: none; padding: 0; display: grid; gap: var(--space-4); }
.item { border: 2px solid var(--color-border); border-radius: var(--radius); padding: var(--space-4); }
.item h3 { margin-top: 0; }
.tags { border: 2px solid var(--color-border); border-radius: var(--radius); margin: var(--space-6) 0; display: flex; flex-wrap: wrap; gap: var(--space-4); }
.check { display: inline-flex; align-items: center; gap: var(--space-2); min-height: var(--target-size); }
.check input { width: 1.25rem; height: 1.25rem; accent-color: var(--color-primary); }
.alert { background: var(--color-danger-soft); color: var(--color-danger); padding: var(--space-3); border-radius: var(--radius); font-weight: 600; }
.help { color: var(--color-text-muted); }
.block { margin-top: var(--space-6); }
.subs { background: var(--color-primary-soft); padding: var(--space-4); border-radius: var(--radius); margin-top: var(--space-6); }
.actions { display: flex; flex-wrap: wrap; gap: var(--space-3); margin: var(--space-8) 0; }
</style>
