import { contextBridge, ipcRenderer } from 'electron'
import {
  backendIpcChannels,
  type BackendEchoRequest,
  type BackendEchoResponse
} from '@magistra/shared'

// Ponte sicuro tra renderer e main. Con contextIsolation attivo, il renderer
// non ha accesso diretto a Node/Electron: espone solo ciò che dichiariamo qui.
const api = {
  backend: {
    echo(request: BackendEchoRequest): Promise<BackendEchoResponse> {
      return ipcRenderer.invoke(backendIpcChannels.echo, request) as Promise<BackendEchoResponse>
    }
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('magistra', api)
  } catch (error) {
    console.error(error)
  }
}

export type MagistraApi = typeof api
