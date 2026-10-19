import { CSSProperties, useEffect, useState } from 'react'
import type { Backdrop } from './BackdropPicker'

const FADE_MS = 700

const layer: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: -1,
  pointerEvents: 'none',
}

interface BackdropLayersProps {
  backdrop: Backdrop
}

export default function BackdropLayers({ backdrop }: BackdropLayersProps) {
  const [shown, setShown] = useState(backdrop)
  const [outgoing, setOutgoing] = useState<Backdrop | null>(null)

  // Adjust state during render when the backdrop changes, so the outgoing
  // layer is already in the DOM when the new one starts fading in.
  if (backdrop.id !== shown.id) {
    setOutgoing(shown)
    setShown(backdrop)
  }

  useEffect(() => {
    if (!outgoing) return
    const timer = window.setTimeout(() => setOutgoing(null), FADE_MS)
    return () => window.clearTimeout(timer)
  }, [outgoing])

  return (
    <>
      <style>{`
        @keyframes backdropFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .backdrop-fade-in { animation: backdropFadeIn ${FADE_MS}ms ease forwards; }
        @media (prefers-reduced-motion: reduce) {
          .backdrop-fade-in { animation: none; }
        }
      `}</style>
      {outgoing && <div style={{ ...layer, ...outgoing.style }} />}
      <div
        key={shown.id}
        className={outgoing ? 'backdrop-fade-in' : undefined}
        style={{ ...layer, ...shown.style }}
      />
    </>
  )
}
