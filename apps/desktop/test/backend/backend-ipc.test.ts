import assert from 'node:assert/strict'
import test from 'node:test'

import { backendIpcChannels, type BackendCoreContract } from '@magistra/shared'

import { registerBackendIpc, type IpcMainLike } from '../../src/main/ipc/backend-ipc.ts'

class IpcMainSpy implements IpcMainLike {
  private readonly handlers = new Map<
    string,
    (event: unknown, payload: unknown) => Promise<unknown>
  >()

  handle(channel: string, listener: (event: unknown, payload: unknown) => Promise<unknown>): void {
    this.handlers.set(channel, listener)
  }

  invoke(channel: string, payload: unknown): Promise<unknown> {
    const handler = this.handlers.get(channel)

    if (!handler) {
      throw new Error(`Canale IPC non registrato: ${channel}`)
    }

    return handler({}, payload)
  }
}

const core: BackendCoreContract = {
  async echo(request) {
    return {
      messaggio: request.messaggio,
      ricevuto_il: '2026-07-06T00:00:00.000Z',
      lunghezza: request.messaggio.length
    }
  },
  async chat() {
    throw new Error('non usato nel test')
  },
  async retrieval() {
    throw new Error('non usato nel test')
  },
  async ricerca() {
    throw new Error('non usato nel test')
  },
  async uploadDocumento() {
    throw new Error('non usato nel test')
  }
}

test('l adattatore IPC valida la richiesta e ritorna la risposta echo validata', async () => {
  const ipcMain = new IpcMainSpy()
  registerBackendIpc(ipcMain, core)

  const response = await ipcMain.invoke(backendIpcChannels.echo, {
    messaggio: 'andata e ritorno',
    timestamp_client: '2026-07-06T00:00:00.000Z'
  })

  assert.deepEqual(response, {
    messaggio: 'andata e ritorno',
    ricevuto_il: '2026-07-06T00:00:00.000Z',
    lunghezza: 16
  })
})

test('l adattatore IPC rifiuta payload non validi prima di chiamare il core', async () => {
  const ipcMain = new IpcMainSpy()
  let called = false
  registerBackendIpc(ipcMain, {
    ...core,
    async echo(request) {
      called = true
      return core.echo(request)
    }
  })

  await assert.rejects(ipcMain.invoke(backendIpcChannels.echo, { messaggio: '' }))
  assert.equal(called, false)
})
