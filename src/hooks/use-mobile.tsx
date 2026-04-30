import { useSyncExternalStore } from "react"

const MOBILE_BREAKPOINT = 768

function subscribeIsMobile(onStoreChange: () => void): () => void {
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  mql.addEventListener("change", onStoreChange)
  return () => mql.removeEventListener("change", onStoreChange)
}

function getIsMobileSnapshot(): boolean {
  return window.innerWidth < MOBILE_BREAKPOINT
}

function getIsMobileServerSnapshot(): boolean {
  return false
}

export function useIsMobile() {
  return useSyncExternalStore(subscribeIsMobile, getIsMobileSnapshot, getIsMobileServerSnapshot)
}
