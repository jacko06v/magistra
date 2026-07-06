import assert from 'node:assert/strict'
import test from 'node:test'

import {
  BackendOperationNotImplementedError,
  createBackendCore
} from '../../src/main/core/backend-core.ts'

test('il core esegue echo senza passare da Electron o IPC', async () => {
  const core = createBackendCore(() => new Date('2026-07-06T00:00:00.000Z'))

  const response = await core.echo({
    messaggio: 'ciao backend',
    timestamp_client: '2026-07-06T00:00:00.000Z'
  })

  assert.deepEqual(response, {
    messaggio: 'ciao backend',
    ricevuto_il: '2026-07-06T00:00:00.000Z',
    lunghezza: 12
  })
})

test('il contratto del core espone operazioni future in modo esplicito', async () => {
  const core = createBackendCore()

  await assert.rejects(
    core.chat({ messaggio: 'domanda' }),
    (error) => error instanceof BackendOperationNotImplementedError
  )
})
