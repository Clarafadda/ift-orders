// All business enums live here. Never hardcode these elsewhere.
export const STATUSES = [
  { value: 'draft', label: 'Draft', tone: 'neutral' },
  { value: 'pending_review', label: 'Pending review', tone: 'warning' },
  { value: 'processing', label: 'Processing', tone: 'info' },
  { value: 'ordered', label: 'Ordered', tone: 'info' },
  { value: 'waiting_pickup', label: 'Waiting for pick up', tone: 'success' },
  { value: 'completed', label: 'Completed', tone: 'success' },
  { value: 'rejected', label: 'Rejected', tone: 'danger' },
  { value: 'cancelled', label: 'Cancelled', tone: 'danger' },
]
export const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'important', label: 'Important' },
  { value: 'urgent', label: 'Urgent' },
]
export const TAGS = [
  { value: 'davincibot', label: 'DaVinciBot' },
  { value: 'ecodrive', label: 'EcoDrive' },
  { value: 'fablab', label: 'FabLab' },
  { value: 'hydrodevinci', label: 'HydroDeVinci' },
  { value: 'leofly', label: 'LeoFly' },
]
// Provisional list — replace with the final one (later: load from Firestore).
export const SUPPLIERS = ['Amazon', 'Atome3D', 'BambuLab', 'Bricovis', 'Carrefour']

export const CONFIG = {
  allowedEmailPattern: /@(edu\.)?devinci\.fr$/i,
  staffContactEmail: 'lift.dvic@devinci.fr',
  ordersCollection: 'orders',
}
export const labelOf = (list, value) => list.find((x) => x.value === value)?.label ?? value
export const statusOf = (value) => STATUSES.find((s) => s.value === value)
