import { useEffect, useState } from 'react'

// Median injects its JavaScript bridge (window.median) into the page, but it
// can appear a moment AFTER our React code first runs. So instead of checking
// once, we poll for a few seconds and report when it becomes available.
//
// Returns:
//   inApp      - true if running inside the Median native app
//   biometrics - true if the Face ID / Touch ID / Android Biometrics plugin
//                is active (window.median.auth exists)
function detect() {
  const w = typeof window !== 'undefined' ? window : {}
  return {
    inApp: !!w.median,
    biometrics: !!(w.median && w.median.auth),
  }
}

export function useMedian() {
  const [state, setState] = useState(detect())

  useEffect(() => {
    if (state.biometrics) return
    let tries = 0
    const id = setInterval(() => {
      tries += 1
      const next = detect()
      setState((prev) =>
        prev.inApp === next.inApp && prev.biometrics === next.biometrics
          ? prev
          : next,
      )
      if (next.biometrics || tries > 24) clearInterval(id) // ~6 seconds
    }, 250)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return state
}
