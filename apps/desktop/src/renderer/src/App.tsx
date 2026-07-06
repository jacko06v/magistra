import { useEffect, useState } from 'react'
import { AppShell } from '@magistra/ui'

// L'app consuma la libreria UI separata (@magistra/ui): i componenti sono
// presentazionali e non dipendono da Electron. Dati e stato arrivano dal
// backend via IPC attraverso il preload tipizzato.
export function App() {
  const [backendStatus, setBackendStatus] = useState('Connessione al backend locale...')

  useEffect(() => {
    let isMounted = true

    window.magistra.backend
      .echo({
        messaggio: 'IPC pronto',
        timestamp_client: new Date().toISOString()
      })
      .then((response) => {
        if (isMounted) {
          setBackendStatus(`${response.messaggio} (${response.lunghezza} caratteri)`)
        }
      })
      .catch(() => {
        if (isMounted) {
          setBackendStatus('Backend locale non raggiungibile')
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <AppShell
      title="Magistra"
      subtitle="Scaffolding pronto: core backend tipizzato, IPC Electron e renderer React."
    >
      <p className="backend-status">{backendStatus}</p>
    </AppShell>
  )
}
