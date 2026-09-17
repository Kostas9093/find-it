// -----------------------------------------------------------------------------
// LOCAL ITEM STORAGE
// -----------------------------------------------------------------------------
// Items are stored ONLY on this device, in the browser's localStorage, under a
// key that is specific to the logged-in user. Nothing here is ever sent online.
//
// On a phone (via Median), this storage lives inside the app's private sandbox,
// which Android keeps encrypted as part of device encryption. So the data stays
// on the device and is protected by the phone's own security + the app lock.
// -----------------------------------------------------------------------------

const keyFor = (uid) => `findit_items_${uid}`

export function loadItems(uid) {
  if (!uid) return []
  try {
    const raw = localStorage.getItem(keyFor(uid))
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveItems(uid, items) {
  if (!uid) return
  localStorage.setItem(keyFor(uid), JSON.stringify(items))
}
