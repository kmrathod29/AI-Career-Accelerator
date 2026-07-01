export function getLocalStorageValue(key, fallbackValue) {
  if (typeof window === 'undefined') {
    return fallbackValue
  }

  const storedValue = window.localStorage.getItem(key)
  return storedValue ?? fallbackValue
}

export function setLocalStorageValue(key, value) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(key, value)
}